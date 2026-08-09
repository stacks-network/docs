---
description: >-
  Rotating the signer key bound to a signer-manager under PoX-5: the order the
  calls go in, when the switch has to happen relative to the reward cycle, and
  how a staker changes a Bitcoin payout address.
---

# Key and Address Rotation

An operator rotates the **signer key** their signer-manager is bound to. A staker changes the **Bitcoin payout address** their rewards are sent to. Neither requires anyone to unstake, and beyond both being called rotation the two have nothing in common.

If you are arriving from the PoX-4 model, where `stack-extend` carried a `signer-key` argument and pools had an operator key that could not be rotated at all, read [If you knew rotation under PoX-4](key-and-address-rotation.md#if-you-knew-rotation-under-pox-4) first.

***

## Rotate a signer key

Rotating changes which key is bound to your signer-manager. Your stakers do nothing, their positions do not move, and the manager does not leave the signer set.

{% hint style="warning" %}
**Do not revoke the old grant first.** Revoking takes every staking path through your manager offline: `stake`, `stake-update`, `register-for-bond` and `update-bond-registration` each re-verify the grant for the key currently registered, so all four fail with `ERR_SIGNER_KEY_GRANT_NOT_FOUND` (`u17`) until the new grant lands.

Nothing in pox-5 requires the old grant to be gone. `register-signer` writes with `map-set` and has no re-registration guard, and a manager can hold grants for several keys at once.
{% endhint %}

### 1. Write the new config file, but do not restart

Create the new `config.toml` with the new `stacks_private_key` alongside the running one. The signer reads its config only at startup, so writing the file changes nothing until you restart. Everything below uses this file, which means the key you are about to register and the key your signer will present come from the same source.

### 2. Generate the grant with the new key

The new key signs a SIP-018 message binding your signer-manager to an `auth-id`, under the `pox-5-signer` domain:

```bash
stacks-signer generate-staking-signature \
  --config /etc/stacks-signer/config-new.toml \
  --signer-manager SP1EXAMPLE.your-manager-name \
  --auth-id 2
```

Use a fresh `auth-id`. Each `(signer-key, signer-manager, auth-id)` triple can be consumed once, and reusing one fails with `ERR_SIGNER_KEY_GRANT_USED` (`u12`). That bites if you ever rotate back to a key you have used before. [Generate a Signer Signature](generate-signer-signature.md) covers the command in full.

### 3. Call `register-self` on your manager

`register-self` performs `grant-signer-key` and `register-signer` in a single transaction. It is admin-only, and `authorize-admin` asserts that `contract-caller` equals `tx-sender`, so it has to come from an admin account directly and cannot be routed through another contract.

This call is not prepare-phase gated, but it does have a deadline. See [When to register and when to restart](key-and-address-rotation.md#when-to-register-and-when-to-restart).

### 4. Verify that the new key is registered

Do this before touching the signer. A rotation that silently missed its cycle looks identical to one that worked, right up until you restart.

<details>

<summary>Two commands: what the chain has, and what your signer will present</summary>

**What the chain has.** `get-signer-info` on pox-5 returns the key currently bound to a signer-manager. It takes the manager as a hex-serialized Clarity principal, which you can produce with:

```bash
npm install c32check
node -e "
const c32 = require('c32check');
const [addr, name] = process.argv[1].split('.');
const [ver, hash160] = c32.c32addressDecode(addr);
console.log('0x06' + ver.toString(16).padStart(2,'0') + hash160
  + Buffer.from([name.length]).toString('hex')
  + Buffer.from(name,'ascii').toString('hex'));
" 'SP1EXAMPLE.your-manager-name'
```

Then read it back:

```bash
curl -sS -X POST -H "Content-Type: application/json" \
  --data '{"sender":"SP000000000000000000002Q6VF78","arguments":["<hex from above>"]}' \
  https://api.mainnet.hiro.so/v2/contracts/call-read/SP000000000000000000002Q6VF78/pox-5/get-signer-info
```

A registered manager returns `okay: true` and a result of `0x0a0200000021` followed by 66 hex characters, which are the signer key. `0a` is `some`, `02` is a buffer and `00000021` is its length of 33 bytes. An unregistered manager returns `0x09`, which is `none`.

Run against `SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.fastpool-max500-signer-manager`, whose serialized principal is `0x0616296a283b358830510c486f90c13d924b92a6590e1e66617374706f6f6c2d6d61783530302d7369676e65722d6d616e61676572`, the response is:

```
0x0a0200000021023d6e4adbd5e7bedd5a1e1b85940e1e8c6c34924fd0d584e5e15d84c8572083d9
```

**What your signer will present.** `check-config` prints the public key derived from a config file without starting the signer:

```bash
stacks-signer check-config --config /etc/stacks-signer/config-new.toml
```

Among the fields it prints:

```
Stacks address: SP1EXAMPLE
Public key: 023d6e4adbd5e7bedd5a1e1b85940e1e8c6c34924fd0d584e5e15d84c8572083d9
```

Those 66 characters are the same string the chain returns after `0x0a0200000021`. If they match, the restart is safe. If they do not, the restart takes your signer out of the set.

**Compare all 66 characters.** Two different signer keys live on mainnet today that both begin `023d6e`, so a glance at the start of a key proves nothing.

Seeing the old key on chain once the prepare phase has opened means the rotation missed this cycle. Do not restart the signer. Wait one cycle.

</details>

### 5. Restart the signer at the cycle boundary

Covered below. This is the step with no room in it.

### 6. Revoke the old grant, last and optionally

`revoke-signer-grant` is sent by the Stacks principal derived from the old signer key, not by the manager admin, and `contract-caller` is the authorization, so it cannot be forwarded through a contract. Its arguments are `(signer-manager, signer-key)`, the reverse order of `grant-signer-key`. Revoking a grant that does not exist is a no-op rather than a revert.

The reason to do it is hygiene. After a rotation the old grant stays active, so any admin of your manager could re-register the old key with it. An outsider cannot, because `register-signer` requires `contract-caller` to be the manager.

***

## When to register and when to restart

None of `grant-signer-key`, `register-signer` or `revoke-signer-grant` checks the reward phase. The constraint is the reward-set snapshot: the node computes each cycle's signer set once, at the first Stacks block whose burn view falls inside the prepare phase, reading the registered key live at that instant. Whichever key is registered then is frozen into that cycle.

### Register before the prepare phase

The prepare phase is the last 100 Bitcoin blocks of a cycle. Numbering a cycle's 2,100 blocks from its first reward-paying block, blocks 2,001 to 2,100 are the prepare phase, so a `register-self` transaction has to confirm at block 2,000 or earlier to count for the next cycle.

Treat 2,000 as the boundary, not the target. A Bitcoin block is roughly ten minutes and fee estimation is not a guarantee, so submit with room and then verify.

Missing the deadline is not an outage. The set for the next cycle still carries the old key, so you keep signing with the old key for one more cycle and the rotation lands a cycle late. The damage comes from missing it without noticing and restarting the signer as though it had worked, which is why step 4 exists.

<details>

<summary>How the deadline is calculated</summary>

The node's prepare-phase test is:

```rust
let effective_height = block_height - first_block_height;
let reward_index = effective_height % reward_cycle_length;
reward_index == 0 || reward_index > reward_cycle_length - prepare_length
```

With mainnet's cycle length of 2,100 and prepare length of 100, the prepare phase is `reward_index` 2,001 through 2,099, plus `reward_index` 0, which is the first block of the next cycle. The reward phase is 1 through 2,000.

The set is not computed at a fixed height. It is computed at the first Stacks block whose tenure burn height falls in that window and which finds the signer set still behind, guarded by a strict less-than that makes it fire once per cycle and never re-read pox-5 afterwards. Stacks blocks arrive about every ten seconds, so in practice that is moments after the prepare phase opens.

Source: `PoxConstants::static_is_in_prepare_phase` in [stackslib/src/burnchains/mod.rs](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/burnchains/mod.rs) at release 4.0.1.

</details>

### Restart at the cycle boundary

For a rotation registered during cycle N:

| Where you are                  | Which key the chain expects                                  |
| ------------------------------ | ------------------------------------------------------------ |
| Cycle N, blocks 1 to 2,000     | Old. Register the new key here.                              |
| Cycle N, blocks 2,001 to 2,100 | Old. The set for N+1 is computed here, carrying the new key. |
| Cycle N+1 onward               | New.                                                         |

So the restart belongs at the boundary between N and N+1. Restarting earlier, ten blocks before the prepare phase for instance, means signing with the new key while the chain still expects the old one for the rest of cycle N.

`stacks-signer` reads `config.toml` once at startup and holds one key. There is no reload signal and no way to carry both keys through the transition, so the switch is a hard cutover and the signer cannot sign while it restarts. Put that gap on the boundary, where the old key stops being valid anyway, rather than inside a cycle where it costs blocks. An operator carrying a large share of signer weight will want to sit on the boundary tightly. A small one can be looser.

### A trap with no guard

pox-5 does not check whether a signer key is already bound to another manager, and there is no error code for it. The node sums managers sharing a key into a single signer entry, so reusing a key across two managers merges them silently.

***

## Rotate a Bitcoin payout address

This is a staker action, and it lives at the signer-manager layer rather than in pox-5. pox-5 has no `pox-addr` parameter anywhere: rewards are sBTC by default, and a native BTC payout is an election carried in `signer-calldata` alongside a staking action.

For the reference signer-manager, `signer-calldata` deserializes to `{ pox-addr, max-fee }` and is stored per staker. Every staking action validates and rewrites that stored entry, so re-supplying calldata through `stake-update` changes the address. The election is not fixed for the term of the position.

{% hint style="warning" %}
**Re-staking without resupplying your address reverts you to sBTC.** Calldata of `none` on a later call deletes the stored entry rather than preserving it, and there is no error.
{% endhint %}

Unlike the key rotation, these paths are prepare-phase gated and fail with `ERR_STAKE_IN_PREPARE_PHASE` (`u47`) during the last 100 Bitcoin blocks of a cycle.

The deployed signer-managers do not all take the same calldata. `SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.fastpool-1-signer-manager` matches the reference implementation. `SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.fastpool-max500-signer-manager` is a separate rewrite with a different payout configuration. Build calldata against the contract you are staking to. [Stake to an Existing Signer-Manager](stack-with-a-pool.md) covers the differences.

***

## Key hygiene

**Keep the signer key and the manager admin key separate.** They authorize different things and neither substitutes for the other. Only an admin can call `register-self`. Only the principal derived from the signer key can revoke a grant. In a normal setup they belong to different people.

**Secure the admin key, and consider holding two.** The admin key can be rotated, which is an improvement on the PoX-4 pool operator key, but it also controls the manager's fee and fee withdrawal. Two admin keys, one warm and one in deeper cold storage, means neither a lost key nor a compromised one is terminal. The case gets stronger the more the manager handles: a manager taking a high fee holds proportionally more of other people's rewards, and `fastpool-1-signer-manager` has no on-chain guard against removing its last admin, while `fastpool-max500-signer-manager` blocks an admin from removing themselves. [Deploy a Signer-Manager Contract](../deploy-a-signer-manager-contract.md) covers which contract has which guard.

**Limit signer key exposure.** It lives on the signer host and is the one key that has to be online. It signs the grant and it signs blocks, and it should do nothing else. See [OpSec Best Practices](../run-a-signer/opsec-best-practices.md).

***

## If you knew rotation under PoX-4

The corrections to the old model, in one place. The source of each is the previous version of this page.

* **`stack-extend` and `stack-increase` took a `signer-key` argument**, so rotation happened per transaction and per cycle. Those functions do not exist in pox-5. A signer-manager holds one key through a grant, and rotation is a contract call on the manager rather than a stacking parameter.
* **There is no DKG.** PoX-4-era signers ran a distributed key generation round each cycle, which is why the old advice was to have the new key running before the prepare phase, called the DKG window. The node now validates individual signer signatures weighted by stake. The prepare phase still sets the deadline, for the reward-set snapshot described above, but not for DKG.
* **`pox-addr` is not a transaction argument.** `stack-extend`, `stack-aggregation-commit-indexed` and `delegate-stack-stx` each took one. pox-5 has none of those functions and no `pox-addr` parameter.
* **There is no pool operator key.** `delegate-stx` recorded the operator principal each member authorized, which is what made that key unrotatable without every member re-delegating. Delegation is gone. A pool under PoX-5 is a signer-manager that other people stake to, and its admin key can be rotated.

***

## Additional resources

* [pox-5.clar at release 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [SIP-045: PoX-5, Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [Generate a Signer Signature](generate-signer-signature.md)
* [OpSec Best Practices](../run-a-signer/opsec-best-practices.md)

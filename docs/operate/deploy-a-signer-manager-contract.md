---
description: >-
  For signer-key holders and pool operators deploying and binding a
  signer-manager contract under PoX-5.
---

# Deploy a Signer Manager Contract

{% hint style="info" %}
All Clarity references on this page are pinned to [`pox-5.clar` at `stacks-core` 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar) and to a [pinned mainnet build of the reference signer-manager](https://github.com/stx-labs/signer-sidekick/blob/11f8ff79e309db14357c4adfbbe31e1aeb7cd17e/contracts/reference-manager/generated/mainnet/signer-manager.clar).
{% endhint %}

### Who needs this page

Most integrators never write a signer-manager: they pick a signer and route through it, or they use the reference implementation as-is. This page is for the operator side: deploying a signer-manager contract and binding it to a signer key so stakers can route through it.

Doing all of it from the command line? Go straight to [Use stacks-cli to deploy the signer manager contract](deploy-a-signer-manager-contract.md#use-stacks-cli-to-deploy-the-signer-manager-contract), which covers deploy, grant, registration, admin rotation and revoke as one sequence.

### Which key does what

Four roles are involved and they do not have to be the same key. Only the staker's wallet holds the STX being locked.

| Role           | What it does                                                                                | Holds the staked STX    | Rotation                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Signer key** | Signs the one-time SIP-018 grant binding the signer to a manager. Lives on the signer host. | No                      | Keep it across upgrades. Its derived Stacks principal is the only one that can revoke the grant.                               |
| **Deployer**   | Broadcasts the contract deployment and becomes the first admin automatically.               | No, only the deploy fee | Needed only if this account is not fit to stay admin. Deploy from a hardened account and it can remain admin with no rotation. |
| **Admin**      | Calls `update-fees`, `withdraw-fees` and `update-admin`. Must be an EOA calling directly.   | No                      | When rotating: add the cold admin first, remove the deployer second. Never remove the last working admin.                      |
| **Staker**     | Submits the PoX-5 `stake` transaction and delegates to the manager.                         | Yes                     | Not applicable.                                                                                                                |

### What a signer is in PoX-5

* A signer is a **signer-manager contract**, identified in all contract state by its principal, with one associated signer key.
* Every staker (STX-only or bond participant) delegates to a signer-manager. A solo staker is a signer-manager with one member, so there is no separate "solo" signer set.
* The pox-5 contract hooks into the manager during staking actions via `validate-stake!`.
* Most operators do not need to write a contract at all. The reference signer-manager covers the common case: it accepts delegations, registers the signer key once, and handles reward accounting and onward distribution. Write your own only for custom needs: allowlisting members, different fee logic, custom sBTC routing.

{% hint style="warning" %}
**"Immutable" applies to the code, not the terms.** A deployed contract's Clarity source can never change, but the reference manager's _parameters_ can. An admin can call `update-fees` at any time, up to 99.99%, and `update-admin` lets any existing admin add or remove an admin, including itself. Stakers should read a manager's admin set and current fee rather than assume its economics are fixed.
{% endhint %}

### The `signer-manager` trait

Your contract must implement one method:

```clarity
(define-trait signer-manager-trait (
    (validate-stake!
        ;; staker, first-index, num-indexes, amount-ustx, amount-sats, is-bond, signer-calldata
        (principal uint uint uint uint bool (optional (buff 500)))
        (response bool uint)
    )
))
```

* `first-index` is a reward cycle for STX-only flows and a bond index for bond flows.
* `num-indexes` is the cycle count for STX-only, or `u1` for a bond.
* `amount-sats` is `u0` for STX-only, or the BTC commitment for bond legs.
* It is invoked only through pox-5's internal `signer-manager-validate-stake` wrapper, which raises a reentrancy guard (`signer-manager-call-active`) for the duration of the call. Any attempt to re-enter pox-5 from inside your `validate-stake!` callback fails with `ERR_REENTRANT_CALL (u49)`.
* pox-5 settles per-staker rewards itself, so your contract does not need to track staker-level accounting.

Your contract must also gate `validate-stake!` so only pox-5 can call it. The reference manager does this with:

```clarity
(define-private (authorize-pox-5)
    (ok (asserts! (is-eq contract-caller 'SP000000000000000000002Q6VF78.pox-5)
        ERR_UNAUTHORIZED_CALLER
    ))
)
```

#### `signer-calldata` is yours to define

pox-5 treats `signer-calldata` as opaque bytes. It forwards the buffer to `validate-stake!` and discards it, storing nothing and parsing nothing. Any meaning it carries is a convention your contract defines, and any value that must survive to claim time is state your contract has to persist itself.

The reference manager uses it to let a staker elect a native BTC payout. It deserializes the buffer with `from-consensus-buff?` into `{ pox-addr: { version, hashbytes }, max-fee }`, validates the address with `check-pox-addr`, and stores it in a `pox-addrs` map keyed by the staker principal:

```clarity
(map-set pox-addrs staker pox-addr)
```

At claim time `claim-staker-rewards` reads that entry back. With a record it calls `sbtc-withdrawal::initiate-withdrawal-request`, and without one it transfers sBTC directly. `max-fee` is the fee ceiling it passes to that withdrawal, not a fee the manager takes.

Clients read the same entry through `get-pox-addr`, which answers `none` for a staker who has not elected an address:

```clarity
(define-read-only (get-pox-addr (staker principal))
  (map-get? pox-addrs staker)
)
```

It returns `(optional { pox-addr: { version: (buff 1), hashbytes: (buff 32) }, max-fee: uint })`. This is how an app shows a staker where their rewards will land, and how it tells whether a manager keeps an election at all.

**What your manager has to accept**

A client builds this calldata once and sends it to whichever manager the staker picked. A manager stricter than the buffer it receives fails the staking transaction outright, so whatever you go on to do with the value, accept all of it:

* Both `none` and `(some buffer)` arrive, depending on which reward asset the staker chose. Requiring either one breaks the stakers who chose the other.
* Deserialize `hashbytes` as `(buff 32)`. A 20-byte value fits that type and a 32-byte value does not fit `(buff 20)`, and `from-consensus-buff?` answers a type mismatch with `none`, which surfaces as `ERR_INVALID_CALLDATA`.
* Accept the two-field `{ pox-addr, max-fee }` shape even if you add fields of your own, the way `fastpool-max500-signer-manager` accepts it alongside its own three-field tuple.
* Accept the full PoX address version range rather than the versions you have seen. Clients paying out to a Bitcoin lock send `0x04` with 20 bytes and `0x05` with 32; `check-pox-addr` already covers all of them.

**What the deployed managers do with it**

The convention is per contract, so calldata built for one manager is not portable to another. Read the contract you are staking to.

| Contract                         | Shape it deserializes                                                               | Stored in        | Read back with      | Changeable without a staking transaction |
| -------------------------------- | ----------------------------------------------------------------------------------- | ---------------- | ------------------- | ---------------------------------------- |
| `fastpool-1-signer-manager`      | `{ pox-addr, max-fee }`                                                             | `pox-addrs`      | `get-pox-addr`      | No                                       |
| `xverse-signer-manager-1`        | `{ pox-addr, max-fee }`                                                             | `pox-addrs`      | `get-pox-addr`      | No                                       |
| `fastpool-max500-signer-manager` | `{ pox-addr, max-fee, min-claim }`, and the two-field shape above is still accepted | `payout-configs` | `get-payout-config` | Yes, via `set-payout-config`             |
| `native-pool-signer-manager`     | None. The buffer is ignored entirely                                                | Nothing          | Nothing             | Not applicable                           |

Three consequences follow from that table.

**A manager can decline the feature.** `native-pool-signer-manager` never parses the buffer, so every staker on it is paid in sBTC and there is no Bitcoin payout to elect. Supplying calldata is not an error there, it simply has no effect.

**A shape can be extended compatibly.** `fastpool-max500-signer-manager` accepts its own three-field tuple and the reference implementation's two-field one, filling in `min-claim` with `max-fee` plus 547 when it is absent. That default is the lowest value it will accept, so a staker rolling over from a reference-implementation signer gets no meaningful floor until they set one.

**Where the value can be changed differs.** On the reference implementations the only writer is `validate-stake!`, so changing a payout address means another staking transaction, which is refused during the prepare phase. `fastpool-max500-signer-manager` adds `set-payout-config` and `clear-payout-config` as direct staker calls, both asserting `contract-caller` equals `tx-sender`, so they cannot be driven by an operator or through an intermediary contract.

Two consequences worth building around if you write your own manager. `validate-stake!` fires again on every `stake-update`, so a second call overwrites whatever the first stored, giving stakers rotation for free. And in the reference manager, calldata of `none` on a later call **deletes** the stored entry rather than preserving it, so a staker who re-stakes without resupplying their address reverts to sBTC payouts with no error.

### Deploy your contract

Deploy whichever signer-manager you have reviewed. Which one to pick depends on what the manager is for, since a solo signer and a public pool want different limits on the operator.

Deployed examples you can read on the explorer:

* [`fastpool-1-signer-manager`](https://explorer.hiro.so/txid/SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.fastpool-1-signer-manager?chain=mainnet) matches the [pinned reference implementation](https://github.com/stx-labs/signer-sidekick/blob/11f8ff79e309db14357c4adfbbe31e1aeb7cd17e/contracts/reference-manager/generated/mainnet/signer-manager.clar). It allows any fee from 0 to 99.99%, and an admin can remove any admin including themselves.
* [`xverse-signer-manager-1`](https://explorer.hiro.so/txid/SP8HK160YD5GHXP69VGA0TC7AQJ1X4CDW3XVERSE.xverse-signer-manager-1?chain=mainnet) is an **earlier revision** of the same reference implementation, with identical behaviour for stakers. The one difference is for integrators: its `claim-staker-rewards` returns only the amount claimed, where the current revision returns `{ earned, withdrawal-request }`. Code that reads the sBTC withdrawal request ID from the call return will not work against it.
* [`fastpool-max500-signer-manager`](https://explorer.hiro.so/txid/SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.fastpool-max500-signer-manager?chain=mainnet) caps the fee at 500 bips (`MAX_FEE_BIPS u500`, 5%) and blocks an admin from removing themselves (`ERR_CANNOT_REMOVE_SELF`), so it cannot be left with no admin. The tighter limits matter most for a public pool, where stakers hand STX to an operator they do not know.
* [`native-pool-signer-manager`](https://explorer.hiro.so/txid/SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.native-pool-signer-manager?chain=mainnet) is a different contract implementing the same trait rather than a variant of the reference. It gates entry on an external allowlist, takes no fee of its own, offers no Bitcoin payout election, and its `claim-staker-rewards` takes no staker argument, so each staker claims for themselves and nobody can claim on their behalf.

Because each deployment is immutable, "the reference implementation" is not one thing on chain. It is whichever revision its operator deployed on the day they deployed. More managers will appear, and they differ in more than these properties. Read the one you deploy.

The fee ceiling and the admin model are properties of the contract you deploy, not of pox-5, and they cannot be changed afterwards.

Mainnet and testnet builds are not interchangeable. The embedded pox-5 boot principal and the sBTC contract addresses differ, so a mainnet build fails analysis on testnet.

{% hint style="danger" %}
Do not deploy the `stacks-core` test fixture under `contrib/core-contract-tests/`. Its pox-5 and sBTC principals do not match mainnet. Confirm the deployed principal on-chain afterwards. A transaction ID confirms submission, not success.
{% endhint %}

The reference manager's deployer becomes its first admin automatically (`(map-set admins tx-sender true)`).

{% hint style="warning" %}
**Deploying with Ledger.** The deployment can be signed with a Ledger, so the deployer does not have to be a temporary software wallet. A wallet still builds and broadcasts the transaction; the Ledger only signs it.

Ledger Stacks App versions through `0.26.17` cannot sign a deployment payload that carries an explicit Clarity version, so leave any "force Clarity 6 payload" option switched off. With the version omitted, the node defaults the contract to Clarity 6, which it does since Epoch 4.0 activated. The Leather extension omits the version for you from version `6.107.0` onward. Stacks App `0.27.x` is expected to remove the restriction.
{% endhint %}

### Grant the signer-manager permission: `grant-signer-key`

The grant comes first. Registration re-checks it, so a manager cannot register a key it has not already been granted. [Generate a Signer Signature](staking-stx/generate-signer-signature.md) has the `stacks-signer` command that produces one.

{% stepper %}
{% step %}
#### Build the SIP-018 grant message

`get-signer-grant-message-hash` hashes a slim tuple under a domain pinned to pox-5:

```clarity
(define-constant POX_5_SIGNER_DOMAIN {
    name: "pox-5-signer",
    version: "1.0.0",
    chain-id: chain-id,
})

;; hashed alongside:
{
    topic: "grant-authorization",
    signer-manager: signer-manager,
    auth-id: auth-id,
}
```

The grant binds a signer key to a signer-manager and **nothing else**: no `max-amount`, `period`, `reward-cycle`, or `pox-addr`. The on-chain grant map is keyed only on `{ signer-key, signer-manager }`; replay protection adds `auth-id` in a separate map.
{% endstep %}

{% step %}
#### Sign it off-chain, then submit from the manager

The signer-key holder signs the hash off-chain with `signSignerGrant`. The **signer-manager contract** then submits `grant-signer-key`, and `contract-caller` must be the manager itself:

```clarity
;; Only the signer contract itself can call this function to grant a signer key
(asserts! (is-eq contract-caller signer-manager)
    ERR_UNAUTHORIZED_SIGNER_REGISTRATION
)
```

The reference manager wraps both calls in a single `register-self` entrypoint, submitting `grant-signer-key` and then `register-signer`.
{% endstep %}

{% step %}
#### Verify before submitting

* `fetchEligibleGrantSignerKey`: preflight, returns the failure reasons the call would hit
* `fetchSignerGrantMessageHash`: cross-check the hash against the chain
* `fetchVerifySignerKeyGrant`: is there already an active grant for this pair
* `fetchSignerKeyGrantUsed`: replay-guard check for a given `authId`
{% endstep %}
{% endstepper %}

```typescript
import {
  buildGrantSignerKey,
  fetchEligibleGrantSignerKey,
  signSignerGrant,
} from '@stacks/bitcoin-staking';

const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId,
  privateKey: signer.privateKey,
});

const eligible = await fetchEligibleGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  signerSignature,
  network,
});
if (!eligible.ok) {
  throw new Error('grant-signer-key would fail: u' + eligible.reasons.join(', u'));
}

const tx = await buildGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  publicKey: user.stxPublicKey,
  signerSignature,
  fee: 10_000n,
  nonce,
  network,
});
```

{% hint style="danger" %}
Generate the signature on the signer host. Never paste a signer private key or seed phrase into a website, chat, or email.
{% endhint %}

{% hint style="info" %}
Builders in `@stacks/bitcoin-staking` attach no post-conditions and default to `Deny` mode. Any transaction you build that moves an asset needs explicit post-conditions.
{% endhint %}

### Register the signer key: `register-signer`

With the grant in place, the signer-manager contract calls `pox-5::register-signer` to bind itself to the signer key.

```clarity
;; Only the signer contract itself can register itself
(asserts! (is-eq contract-caller signer)
    ERR_UNAUTHORIZED_SIGNER_REGISTRATION
)
```

Same caller rule as the grant: `contract-caller` must equal the signer-manager. It cannot be forwarded through an intermediary contract, and it cannot be sent by an EOA on the manager's behalf. Violating this aborts with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)`.

Read the registered key back on-chain with `get-signer-info`, or via `fetchSignerInfo` in the SDK.

### Revoke a grant: `revoke-signer-grant`

Takes `signer-manager` first, then `signer-key`. It must be sent **directly** by the Stacks principal derived from the signer key. `contract-caller` is the authorization, so it cannot be forwarded through an intermediary contract, and no SIP-018 message is needed:

```clarity
(asserts!
    (is-eq
        (unwrap-panic (principal-construct?
            (if is-in-mainnet
                STACKS_ADDR_VERSION_MAINNET
                STACKS_ADDR_VERSION_TESTNET
            )
            (hash160 signer-key)
        ))
        contract-caller
    )
    ERR_UNAUTHORIZED
)
```

Calling from any other principal fails with `ERR_UNAUTHORIZED (u1)`.

Revoking is not a kill switch. It blocks future `register-signer` calls for that pair, and because every new-stake entrypoint re-checks the grant, it also stops an already-registered manager accepting **new** stake. Existing positions are left alone: the manager's `signers` entry stays intact so outstanding obligations can still be settled, and those positions wind down as their bonds and stakes expire.

### Error codes

From pox-5:

| Code  | Constant                               | Meaning                                                                                                      |
| ----- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `u1`  | `ERR_UNAUTHORIZED`                     | `revoke-signer-grant` sent by a principal other than the one derived from the signer key.                    |
| `u12` | `ERR_SIGNER_KEY_GRANT_USED`            | Replay protection. `(signer-key, signer-manager, auth-id)` already used.                                     |
| `u13` | `ERR_INVALID_SIGNATURE_RECOVER`        | Could not recover a public key from the 65-byte RSV signature.                                               |
| `u14` | `ERR_INVALID_SIGNATURE_PUBKEY`         | Recovered pubkey does not match the `signer-key` argument.                                                   |
| `u17` | `ERR_SIGNER_KEY_GRANT_NOT_FOUND`       | A staking or registration entrypoint ran against a `(signer-manager, signer-key)` pair with no active grant. |
| `u26` | `ERR_UNAUTHORIZED_SIGNER_REGISTRATION` | `register-signer` or `grant-signer-key` invoked with `contract-caller != signer-manager`.                    |
| `u49` | `ERR_REENTRANT_CALL`                   | Reentrant call into pox-5 while a `signer-manager-validate-stake` call was in flight.                        |

The reference signer-manager has its own separate error namespace, which you will hit during setup and distribution rather than staking:

| Code    | Constant                         | Meaning                                                                             |
| ------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `u1001` | `ERR_NO_CLAIMABLE_REWARDS`       | Nothing to claim, or a staker's share does not cover the maximum L1 fee they set.   |
| `u1002` | `ERR_UNAUTHORIZED_ADMIN`         | An admin-only call from a non-admin, or proxied through a contract.                 |
| `u1003` | `ERR_INVALID_CALLDATA`           | `signer-calldata` did not deserialize into the expected pox-addr and max-fee tuple. |
| `u1004` | `ERR_INVALID_POX_ADDR`           | Address version above `u6`, or hashbytes the wrong length for that version.         |
| `u1005` | `ERR_INVALID_FEES_BIPS`          | Fee outside the allowed range.                                                      |
| `u1006` | `ERR_UNAUTHORIZED_CALLER`        | `validate-stake!` invoked by something other than pox-5.                            |
| `u1007` | `ERR_INSUFFICIENT_FEES`          | Attempted to withdraw more fees than have accrued.                                  |
| `u1008` | `ERR_UNKNOWN_WITHDRAWAL_REQUEST` | Settlement or reclaim referenced a withdrawal request the manager has no record of. |
| `u1009` | `ERR_WITHDRAWAL_NOT_REJECTED`    | Reclaim attempted on a withdrawal the sBTC registry has not rejected.               |
| `u1010` | `ERR_NO_REFUNDS`                 | Nothing available to sweep.                                                         |
| `u1011` | `ERR_WITHDRAWAL_NOT_ACCEPTED`    | Settlement attempted on a withdrawal the sBTC registry has not accepted.            |

Other managers do not share that namespace. `fastpool-max500-signer-manager` extends it with `u1012` through `u1017`, while `native-pool-signer-manager` uses `u37001` through `u37003` and reuses none of the codes above. Do not map a manager error by number without knowing which contract produced it.

### Signer fees

A signer-manager may take a commission on the rewards it distributes. This is contract-level logic, not a pox-5 protocol feature: pox-5 settles per-staker rewards to the manager, and the manager decides whether to retain a fee before onward distribution.

In the reference manager:

* `update-fees` sets the fee, in basis points. Admin-only. The default at deploy is `u0`, and the bound is one-sided: `(asserts! (< new-fees MAX_BIPS) ERR_INVALID_FEES_BIPS)` with `MAX_BIPS` of `u10000`, so any value from `u0` to `u9999` is accepted, i.e. 0% to 99.99%.
* `withdraw-fees` collects accrued fees, taking an amount and a recipient. Admin-only, and capped at what has actually accrued.

Both require a direct call from an admin EOA: `authorize-admin` asserts `(is-eq contract-caller tx-sender)`, so admin actions cannot be proxied through another contract.

The fee is a percentage of sBTC rewards, deducted before payout, including before an sBTC-to-L1 BTC withdrawal. It applies to both bond participants and STX-only stakers. [Take a Signer Fee](take-a-signer-fee.md) covers the operator workflow in detail.

### Use stacks-cli to deploy the signer manager contract

`stacks-cli` is the binary from `stacks-core`. It ships in the node image alongside `stacks-signer`, so there is nothing to build.

You need a reviewed signer-manager `.clar` file, a hot key to deploy with, and a cold key to hand admin control to. **Fund the cold key too**: it signs the last step and pays that fee itself.

The CLI cannot sign with a hardware wallet or a multisig, so the deploying key is always hot and the rotation in steps 4 and 5 is part of the deployment rather than an optional hardening pass.

Examples use `docker`. For Fedora, RHEL and immutable Linux, see the note at the end of this section.

#### Setup

```bash
IMG=ghcr.io/stacks-network/stacks-core:4.0.1@sha256:ceb768f881ef52a1d2792a2b4a89d81e092b1df11293b04c31ce36613c3f9711
read -rs STX_SK && export STX_SK
```

`read -rs` takes the key without echoing it and keeps it out of shell history.

Both variables live only in the current shell. Re-run this block in a new terminal. If you forget, the failure gives no hint: with `$IMG` empty, the runtime reads the next word as the image name and reports `short-name resolution enforced but cannot prompt without a TTY`.

#### How broadcasting works

Every command below writes a signed transaction as hex to stdout and stops. The CLI never broadcasts. Each step therefore ends the same way:

```bash
python3 -c "import binascii;open('tx.bin','wb').write(binascii.unhexlify(open('tx.hex').read().strip()))"
curl -sS -X POST -H "Content-Type: application/octet-stream" --data-binary @tx.bin \
  https://api.mainnet.hiro.so/v2/transactions   # or your own node RPC
```

A transaction ID confirms submission, not success. Confirm each step landed before starting the next, and increment the nonce as you go.

#### 1. Deploy

```bash
docker run --rm -e STX_SK -v ./signer-manager.clar:/tmp/sm.clar:ro $IMG \
  stacks-cli publish "$STX_SK" <fee> <nonce> <contract-name> /tmp/sm.clar > tx.hex
```

Five positionals in that order. Add `--testnet` for the default testnet, or `--testnet=0x<chain-id>` for a custom one.

Broadcast, then confirm the contract published.

#### 2. Generate the signer-key grant

Run this on the signer host, where the key and config already live.

```bash
docker run --rm -v /etc/stacks-signer/config.toml:/tmp/signer.toml:ro $IMG \
  stacks-signer generate-staking-signature \
  --config /tmp/signer.toml \
  --signer-manager <deployer-address>.<contract-name> \
  --auth-id <unique-uint> \
  --json
```

Output is JSON containing `signerKey`, `signerSignature` and `authId`. It contains no private key, which is what makes it safe to move to wherever you build the next transaction.

`auth-id` is a replay guard. The tuple of signer key, signer manager and auth-id can be consumed once.

**The grant is bound to the network in your config.** There is no chain-id flag; it comes from the `network` field. A grant generated against the wrong network aborts at the next step with `ERR_INVALID_SIGNATURE_PUBKEY (u14)`, which reads as a wrong-key problem and sends you looking in the wrong place.

#### 3. Register the manager against the signer key

Admin-only, so run it while the deploying key is still the admin. The three values come from step 2.

```bash
docker run --rm -e STX_SK $IMG \
  stacks-cli contract-call "$STX_SK" <fee> <nonce> \
  <deployer-address> <contract-name> register-self \
  -e \'<deployer-address>.<contract-name> \
  -e 0x<signerKey> \
  -e u<authId> \
  -e 0x<signerSignature> > tx.hex
```

The first argument is a trait reference, passed as the contract's own principal.

#### 4. Add the cold admin, from the hot deploy key

```bash
docker run --rm -e STX_SK $IMG \
  stacks-cli contract-call "$STX_SK" <fee> <nonce> \
  <deployer-address> <contract-name> update-admin \
  -e \'SP<COLD-ADMIN-PRINCIPAL> -e true > tx.hex
```

Arguments come in flag and value pairs, `-e` to evaluate or `-x` for a hex-serialized Clarity value. The backslash-escaped apostrophe is the form the tool's own help uses for a principal literal.

#### 5. Remove the hot key, from the cold admin

Load the cold key into `STX_SK` and repeat with `false`. This proves the cold key can sign and retires the hot key in one call.

```bash
docker run --rm -e STX_SK $IMG \
  stacks-cli contract-call "$STX_SK" <fee> <nonce> \
  <deployer-address> <contract-name> update-admin \
  -e \'SP<HOT-DEPLOYER-PRINCIPAL> -e false > tx.hex
```

**Keep the signer key.** Rotating admin does not transfer everything. Revoking a grant is authorised by the signer key, not by admin status, so a cold admin cannot revoke.

The reference manager has no on-chain guard against removing the last admin. `(update-admin tx-sender false)` as the only admin permanently bricks every admin function, including `withdraw-fees`, and any accrued sBTC becomes unreachable. The ordering above is what protects against it: a wallet that is not an admin fails with `ERR_UNAUTHORIZED_ADMIN (u1002)` and changes nothing, so whoever succeeds at the removal is demonstrably not the last admin. `fastpool-max500-signer-manager` blocks self-removal in the contract and rejects the call with `ERR_CANNOT_REMOVE_SELF`.

#### Revoking, from the CLI

Not part of setup. This call goes to `pox-5`, not to your manager, and is authorised by the signer key rather than by admin status.

```bash
docker run --rm -e STX_SK $IMG \
  stacks-cli contract-call "$STX_SK" <fee> <nonce> \
  SP000000000000000000002Q6VF78 pox-5 revoke-signer-grant \
  -e \'<deployer-address>.<contract-name> \
  -e 0x<signerKey> > tx.hex
```

Argument order is `signer-manager` then `signer-key`, the reverse of `grant-signer-key`. Getting it backwards aborts with `ERR_UNAUTHORIZED (u1)`, which looks like a permissions problem.

**The registration is expected to persist.** `get-signer-info` still resolves your manager to that signer key after a successful revoke. Check grant state, not registration. See [Revoke a grant](deploy-a-signer-manager-contract.md#revoke-a-grant-revoke-signer-grant) for why.

#### On Fedora, RHEL and immutable Linux

Substitute `podman` for `docker`. The commands are otherwise identical, with one exception.

SELinux relabels bind mounts, so the two steps that mount a file, the deploy and the grant, need `z`:

```bash
podman run --rm -e STX_SK -v ./signer-manager.clar:/tmp/sm.clar:ro,z $IMG \
  stacks-cli publish "$STX_SK" <fee> <nonce> <contract-name> /tmp/sm.clar > tx.hex
```

Without it the container cannot read the file and the tool reports `IO error reading CLI input: Permission denied (os error 13)`.

#### Which key does which call

`register-self`, `update-admin`, `update-fees`, `withdraw-fees` and `sweep-fee-refunds` are admin-gated. `revoke-signer-grant` is gated on the signer key. In a normal setup those are different keys and different people.

Admin calls cannot be proxied: `authorize-admin` asserts `contract-caller` equals `tx-sender`, so an admin action must be a direct top-level call from the admin principal. A CLI-signed transaction satisfies this; a call routed through another contract does not.

#### Why there is no Clarity version flag

`publish` emits payload type `0x01` with no version byte, and the node applies its current default, which is Clarity 6 since Epoch 4.0.

### What changed from PoX-4

If you operated under PoX-4, three things are different.

A signer used to be a `{ btcRewardAddress, signerKey }` tuple in a reward set. It is now a contract principal with one associated signer key.

PoX-4 scoped every staking call with a per-transaction signer signature carrying an amount, a period, and a pox-addr. PoX-5 replaces all of that with the one-time grant above, which carries a signer-manager and an `auth-id` and nothing else. See [Generate a Signer Signature](staking-stx/generate-signer-signature.md).

Reward routing has moved out of the protocol. `register-for-bond` carries no `pox-addr` argument, and pox-5 pays sBTC to the manager rather than BTC to an address in a reward set. Electing a native BTC payout is now a signer-manager concern, handled through `signer-calldata`.

---
description: >-
  How to open a protocol bond: the allowlist, the two Bitcoin legs, the
  registration deadline, and what the contract checks.
---

# Opening a Bond Position

A protocol bond pairs locked STX with a Bitcoin leg for 12 reward cycles, about six months. You open one with a single `register-for-bond` call on Stacks. The Bitcoin leg is either native BTC under a timelock you fund on Bitcoin first, or sBTC the contract takes from you in the same call.

For STX-only staking, see [Stake to an Existing Signer-Manager](../staking-stx/stack-with-a-pool.md). For how bonds work, see [Bitcoin Staking](https://docs.stacks.co/learn/bitcoin-staking).

## Before you start

* **An allowlist entry for the bond.** Every registration needs one, on either leg. Getting on the allowlist is an off-chain conversation with the Stacks Endowment, and the list is fixed when the bond is set up, roughly seven days before it starts. To bond sBTC without an entry of your own, join a [bond pool](bond-pool-operator-guide.md).
* **A signer-manager** that is registered and holds a live signer-key grant. Your rewards route through it.
* **Enough STX.** Each bond sets a minimum amount of STX per BTC. Your locked plus unlocked balance must cover the amount you commit.
* **No overlapping position.** A principal holds one position at a time, and a bond cannot overlap an STX-only stake or another bond.

## Pick your Bitcoin leg

|                 | Native BTC                                               | sBTC                               |
| --------------- | -------------------------------------------------------- | ---------------------------------- |
| What is locked  | BTC in a timelocked output on Bitcoin that you control   | sBTC transferred to the contract   |
| Steps           | Fund on Bitcoin, wait for confirmation, then register    | One Stacks transaction             |
| Ending it early | `announce-l1-early-exit`, then a co-signed Bitcoin spend | `unstake-sbtc`, in part or in full |
| Pool option     | No                                                       | Yes                                |

A registration uses one leg or the other, never both, and the leg is fixed for the term.

## Timing

* **Register before the bond starts.** After the start height the contract rejects the call with `ERR_BOND_ALREADY_STARTED (u43)`. There is no grace period.
* **Not in the prepare phase.** The last 100 Bitcoin blocks before every cycle boundary, including the one before the bond starts, reject registration with `ERR_STAKE_IN_PREPARE_PHASE (u47)`. In practice the last block you can register in is 101 blocks before the bond's start height.
* **Native BTC confirms first.** Registration proves a confirmed Bitcoin output, so fund the lock address early enough to confirm and still register in time.

{% hint style="danger" %}
**A late registration does not release your BTC.** The timelock is enforced by Bitcoin, not by the registration. If you fund the lock address and the registration then fails or misses the deadline, the BTC stays locked until the output's unlock height.
{% endhint %}

Moving into a new bond from an ending bond or stake uses the same call. See [Rolling into a new position](ending-or-changing-a-bond-position.md#rolling-into-a-new-position).

## Native BTC, step by step

{% stepper %}
{% step %}
### Confirm your allowlist entry

Read your cap for the bond. A missing entry means you are not allowlisted.
{% endstep %}

{% step %}
### Derive the lock address

The address is deterministic: it comes from your Stacks address, the bond's unlock height, your `staker-unlock-bytes`, and the bond's `early-unlock-bytes`. Anyone can rederive it to check the lock.

{% hint style="danger" %}
**Keep your lock script.** The contract does not store your `staker-unlock-bytes` or the lock script built from them, so save the lock script when you register. If you lose it, rebuild it from your `register-for-bond` transaction. See [Verifying and Reclaiming Your Locked Bitcoin](verifying-and-reclaiming-your-locked-bitcoin.md).
{% endhint %}
{% endstep %}

{% step %}
### Fund it and wait for confirmation

Send the BTC from a wallet that can pay to a P2WSH output. You can lock across up to 10 outputs in one registration, and the total must stay within your cap.
{% endstep %}

{% step %}
### Register on Stacks

Call `register-for-bond` with the STX amount, your signer-manager, and a proof for each output: the block header, the raw transaction, and its Merkle path.
{% endstep %}

{% step %}
### Confirm the position

A transaction ID confirms submission, not success. Read the membership back before treating the bond as open.
{% endstep %}
{% endstepper %}

## sBTC, in one transaction

Call `register-for-bond` with the sBTC amount instead of lockup proofs. The contract transfers the sBTC from you. Attach post-conditions for the STX lock and the sBTC transfer: under the default deny mode, the transaction aborts without them.

## What the contract checks

`register-for-bond` checks, in order:

* On the native BTC leg, the bond exists `(u7)`, then each lockup output in turn: a complete 80-byte header `(u39)`, a transaction that decodes and has the output you named `(u1, u2 or u3)`, unlock height in range `(u52)`, script `(u42)`, amount `(u45)`, no duplicate outpoint `(u46)`, a header matching the Bitcoin block at that height `(u40)`, and Merkle proof `(u41)`. The `u1` to `u3` codes come from Clarity's `get-bitcoin-tx-output?`, not from pox-5.
* The bond exists `(u7)` and you are on its allowlist `(u11)`.
* Not in the prepare phase `(u47)`.
* Your STX amount meets the bond's minimum for your sats `(u8)`.
* The bond has not started `(u43)`.
* No overlapping STX-only stake `(u19)`.
* Your sats are within your cap `(u10)`, and your balance covers the STX `(u8)`.
* Your signer-manager accepts the stake. This is a call into the manager contract, which can reject it with its own error.
* The signer-manager is registered `(u23)` with a live grant `(u17)`.
* No overlapping bond membership `(u9)`, and, when rolling from an ending bond, the rollover window is open `(u48)`.

## What you are committing to

* **12 reward cycles.** Your STX stays locked until the bond ends, whichever leg you chose.
* **The full amount up front.** You cannot add BTC or sBTC to a membership after registration.
* **Ending early changes the Bitcoin leg only.** See [Ending or Changing a Bond Position](ending-or-changing-a-bond-position.md).

## Building a registration

For wallet, custodian, and app developers. The examples use [`@stacks/bitcoin-staking`](https://www.npmjs.com/package/@stacks/bitcoin-staking) 7.6.0. The canonical lock script is the contract's `construct-lockup-script` in [`pox-5.clar`](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731).

### Step 1: check the allowlist and derive the lock address

```ts
import {
  buildRegisterMetadata,
  fetchBond,
  fetchBondAllowance,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const network = 'mainnet';

const allowance = await fetchBondAllowance({ bondIndex, address: staker, network });
if (allowance === undefined || allowance < intendedSats) {
  throw new Error(`Not allowlisted for ${intendedSats} sats on bond ${bondIndex}`);
}

const bond = await fetchBond({ bondIndex, network });
const meta = buildRegisterMetadata({
  bondIndex,
  poxInfo: await fetchPoxInfo({ network }),
  bitcoinPublicKey, // 33-byte compressed key that signs the unlock
  stxAddress: staker,
  earlyUnlockBytes: bond.earlyUnlockBytes,
  network,
});
// Fund meta.lockAddress. Persist meta.lockScript and meta.unlockBytes.
```

### Step 2: build the proof once the output confirms

```ts
import { buildLockProof } from '@stacks/bitcoin-staking';

const esplora = 'https://mempool.space/api';
const [txHex, header, merkleProof, block] = await Promise.all([
  fetch(`${esplora}/tx/${btcTxid}/hex`).then(r => r.text()),
  fetch(`${esplora}/block/${blockHash}/header`).then(r => r.text()),
  fetch(`${esplora}/tx/${btcTxid}/merkle-proof`).then(r => r.json()),
  fetch(`${esplora}/block/${blockHash}`).then(r => r.json()),
]);

const output = buildLockProof({
  txHex,
  header,
  merkleProof,
  txCount: block.tx_count,
  unlockHeight: meta.unlockHeight,
  lockScript: meta.lockScript,
});
```

### Step 3: preflight and build the registration

```ts
import { buildRegisterForBond, fetchEligibleRegisterForBond } from '@stacks/bitcoin-staking';
import { Pc } from '@stacks/transactions';

const lockup = { kind: 'btc', outputs: [output], unlockBytes: meta.unlockBytes } as const;

// Replays the contract's gates read-only. reasons[0] is the code the call would fail with.
const eligible = await fetchEligibleRegisterForBond({
  bondIndex,
  staker,
  amountUstx,
  lockup,
  signerManager,
  network,
});
if (!eligible.ok) throw new Error(`register-for-bond would fail: ${eligible.reasons.join(', ')}`);

// Unsigned transaction. The staker signs and broadcasts it.
const tx = await buildRegisterForBond({
  bondIndex,
  signerManager,
  amountUstx,
  lockup,
  publicKey, // the staker's Stacks public key
  fee,
  nonce,
  network,
  postConditions: [Pc.principal(staker).willSendEq(amountUstx).ustxToLock()],
});
```

The preflight does not run the signer-manager's own acceptance check, and it verifies only part of each lockup proof: the unlock height, the duplicate-outpoint check and the header. The Merkle proof, script, amount and transaction parse are verified on-chain only.

### The sBTC variant

Pass `lockup: { kind: 'sbtc', sbtcSats }` and add a post-condition for the sBTC transfer. The contract moves only the difference between the sBTC it already holds for you and the new total, so bound it from above:

```ts
postConditions: [
  Pc.principal(staker).willSendEq(amountUstx).ustxToLock(),
  Pc.principal(staker).willSendLte(sbtcSats).ft(poxInfo.sbtcContract, 'sbtc-token'),
],
```

### Step 4: confirm the membership

```ts
import { fetchBondMembership } from '@stacks/bitcoin-staking';

const membership = await fetchBondMembership({ address: staker, network });
```

`fetchBondMembership` returns `undefined` until the registration lands, and again once the bond's term has ended.

---
description: >-
  Native-BTC and sBTC paired-bond enrollment, L1 timelock verification, and
  renewal.
---

# Paired BTC

Paired bonds combine a Bitcoin-side commitment (native BTC under a [P2WSH CLTV timelock](../glossary.md#p2wsh-cltv-l1-timelock-script), or sBTC locked inside the contract) with a paired STX lock on Stacks. Both legs commit for the full bond period.

The same `register-for-bond` entrypoint serves both cases. For native-BTC enrollments it verifies each lockup output on-chain via a full SPV proof.

A few structural constraints to design around:

* **L1 BTC or sBTC, never both.** A staker locks native BTC under a timelock, or locks sBTC in the contract. Choose one type per registration. You cannot mix native BTC and sBTC in the same bond.
* **Registration is atomic and one-shot.** A principal registers once per bond. A second registration that overlaps the existing membership is rejected. There is no way to add more locked BTC to a bond after registration — commit the full amount up front.
* **One bond at a time.** Bond participation excludes STX-only staking and any other concurrent bond for the same STX principal. See [Concepts › One position per principal](../concepts.md#one-position-per-principal).

***

### Which leg, under which conditions

Registration commits one BTC leg. The staker selects the leg at `register-for-bond` time, and the leg is fixed for the term:

| Leg        | At registration                                                                                                                                                                                                                          | During the term                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **L1 BTC** | The staker proves each timelock UTXO with an SPV proof. Each output carries its own unlock height, at or above the bond's minimum unlock height. The contract rebuilds and checks the lock script for each output. No sBTC is custodied. | Each output unlocks at its own committed height, once the bond reaches its unlocked phase. |
| **sBTC**   | The contract transfers the sBTC amount from the staker.                                                                                                                                                                                  | Withdraw sBTC at any time — not gated by the rollover window.                              |

Beyond these checks, every registration also verifies: the staker is on the bond's allowlist, the locked sats stay under the staker's cap, the paired STX amount meets the minimum for that BTC at the bond's ratio, the chosen signer is registered with an active key grant, and no overlapping STX-only stake or bond membership exists.

***

### Enroll with native BTC

Native-BTC enrollment has three steps. Fund the lock address on Bitcoin and let the deposit confirm before you send the registration call. At registration, PoX-5 checks that the funded output exists in a confirmed Bitcoin block and matches the expected lock script.

```
1. Check the allowlist (contact the Endowment to get allowlisted for a bond, before it is announced)
   ↓
2. Derive the lock address, then fund it on Bitcoin
   ↓
3. Call the register function on Stacks
```

Expect step 2 to dominate the wall-clock time. Confirmations on Bitcoin take \~10 minutes per block, and you'll typically want 1–6 before moving to step 3.

#### Step 1 — Confirm the allowlist entry

Fail fast if the user isn't approved for the bond, or if their cap is below the amount they intend to commit. This is a cheap read; do it before any wallet prompts.

```ts
import { fetchBondAllowance } from '@stacks/bitcoin-staking';

const network = 'mainnet';
const intendedSats = 2_500_000_000n; // 25 BTC

const allowance = await fetchBondAllowance({
  bondIndex: bond.index,
  address: user.stxAddress,
  network,
});
if (allowance < intendedSats) {
  throw new Error(`not allowlisted for ${intendedSats} sats on bond ${bond.index}`);
}
```

#### Step 2 — Lock BTC on L1

The locking address is deterministic — it's derived from the staker's STX address (a standard or contract principal; both serialize into the script's preimage via their Clarity consensus buffer), the bond's unlock height, the `stakerUnlockBytes` tail you choose, and the bond's `earlyUnlockBytes` (the early-exit subscript stored in `protocol-bonds.early-unlock-bytes` for this bond). Anyone can rederive it later to verify the lock from a Bitcoin explorer.

`buildRegisterMetadata` derives the whole chain in one call — unlock height → unlock tail → lock script → address / output script — and returns a `RegisterMetadata`: `{ lockAddress, lockScript, outputScript, unlockBytes, unlockHeight }`. Fund `lockAddress`; keep `lockScript` and `unlockBytes` for step 3 (`buildLockProof` accepts `lockScript` directly, and `unlockBytes` goes into the registration's lockup).

```ts
import { buildRegisterMetadata, fetchPoxInfo } from '@stacks/bitcoin-staking';

const meta = buildRegisterMetadata({
  bondIndex: bond.index,
  poxInfo: await fetchPoxInfo({ network }),
  bitcoinPublicKey: user.btcPublicKey, // 33-byte compressed
  stxAddress: user.stxAddress,
  earlyUnlockBytes: bond.earlyUnlockBytes, // from fetchBond(...)
  network,
});
// meta.lockAddress — fund this; meta.lockScript + meta.unlockBytes — keep for step 3
```

For address-only derivation there is also `buildLockAddress`, which takes `stxAddress`, `unlockHeight`, `earlyUnlockBytes`, `network`, and either a pre-encoded `unlockBytes` tail or a compressed `publicKey` (from which it derives the default `<pubkey> OP_CHECKSIG` tail).

Spelled out, the same derivation step by step:

```ts
import {
  buildUnlockScript,
  buildLockScript,
  computeBondUnlockHeight,
  fetchPoxInfo,
  scriptToAddress,
} from '@stacks/bitcoin-staking';

const pox = await fetchPoxInfo({ network });

// Mirrors the contract's get-bond-l1-unlock-height for this bond index;
// throws if pox-5 hasn't activated on-chain yet.
const unlockHeight = computeBondUnlockHeight({
  bondIndex: bond.index,
  poxInfo: pox,
});
const unlockBytes = buildUnlockScript(user.btcPublicKey); // <pubkey> OP_CHECKSIG
const script = buildLockScript({
  stxAddress: user.stxAddress,
  unlockHeight,
  unlockBytes,
  earlyUnlockBytes: bond.earlyUnlockBytes,
});
const lockingAddress = scriptToAddress(script, 'mainnet');
```

Show `lockingAddress` and `intendedSats` to the user and have them send the funds — typically from a Bitcoin wallet they control, or via a custodian. The SDK does not construct or broadcast this Bitcoin transaction; that's whatever Bitcoin tooling your user is on.

Once the BTC has been sent, wait until the deposit lands and has enough confirmations before moving to step 3. How you watch for that — a polling loop against an explorer API, a Bitcoin node's `getrawtransaction`, a webhook from your custodian — is up to your stack.

Timing notes:

* **Hard deadline.** Step 3 must land on Stacks before the bond's start height. There is no grace period.
* **Prepare-phase guard.** Step 3 must also land outside the prepare phase. Broadcast earlier in the cycle, or wait for the next one.
* **Late deposit, locked BTC.** If the deposit lands too late and step 3 reverts, the BTC stays locked until the script's unlock height. The L1 timelock does not depend on L2 registration succeeding.
* **In-flight rollover.** A caller already holding a non-overlapping STX-only stake, or a bond inside its L1 unlock window, can move directly into a new bond through the same registration call. Any custodied sBTC moves over as a net-difference transfer. Check with the eligible helpers first to confirm timing.

#### Step 3 — Register on L2 with SPV proofs

`register-for-bond` performs full on-chain SPV verification of each lockup output. For every output you commit, the caller must supply:

* the 80-byte BTC block header that includes the lockup tx,
* the raw BTC tx bytes (legacy / non-segwit serialization — the bytes that hash to the txid),
* the merkle sibling path from the leaf txid to the block's merkle root,
* the position of the tx within the block and the block's total tx count,
* the sats amount of the lockup output,
* and the unlock burn height committed in that output's timelock.

Each output's `unlockBurnHeight` is the CLTV height baked into its P2WSH script. It must be at or above the bond's minimum unlock height and below `500,000,000` (Bitcoin reads larger values as Unix timestamps, not block heights). Outputs in the same registration can use different unlock heights. The value you commit on Bitcoin must match the value you supply here.

The SDK assembles this tuple for you. `buildLockProof` takes the raw indexer responses — the transaction, block header, merkle proof, and block transaction count — plus either the output script or the lock script from step 2. It handles the byte-level details of matching the lockup output and folding the merkle proof. For callers driving `bitcoind` directly, `buildLockProofFromBlock` builds the same proof from a raw `getblock` response.

```ts
import {
  buildLockProof,
  buildLockOutputScript,
  buildRegisterForBond,
  fetchConstructLockupOutputScript,
  fetchEligibleRegisterForBond,
} from '@stacks/bitcoin-staking';
import { bytesToHex } from '@stacks/common';
import { broadcastTransaction, fetchNonce, signTransaction } from '@stacks/transactions';

const esplora = 'https://mempool.space/api';
const outputScript = buildLockOutputScript({
  stxAddress: user.stxAddress,
  unlockHeight,
  unlockBytes,
  earlyUnlockBytes: bond.earlyUnlockBytes,
});

// Cross-check locally-built script against the contract before funding.
const onchain = await fetchConstructLockupOutputScript({ stxAddress: user.stxAddress, unlockHeight, unlockBytes, earlyUnlockBytes: bond.earlyUnlockBytes, network });
if (bytesToHex(outputScript) !== bytesToHex(onchain)) {
  throw new Error('lockup script mismatch — SDK and contract disagree; do NOT fund');
}

const [txHex, header, merkleProof, blockMeta] = await Promise.all([
  fetch(`${esplora}/tx/${btcTxid}/hex`).then(r => r.text()),
  fetch(`${esplora}/block/${blockHash}/header`).then(r => r.text()),
  fetch(`${esplora}/tx/${btcTxid}/merkle-proof`).then(r => r.json()),
  fetch(`${esplora}/block/${blockHash}`).then(r => r.json()),
]);

const lockupProof = buildLockProof({
  txHex,
  header,
  merkleProof,
  txCount: blockMeta.tx_count,
  unlockHeight, // CLTV height the script commits to; recorded in the output tuple
  outputScript, // or: lockScript — the witness script from buildRegisterMetadata
});

// Preflight: dry-runs register-for-bond's assert chain via read-only calls.
// Returns { ok: true } or { ok: false, reasons } — the contract's own error
// codes in evaluation order, so reasons[0] is what the tx would abort with.
const eligible = await fetchEligibleRegisterForBond({
  bondIndex: bond.index,
  staker: user.stxAddress,
  amountUstx: bond.requiredUstx,
  satsTotal: lockupProof.amount,
  signerManager: 'SP000…USER.signer-manager',
  outputs: [lockupProof], // enables the header (u40), duplicate-outpoint (u46), and unlock-height (u52) checks
  network,
});
if (!eligible.ok) throw new Error('register-for-bond would fail: u' + eligible.reasons.join(', u'));

const tx = await buildRegisterForBond({
  bondIndex: bond.index,
  signerManager: 'SP000…USER.signer-manager',
  amountUstx: bond.requiredUstx,
  lockup: {
    kind: 'btc',
    outputs: [lockupProof],
    unlockBytes,
  },
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, user.stxPrivateKey),
  network,
});
```

The preflight rebuilds most of the contract's checks client-side — allowlist, timing, STX minimum and balance, signer registration, overlaps, and the rollover window. It does not decide whether the signer manager accepts the stake: that call belongs to the signer manager contract, which validates and accepts or rejects the stake at registration time. The SPV checks on the lockup proof are also verified only on-chain.

After this tx confirms on Stacks (typically a few minutes), the position is live. Use [`fetchBondMembership`](read-only.md) to verify it landed and to read the canonical record back.

**What the contract checks for each output**

For each lockup output, the contract checks, in order:

1. **Unlock height is in range.** The height must be at or above the bond's minimum unlock height, and below the point where Bitcoin would read it as a timestamp instead of a block height. The SDK mirrors this cap client-side, so `buildLockScript` and `fetchConstructLockupOutputScript` reject an out-of-range height before you fund anything.
2. **Script matches.** The output's script must match the expected lock script for that staker and unlock height.
3. **Amount matches.** The output's value must equal the amount you supplied.
4. **Outpoint is unique.** The same output cannot appear twice in one registration.
5. **Header is canonical.** The block header must hash to the header Stacks itself recorded for that height.
6. **Merkle proof is valid.** The proof must fold up to the block's merkle root. A single-transaction block is accepted directly when the root equals the transaction ID.

The total sats across all outputs becomes the BTC-side commitment recorded for the membership.

***

### Enroll with sBTC (no L1 lock)

Same call, but `lockup: { kind: 'sbtc', sbtcSats }`. No timelock script, no Bitcoin transaction, no SPV proofs — the contract custodies sBTC directly via `roll-sbtc` ([pox-5.clar:1943](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1943)), which transfers the net delta from the staker to the contract. The whole flow is a single Stacks transaction once the allowlist check passes.

Because `roll-sbtc` pulls the sBTC **from the caller**, the transaction must carry a `postConditions` entry covering that transfer — the default post-condition deny mode aborts it otherwise.

```ts
import {
  buildRegisterForBond,
  fetchBondAllowance,
  fetchEligibleRegisterForBond,
} from '@stacks/bitcoin-staking';
import { Pc } from '@stacks/transactions';

const intendedSats = 2_500_000_000n; // sBTC measured in sats

const allowance = await fetchBondAllowance({
  bondIndex: bond.index,
  address: user.stxAddress,
  network,
});
if (allowance < intendedSats) throw new Error('not allowlisted');

// Same preflight as the native-BTC path — omit `outputs` for sBTC.
const eligible = await fetchEligibleRegisterForBond({
  bondIndex: bond.index,
  staker: user.stxAddress,
  amountUstx: bond.requiredUstx,
  satsTotal: intendedSats,
  signerManager: 'SP000…USER.signer-manager',
  network,
});
if (!eligible.ok) throw new Error('register-for-bond would fail: u' + eligible.reasons.join(', u'));

// `sbtcContract` is the network's sBTC token contract principal.
const postConditions = [
  Pc.principal(user.stxAddress).willSendEq(intendedSats).ft(sbtcContract, 'sbtc-token'),
];

const tx = await buildRegisterForBond({
  bondIndex: bond.index,
  signerManager: 'SP000…USER.signer-manager',
  amountUstx: bond.requiredUstx,
  lockup: { kind: 'sbtc', sbtcSats: intendedSats },
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  postConditions,
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, user.stxPrivateKey),
  network,
});
```

#### Exit an sBTC position

`unstake-sbtc` withdraws part or all of the custodied sBTC and transfers it back to the staker. It only works on sBTC-backed memberships, the signer manager must match the staker's current signer, the amount must be at or below the staker's current sBTC shares, and calls during the prepare phase are rejected. Check with the eligible helpers first. The L1 counterpart of leaving early is `announce-l1-early-exit` — see [mid-bond mutations](paired-btc.md#mid-bond-mutations).

```ts
import { buildUnstakeSbtc, fetchEligibleUnstakeSbtc } from '@stacks/bitcoin-staking';

const amountToWithdrawSats = 50_000_000n;

const eligible = await fetchEligibleUnstakeSbtc({
  staker: user.stxAddress,
  signerManager: 'SP000…USER.signer-manager',
  amountToWithdrawSats,
  network,
});
if (!eligible.ok) throw new Error('unstake-sbtc would fail: u' + eligible.reasons.join(', u'));

const tx = await buildUnstakeSbtc({
  signerManager: 'SP000…USER.signer-manager',
  amountToWithdrawSats,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});
```

***

### The expected P2WSH lockup script

The deterministic script the contract recomputes for SPV verification is, per `construct-lockup-script` ([pox-5.clar:3711:3731](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)):

```
OP_IF
  <unlock-burn-height as c-script-num push>
  OP_CHECKLOCKTIMEVERIFY
OP_ELSE
  OP_SIZE <32> OP_EQUALVERIFY
  OP_SHA256 <H = sha256(sha256(to-consensus-buff(staker)))> OP_EQUALVERIFY
  <early-unlock-bytes>
OP_ENDIF
OP_VERIFY
<staker-unlock-bytes>
```

The output's scriptPubKey is the P2WSH wrapper: `0x0020 || sha256(<script>)`. `construct-lockup-output-script` produces exactly those 34 bytes.

`staker-unlock-bytes` and `early-unlock-bytes` are concatenated **raw** — the contract does not wrap them with `push-script-bytes`. The caller supplies self-contained, pre-pushed Bitcoin script fragments. The `OP_ELSE` branch additionally requires the spender to reveal a 32-byte preimage of `H` (a sha256-double-hash of the staker's consensus buff), binding the early-exit spend to the staker. Each fragment's stack contract is:

* **`staker-unlock-bytes`** runs unconditionally after `OP_ENDIF` and must validate the staker's signature **leaving a truthy result on the stack** — e.g. the default `<pubkey> OP_CHECKSIG` tail produced by `buildUnlockScript`.
* **`early-unlock-bytes`** runs inside the `OP_ELSE` branch and must also leave a boolean on the stack (consumed by the shared `OP_VERIFY` after `OP_ENDIF`). Use `<pubkey> OP_CHECKSIG` (not `OP_CHECKSIGVERIFY`) or an M-of-N `OP_CHECKMULTISIG` template — the subscript must leave a bool, not consume it. The bytes themselves come from `protocol-bonds.early-unlock-bytes` for the bond — read them via `fetchBond(...)` and pass them through.

The two branches let the same locking output be spent either:

* **after CLTV matures** (the `OP_IF` branch — only `staker-unlock-bytes` must be satisfied), or
* **before CLTV matures, via the early-exit signer set** (the `OP_ELSE` branch — both `early-unlock-bytes` and `staker-unlock-bytes` must be satisfied, plus the staker's 32-byte commitment preimage `computeRegisterPreimage(stxAddress)`).

The same `unlockBytes` value you passed at registration time is what the SDK feeds into `buildLockScript` to rederive the P2WSH address.

***

### Mid-bond mutations

Two contract functions touch an existing native-BTC membership without ending it. Full coverage lives in the dedicated flows; the brief is:

* **`update-bond-registration`** rotates the signer manager mid-bond. The new signer manager takes effect from the next cycle, adjusted to stay within the bond's start and end. Rewards settle on both the old and new signers before the switch, so the rotation cannot affect accrued sBTC. The new signer manager must differ from the current one, and the call is rejected during the prepare phase.
* **`announce-l1-early-exit`** is the L2 mirror of an off-cycle BTC unlock. Only the staker can call it, and only on L1-locked memberships. It settles rewards for each remaining bond cycle, then marks the membership's BTC amount as withdrawn and records that the staker has announced an early exit. The staker's STX stays locked through the bond's normal unlock cycle. The call is rejected during the prepare phase, and a staker cannot announce twice.

Both have eligibility preflights. Rotating the signer:

```ts
import {
  buildUpdateBondRegistration,
  fetchEligibleUpdateBondRegistration,
} from '@stacks/bitcoin-staking';

const eligible = await fetchEligibleUpdateBondRegistration({
  staker: user.stxAddress,
  signerManager: newSignerManager,
  oldSignerManager: currentSignerManager,
  network,
});
if (!eligible.ok) throw new Error('update-bond-registration would fail: u' + eligible.reasons.join(', u'));

const tx = await buildUpdateBondRegistration({
  signerManager: newSignerManager,
  oldSignerManager: currentSignerManager,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});
```

Announcing the L1 early exit — check `fetchHasAnnouncedL1EarlyExit` first, since a second announce reverts:

```ts
import {
  buildAnnounceL1EarlyExit,
  fetchEligibleAnnounceL1EarlyExit,
  fetchHasAnnouncedL1EarlyExit,
} from '@stacks/bitcoin-staking';

const announced = await fetchHasAnnouncedL1EarlyExit({
  bondIndex: membership.bondIndex, // from fetchBondMembership(...)
  staker: user.stxAddress,
  network,
});
if (announced) throw new Error('early exit already announced for this bond');

const eligible = await fetchEligibleAnnounceL1EarlyExit({
  staker: user.stxAddress,
  oldSignerManager: currentSignerManager,
  network,
});
if (!eligible.ok) throw new Error('announce-l1-early-exit would fail: u' + eligible.reasons.join(', u'));

// Signed and broadcast by the staker themselves — not via an intermediary contract.
const tx = await buildAnnounceL1EarlyExit({
  staker: user.stxAddress,
  oldSignerManager: currentSignerManager,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});
```

***

### Renew into the next bond period

Renewal is a fresh `register-for-bond` for the next bond index, with a new L1 timelock matching that period's unlock height. The user spends their unlocked BTC into the new locking address, then supplies SPV proofs for the new output.

The renewal window is the bond's [re-lock phase](../glossary.md#re-lock-phase) — half a reward cycle, 1,050 blocks (\~7.3 days) on mainnet, ending the bond on L2: L1 is expired but STX is still locked, giving the user time to construct the next L1 timelock without losing continuity. Miss this window and STX unlocks at the bond's end, ending the position.

```ts
import {
  buildLockScript,
  buildLockOutputScript,
  buildLockProof,
  buildRegisterForBond,
  computeBondUnlockHeight,
  fetchConstructLockupOutputScript,
  fetchPoxInfo,
  scriptToAddress,
} from '@stacks/bitcoin-staking';
import { bytesToHex } from '@stacks/common';

const pox = await fetchPoxInfo({ network });

// The next period's minimum unlock height — same derivation as the first enrollment.
const unlockHeight = computeBondUnlockHeight({
  bondIndex: next.index,
  poxInfo: pox,
});
const script = buildLockScript({
  stxAddress: user.stxAddress,
  unlockHeight,
  unlockBytes,
  earlyUnlockBytes: next.earlyUnlockBytes,
});
const newLockingAddress = scriptToAddress(script, 'mainnet');

// Same proof shape as initial enrollment — assembled from indexer responses.
const outputScript = buildLockOutputScript({
  stxAddress: user.stxAddress,
  unlockHeight,
  unlockBytes,
  earlyUnlockBytes: next.earlyUnlockBytes,
});

// Cross-check locally-built script against the contract before funding.
const onchain = await fetchConstructLockupOutputScript({ stxAddress: user.stxAddress, unlockHeight, unlockBytes, earlyUnlockBytes: next.earlyUnlockBytes, network });
if (bytesToHex(outputScript) !== bytesToHex(onchain)) {
  throw new Error('lockup script mismatch — SDK and contract disagree; do NOT fund');
}

const lockupProof = buildLockProof({
  txHex: await fetch(`${esplora}/tx/${btcTxid}/hex`).then(r => r.text()),
  header: await fetch(`${esplora}/block/${blockHash}/header`).then(r => r.text()),
  merkleProof: await fetch(`${esplora}/tx/${btcTxid}/merkle-proof`).then(r => r.json()),
  txCount: (await fetch(`${esplora}/block/${blockHash}`).then(r => r.json())).tx_count,
  unlockHeight,
  outputScript,
});

const tx = await buildRegisterForBond({
  bondIndex: next.index,
  signerManager: 'SP000…USER.signer-manager',
  amountUstx: user.lockedUstx, // can adjust at renewal time
  lockup: {
    kind: 'btc',
    outputs: [lockupProof],
    unlockBytes,
  },
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, user.stxPrivateKey),
  network,
});
```

#### Atomic relock on Bitcoin

Instead of withdrawing then re-locking, spend the prior P2WSH output directly into `newLockingAddress` once its CLTV has matured. `buildReclaim` constructs this spend: on the `'locktime'` path it sets `nLockTime` to the prior unlock height and the input's `nSequence` to non-final (`0xfffffffe`) so CLTV is enforced, and `finalizeReclaim` assembles the branch-selecting witness (`[ stakerSig, 0x01, witnessScript ]`) that btc-signer's own finalizer can't build for this custom script.

```ts
import { buildReclaim, finalizeReclaim } from '@stacks/bitcoin-staking';

// Known from the original enrollment.
declare const priorScript: Uint8Array; // buildLockScript / RegisterMetadata.lockScript at lock time
const utxo = (await fetch(`https://mempool.space/api/address/${oldLockingAddress}/utxo`)
  .then(r => r.json()))[0];

const tx = buildReclaim({
  path: 'locktime',
  utxo: { txid: utxo.txid, vout: utxo.vout, value: BigInt(utxo.value) },
  lockScript: priorScript, // carries the CLTV height; or pass unlockHeight explicitly
  output: { address: newLockingAddress, feeSats },
  network: 'mainnet',
});
tx.signIdx(user.btcPrivateKey, 0);
const { txHex } = finalizeReclaim({ path: 'locktime', tx });

await fetch('https://mempool.space/api/tx', { method: 'POST', body: txHex });
```

The same call with `output.address` set to the staker's own BTC address withdraws instead of relocking — see [Reclaim the locked BTC](paired-btc.md#reclaim-the-locked-btc).

***

### Reclaim the locked BTC

The lockup script has two spend paths, and the SDK builds both (`buildReclaim` with `path: 'locktime' | 'early-exit'`):

* **`'locktime'`** — the normal CLTV exit (`OP_IF` branch). Single-sig by the staker, spendable once Bitcoin block height reaches the output's committed `unlock-burn-height`.
* **`'early-exit'`** — the cosigned exit (`OP_ELSE` branch), valid at any height. Requires both the staker's signature and one satisfying the bond's `early-unlock-bytes` subscript from the [early-exit signer set](../glossary.md#early-exit-signer-set), plus the 32-byte preimage binding the spend to the staker. Pair it with `announce-l1-early-exit` on L2 (see [mid-bond mutations](paired-btc.md#mid-bond-mutations)).

#### Build the reclaim transaction

`buildReclaim` returns a complete PSBT-capable `@scure/btc-signer` transaction: one P2WSH input (with `witnessUtxo` + `witnessScript` set, so `tx.toPSBT()` / `Transaction.fromPSBT()` round-trip it) and one sweep output.

```ts
import { buildReclaim, fetchBond, finalizeReclaim } from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex, network });
const tx = buildReclaim({
  path: 'locktime',
  utxo: { txid, vout, value }, // the lockup UTXO (esplora/mempool-shaped)
  output: { address: userBtcAddress, feeSats }, // sweep destination + miner fee
  // Either pass the witness script kept from enrollment...
  lockScript,
  // ...or the four pieces to rebuild it:
  // stxAddress, unlockHeight, stakerBtcPublicKey, earlyUnlockBytes: bond.earlyUnlockBytes,
  network,
});

tx.signIdx(user.btcPrivateKey, 0); // leaves a partialSig on input 0
const { txHex, txid: reclaimTxid } = finalizeReclaim({ path: 'locktime', tx });
```

The options:

| Option                                                                 | Meaning                                                                                                                                                                          |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                                                                 | `'locktime'` or `'early-exit'` — which script branch the witness will take.                                                                                                      |
| `utxo`                                                                 | The lockup UTXO: `{ txid, vout, value }` (display-endian txid, sats as `bigint`) — the shape esplora/mempool.space return.                                                       |
| `lockScript`                                                           | The lockup witness script. A staker who enrolled via `buildRegisterMetadata` reuses `RegisterMetadata.lockScript` verbatim.                                                      |
| `stxAddress`, `unlockHeight`, `stakerBtcPublicKey`, `earlyUnlockBytes` | Alternative to `lockScript`: the four inputs to rebuild it (`earlyUnlockBytes` comes from `fetchBond(...)`). Provide `lockScript` **or** all four.                               |
| `output`                                                               | Required `{ address, feeSats }` for the sweep output: `address` receives `utxo.value − feeSats`, `feeSats` is left for miners. The caller supplies both — there are no defaults. |
| `network`                                                              | Stacks network name or object — selects the Bitcoin network for address encoding.                                                                                                |

The sweep pays `utxo.value − feeSats` to `output.address` (a fee at or above the UTXO value throws). Adjust outputs and fee on the returned tx **before** signing — the `SIGHASH_ALL` signatures commit to them. The vsize is deterministic for a given sweep-address type (one P2WSH input, one output), so a fee-rate-based `feeSats` can be computed up front.

Branch mechanics the builder encodes:

|                   | `'locktime'` (`OP_IF`)                                                                            | `'early-exit'` (`OP_ELSE`) |
| ----------------- | ------------------------------------------------------------------------------------------------- | -------------------------- |
| Input `nSequence` | `0xfffffffe` (non-final, so CLTV is enforced)                                                     | `0xffffffff`               |
| Tx `nLockTime`    | the output's unlock height — from `unlockHeight`, else parsed out of the `lockScript`'s CLTV push | `0`                        |
| Spendable         | once Bitcoin height reaches the committed `unlock-burn-height`                                    | any height                 |
| Signatures        | staker only                                                                                       | staker + cosigner          |

`unlockHeight` here is the **actual** height the output was funded at (carried in the lock script), not necessarily the bond minimum from `fetchBondL1UnlockHeight` — an output committed above the minimum unlocks at its own height. On the locktime path, passing neither `unlockHeight` nor a `lockScript` that encodes one throws.

#### Sign and finalize

Three ways to get a signature onto input 0 — all leave a `partialSig` that rides inside `tx.toPSBT()`:

* **Software key, in process** (most callers): `tx.signIdx(privateKey, 0)`.
* **Detached software signer**: `signReclaim(computeReclaimSighash(tx), privateKey)` produces the DER signature with the trailing `SIGHASH_ALL` byte; attach it with `tx.updateInput(0, { partialSig: [[publicKey, sig]] })`. Its `lowR` option defaults to `false`, matching btc-signer's `signIdx` default, so both produce byte-identical signatures.
* **Hardware wallet / other library**: sign the digest from `computeReclaimSighash` (the input-0 BIP-143 sighash) and attach it the same way.

`computeReclaimSighash` reads the `witnessScript` and input amount off the tx (set by `buildReclaim`, preserved through PSBT round-trips). For a tx re-parsed from **raw hex** — which carries neither — re-supply them: `computeReclaimSighash(tx, { witnessScript, amountSats })`. Recompute after any output or fee change; the signature commits to the outputs.

`finalizeReclaim` assembles the branch-selecting witness from the `partialSig`(s) on input 0 — matching each signature's public key against the two 33-byte keys in the lockup script to tell staker from cosigner — and returns `{ txHex, txid }`. btc-signer's own `finalize()` can't build this witness (it doesn't know the branch, selector, or preimage), which is why the reclaim flow ends with `finalizeReclaim` instead. The witness stacks:

* `'locktime'`: `[ stakerSig, 0x01, witnessScript ]` — the truthy selector takes the `OP_IF` branch.
* `'early-exit'`: `[ stakerSig, cosignerSig, preimage, <empty>, witnessScript ]` — the empty selector takes `OP_ELSE`; `preimage` is the 32-byte staker-binding value (rebuilt from `stxAddress`, see the [lockup-script template](paired-btc.md#the-expected-p2wsh-lockup-script)).

A missing staker signature — or, on the early-exit path, a missing cosigner signature — throws. Broadcasting the returned `txHex` is left to the caller.

#### Cosigned early exit

The full sign and co-sign flow, including the signing-service API, is on the [Early Exit](advanced/early-exit.md) page.

The early-exit spend needs two signatures over the same sighash, typically produced on different machines. The staker builds and part-signs the tx, ships it to the cosigner as a PSBT, and finalizes once the cosigner's signature comes back:

```ts
import {
  buildReclaim,
  computeReclaimSighash,
  finalizeReclaim,
  signReclaim,
} from '@stacks/bitcoin-staking';

const tx = buildReclaim({
  path: 'early-exit',
  utxo,
  lockScript,
  output: { address: userBtcAddress, feeSats },
  network,
});

// Staker signs in-process…
tx.signIdx(user.btcPrivateKey, 0);

// …the cosigner signs the same digest, possibly out-of-process via PSBT
// (`tx.toPSBT()` / `Transaction.fromPSBT()` round-trip the witness data).
const sighash = computeReclaimSighash(tx);
const cosignerSig = signReclaim(sighash, cosignerPrivateKey);
tx.updateInput(0, { partialSig: [[cosignerPublicKey, cosignerSig]] });

const { txHex } = finalizeReclaim({ path: 'early-exit', tx, stxAddress: user.stxAddress });
```

If the cosigner adjusts outputs or fee, both parties must re-sign — recompute the sighash after any change.

***

### Errors

`register-for-bond` surfaces a focused set of error codes:

| Code  | Constant                        | Meaning                                                                                                        |
| ----- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `u7`  | `ERR_BOND_NOT_FOUND`            | No bond exists at the given index.                                                                             |
| `u8`  | `ERR_INSUFFICIENT_STX`          | Paired STX amount is below the minimum for the given sats.                                                     |
| `u9`  | `ERR_ALREADY_REGISTERED`        | Caller has a membership that overlaps the new bond's term. A non-overlapping membership can roll over instead. |
| `u10` | `ERR_TOO_MUCH_SATS`             | Lockup sats total exceeds the caller's allowlist cap.                                                          |
| `u11` | `ERR_NOT_ALLOWLISTED`           | Caller is not allowlisted for this bond.                                                                       |
| `u19` | `ERR_ALREADY_STAKED`            | Caller has an STX-only stake that overlaps the new bond's term. A non-overlapping stake can roll over instead. |
| `u23` | `ERR_SIGNER_NOT_FOUND`          | The cited signer is not registered.                                                                            |
| `u39` | `ERR_READ_TX_OUT_OF_BOUNDS`     | The raw BTC transaction is truncated or malformed at the given output index.                                   |
| `u40` | `ERR_INVALID_BTC_HEADER`        | The header does not hash to the burn-chain header at that height.                                              |
| `u41` | `ERR_INVALID_MERKLE_PROOF`      | The merkle path does not reconstruct the block's merkle root.                                                  |
| `u42` | `ERR_INVALID_LOCKUP_SCRIPT`     | The output's script does not match the expected lock script.                                                   |
| `u43` | `ERR_BOND_ALREADY_STARTED`      | The registration window is closed — the bond has already started.                                              |
| `u45` | `ERR_INVALID_LOCKUP_AMOUNT`     | The decoded output value does not match the supplied amount.                                                   |
| `u46` | `ERR_DUPLICATE_LOCKUP_OUTPOINT` | The same output appears twice in the registration's lockup list.                                               |
| `u47` | `ERR_STAKE_IN_PREPARE_PHASE`    | The call landed during the prepare phase. Broadcast earlier in the cycle.                                      |
| `u48` | `ERR_ROLLOVER_TOO_EARLY`        | Rollover attempted before the existing bond reached its L1 unlock window.                                      |
| `u49` | `ERR_REENTRANT_CALL`            | A reentrant call into PoX-5 was detected during a signer-manager call.                                         |
| `u52` | `ERR_INVALID_UNLOCK_HEIGHT`     | The output's unlock height is below the bond's minimum, or too high to be read as a block height.              |

---
description: >-
  Native-BTC and sBTC paired-bond enrollment, L1 timelock verification, and
  renewal.
---

# Paired BTC

Paired bonds combine a Bitcoin-side commitment (native BTC under a [P2WSH CLTV timelock](../glossary.md#p2wsh-cltv-l1-timelock-script), or sBTC locked inside the contract) with a paired STX lock on Stacks. Both legs commit for the full bond period.

The same `register-for-bond` entrypoint serves both cases. For native-BTC enrollments it verifies each lockup output on-chain via a full SPV proof.

A few structural constraints to design around:

* **L1&#x20;**_**or**_**&#x20;sBTC, never both.** The `btc-lockup` argument is a `response`: the `ok` branch carries a list of L1 timelock outputs (up to 10, so a participant _can_ spread their BTC across multiple timelock UTXOs), the `err` branch carries an sBTC amount in sats. You pick one branch per registration — you cannot mix native L1 locks and sBTC in the same bond.
* **Registration is atomic and one-shot.** A principal registers once per bond; a second `register-for-bond` that overlaps the existing membership reverts with `ERR_ALREADY_REGISTERED`. There is currently no way to add more locked BTC to a bond after registering — commit the full amount up front.
* **One bond at a time.** Bond participation excludes STX-only staking and any other concurrent bond for the same STX principal. See [Concepts › One position per principal](../concepts.md#one-position-per-principal).

***

### Enroll with native BTC

Native-BTC enrollment is a three-step sequence with a real wait in the middle. The L1 lock must confirm on Bitcoin **before** the L2 registration is sent, because PoX-5 verifies — at registration time — that the cited output exists in a confirmed Bitcoin block under the expected P2WSH lockup script.

```
1. Allowlist check (L2 read)
   ↓
2. Derive lock address  →  fund it on Bitcoin  →  wait for confirmations
   ↓
3. Gather SPV proofs for each lockup output  →  register on L2
```

Expect step 2 to dominate the wall-clock time. Confirmations on Bitcoin take \~10 minutes per block, and you'll typically want 1–6 before assembling the proofs in step 3.

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
  lockScriptToAddress,
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
const lockingAddress = lockScriptToAddress(script, 'mainnet');
```

Show `lockingAddress` and `intendedSats` to the user and have them send the funds — typically from a Bitcoin wallet they control, or via a custodian. The SDK does not construct or broadcast this Bitcoin transaction; that's whatever Bitcoin tooling your user is on.

Once the BTC has been sent, wait until the deposit lands and has enough confirmations before moving to step 3. How you watch for that — a polling loop against an explorer API, a Bitcoin node's `getrawtransaction`, a webhook from your custodian — is up to your stack.

Timing notes:

* **Hard deadline.** Step 3 must land on Stacks **before** the bond's start height. The contract hard-asserts `burn-block-height < bond-start-height` and otherwise returns `ERR_BOND_ALREADY_STARTED (u43)`. There is no grace period.
* **Prepare-phase guard.** Step 3 must also land outside the prepare phase. The contract rejects `register-for-bond` calls made during the prepare phase with `ERR_STAKE_IN_PREPARE_PHASE (u47)`; broadcast earlier in the cycle, or wait for the next.
* **Late deposit, locked BTC.** If the deposit lands too late and step 3 reverts, the BTC stays locked until the script's `unlockHeight` — the L1 timelock is independent of L2 registration succeeding.
* **In-flight rollover.** A caller already holding a non-overlapping STX-only stake or a bond inside its L1 unlock window can move directly into a new bond via the same `register-for-bond` call: `bond-overlaps-new-position?` gates overlap, `verify-bond-rollover-window` gates timing (returns `ERR_ROLLOVER_TOO_EARLY (u48)` if the prior bond hasn't reached its L1 unlock), and any custodied sBTC moves over via `roll-sbtc` as a net-difference transfer.

#### Step 3 — Register on L2 with SPV proofs

`register-for-bond` performs full on-chain SPV verification of each lockup output. For every output you commit, the caller must supply:

* the 80-byte BTC block header that includes the lockup tx,
* the raw BTC tx bytes (legacy / non-segwit serialization — the bytes that hash to the txid),
* the merkle sibling path from the leaf txid to the block's merkle root,
* the position of the tx within the block and the block's total tx count,
* the sats amount of the lockup output,
* and the unlock burn height committed in that output's timelock.

Each output's `unlockBurnHeight` is the CLTV height baked into its P2WSH script. It may be **any** height at or above the bond's minimum L1 unlock height (`get-bond-l1-unlock-height`) and below `500,000,000` (Bitcoin reads larger CLTV values as Unix timestamps), and the choice is per-output — a registration can mix outputs with different unlock heights as long as each one stays in that range. The contract reconstructs the expected script per output from this height, so the value you commit on Bitcoin must equal the one you supply here.

The TypeScript shape per output (see `BondL1LockupOutput`):

```ts
interface BondL1LockupOutput {
  height: number;                          // BTC block height containing the tx
  tx: Uint8Array | string;                 // raw BTC tx bytes (buff 100000)
  outputIndex: number;                     // index of the lockup output in tx
  header: Uint8Array | string;             // 80-byte BTC block header
  leafHashes: (Uint8Array | string)[];     // merkle sibling hashes, bottom-up
  txCount: number;                         // total tx count in the block
  txIndex: number;                         // 0-indexed position of tx in block
  amount: bigint;                          // sats — must match parsed output
  unlockBurnHeight: number;                // CLTV height in this output's script; >= bond minimum
}
```

The SDK assembles this tuple for you. `buildLockProof` takes the four Esplora-compatible indexer responses (raw tx hex, 80-byte block header, `/tx/:txid/merkle-proof` — the `EsploraMerkleProof` shape `{ block_height, merkle, pos }`, with `merkle` sibling hashes in display order — and the block's `tx_count`) plus exactly one way to locate the lockup output: `outputScript` (the 34-byte P2WSH `scriptPubKey`, from `buildLockOutputScript`) or `lockScript` (the witness script it commits to — what `buildRegisterMetadata` returns, converted internally). It strips the segwit witness so the bytes hash to the txid, reverses the sibling hashes from display to internal endianness, and locates the lockup output by matching its `scriptPubKey` against the expected script. For callers driving `bitcoind` directly without an `/merkle-proof` endpoint, `buildLockProofFromBlock` derives the position and merkle branch from `getblock`'s `tx` array.

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

The preflight rebuilds the contract's gate order client-side (allowlist, timing, STX minimum and balance, signer registration and key grant, overlaps, rollover window). It does not cover the signer-manager's `validate-stake!` trait call, nor the merkle-proof (u41), output-script (u42), amount (u45), and tx-parse (u39) checks — those are verified only on-chain.

After this tx confirms on Stacks (typically a few minutes), the position is live. Use [`fetchBondMembership`](read-only.md) to verify it landed and to read the canonical record back.

**What the contract checks for each output**

The private helpers `verify-l1-lockups` and `validate-l1-lockup` ([pox-5.clar:1984:2113](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1984-L2113)) fold over the outputs and assert, per output, in this order:

1. **Unlock height is in range.** The output's `unlock-burn-height` must be `>=` the bond's minimum L1 unlock height from `get-bond-l1-unlock-height` (carried into the fold as `minimum-unlock-height`) and below `BITCOIN_LOCKTIME_THRESHOLD` (`u500000000` — Bitcoin treats locktimes at or above this as Unix timestamps, not block heights), and below 2³⁹ (`u549755813888`, the cap of the script-number encoding used for the CLTV push). Any violation → `ERR_INVALID_UNLOCK_HEIGHT (u52)`. The SDK mirrors the cap client-side: `buildLockScript` and `fetchConstructLockupOutputScript` throw `ERR_INVALID_UNLOCK_HEIGHT` for a height at or above 2³⁹.
2. **Script matches.** The output decodes via `get-bitcoin-tx-output?`, which parses the raw tx at `outputIndex` and recovers `{ amount, script, txid }` (a truncated or malformed tx returns `ERR_READ_TX_OUT_OF_BOUNDS (u39)`). The parsed `scriptPubKey` must equal `construct-lockup-output-script(staker, unlock-burn-height, stakerUnlockBytes, earlyUnlockBytes)` — the deterministic P2WSH reconstructed from that output's own `unlock-burn-height`. Otherwise `ERR_INVALID_LOCKUP_SCRIPT (u42)`.
3. **Amount matches.** The decoded output value must equal the caller-supplied `amount` field. Mismatch → `ERR_INVALID_LOCKUP_AMOUNT (u45)`.
4. **Outpoint uniqueness.** The same `(txid, output-index)` cannot appear twice across the registration's lockup list (max 10 outpoints). Repeat → `ERR_DUPLICATE_LOCKUP_OUTPOINT (u46)`.
5. **Header is canonical.** `verify-block-header(header, height)` compares `sha256(sha256(header))` (reversed) against `(get-burn-block-info? header-hash height)`. Mismatch → `ERR_INVALID_BTC_HEADER (u40)`.
6. **Merkle proof folds to the root.** The Clarity built-in invoked by `verify-merkle-proof` rehashes the leaf with each sibling in `leafHashes`, picking left/right by the LSB-first bits of `txIndex`, until it reconstructs the merkle root parsed out of `header`. Mismatch → `ERR_INVALID_MERKLE_PROOF (u41)`. (Single-tx blocks are accepted directly when the root equals the txid.)

The total sats summed across all outputs becomes the BTC-side commitment recorded for the membership.

***

### Enroll with sBTC (no L1 lock)

Same call, but `lockup: { kind: 'sbtc', sbtcSats }`. No timelock script, no Bitcoin transaction, no SPV proofs — the contract custodies sBTC directly via `roll-sbtc` ([pox-5.clar:1943](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1943)), which transfers the net delta from the staker to the contract. The whole flow is a single Stacks transaction once the allowlist check passes.

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

`unstake-sbtc` withdraws part or all of the custodied sBTC; the contract transfers it back to the staker via `sbtc-token.transfer`. It's only valid on sBTC-backed memberships (`is-l1-lock = false`, otherwise `ERR_CANNOT_UNSTAKE_SBTC`), `signerManager` must match the staker's current signer (`ERR_INVALID_OLD_SIGNER_MANAGER`), the amount must be at or below the staker's current sBTC shares (`ERR_INVALID_UNSTAKE_SBTC_AMOUNT`), and calls during the prepare phase are rejected. The L1 counterpart of leaving early is `announce-l1-early-exit` — see [mid-bond mutations](paired-btc.md#mid-bond-mutations).

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

The deterministic script the contract recomputes for SPV verification is, per `construct-lockup-script` ([pox-5.clar:3711:3731](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)):

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

### Verify the L1 BTC lock

Given a bond membership on L2, reconstruct the deterministic P2WSH address and check Bitcoin to confirm the UTXO is still unspent and report when it unlocks.

```ts
import {
  buildLockScript,
  computeBondUnlockHeight,
  fetchBond,
  fetchBondMembership,
  fetchPoxInfo,
  lockScriptToAddress,
} from '@stacks/bitcoin-staking';

const address = user.stxAddress;

// `unlockBytes` is the tail script the staker chose at registration time. It
// isn't recorded on-chain — the staker (or their UI) must persist it locally.
const unlockBytes: Uint8Array = await myStorage.loadUnlockBytes(address);

const [pox, membership] = await Promise.all([
  fetchPoxInfo({ network }),
  fetchBondMembership({ address, network }),
]);
if (!membership) throw new Error('no paired bond for this address');

// `amountSats` is on the membership row directly — bond legs are keyed per reward cycle.
const lockedSats = membership.amountSats;

const bond = await fetchBond({ bondIndex: membership.bondIndex, network });

// Same formula as at lock time — get-bond-l1-unlock-height for this bond index.
const unlockHeight = computeBondUnlockHeight({
  bondIndex: membership.bondIndex,
  poxInfo: pox,
});
const script = buildLockScript({
  stxAddress: address,
  unlockHeight,
  unlockBytes,
  earlyUnlockBytes: bond.earlyUnlockBytes,
});
const lockingAddress = lockScriptToAddress(script, 'mainnet');

// Out-of-SDK: query any Bitcoin explorer / node for the UTXO state.
const utxos = await fetch(
  `https://mempool.space/api/address/${lockingAddress}/utxo`,
).then(r => r.json());
const stillLocked = utxos.some((u: any) => BigInt(u.value) === lockedSats);

const status = {
  lockingAddress,
  stillLocked,
  lockedSats,
  unlockBurnHeight: unlockHeight,
  blocksUntilUnlock: Math.max(0, unlockHeight - pox.currentBurnchainBlockHeight),
};
```

#### Cross-check against the contract

When an SPV proof is rejected and you need to isolate which piece is wrong, the contract's SPV primitives are exposed as read-only mirrors:

* `fetchVerifyBlockHeader({ header, expectedBlockHeight })` — `true` iff the 80-byte header double-SHA256s to the burnchain header hash the node records at that height; the exact `u40` gate.
* `fetchParseBlockHeader({ header })` — decodes the header into a `ParsedBlockHeader` (`version`, `parent`, `merkleRoot`, `timestamp`, `nbits`, `nonce`; hashes in display order), so you can compare `merkleRoot` against what your proof folds to.
* `fetchReversedTxid({ tx })` — the contract's little-endian (internal-order) txid of the raw tx bytes; the reverse of the explorer-displayed txid. Mirrors the local, pure `computeBitcoinTxid`.
* `fetchBurnBlockHeaderHash({ burnHeight })` — the burnchain header hash at a burn height (`undefined` if the node has none); the value `fetchVerifyBlockHeader` compares against.

For the script side, `parseUnlockScript(unlockBytes)` decodes an unlock-script tail: it returns the 33-byte compressed public key when the tail is the default `<pubkey> OP_CHECKSIG` shape, or `undefined` for anything else.

***

### Mid-bond mutations

Two contract functions touch an existing native-BTC membership without ending it. Full coverage lives in the dedicated flows; the brief is:

* **`update-bond-registration`** ([pox-5.clar:850](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850)) rotates the signer-manager mid-bond. The new signer-manager takes effect from `clamp(currentCycle + 1, bondStartCycle, bondEndCycle)` — i.e. the next cycle, raised to the bond's start if the rotation lands before the bond is active and capped at the bond's end. `settle-rewards` and `settle-staker-rewards` run on both the old and new signers so the rotation can't smear accrued sBTC. Same signer is rejected with `ERR_UPDATE_BOND_SAME_SIGNER (u44)`. Rejected during the prepare phase (`ERR_STAKE_IN_PREPARE_PHASE u47`).
* **`announce-l1-early-exit`** ([pox-5.clar:1196](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196)) is the L2 mirror of an off-cycle BTC unlock. The staker themselves calls it directly (`contract-caller`, `tx-sender`, and the `staker` argument must all match), and only on L1-locked memberships. Rejected during the prepare phase (`ERR_STAKE_IN_PREPARE_PHASE u47`). It walks each remaining bond cycle via `unstake-sats-from-bond-cycles`, resolving that cycle's signer from `staker-signer-cycle-memberships` (so a participant who rotated signers mid-bond is unwound correctly), settling signer-level and per-staker rewards per cycle, and zeroing the staker's per-cycle share count. It then zeroes `amount-sats` on the membership, debits `protocol-bonds-total-staked`, and flips `protocol-bond-l1-early-exit-announced` for `{ bond-index, staker }`. The staker's STX remains locked through the bond's normal unlock cycle. Calling twice fails with `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED (u50)`.

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
  lockScriptToAddress,
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
const newLockingAddress = lockScriptToAddress(script, 'mainnet');

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

| Code  | Constant                        | Meaning                                                                                                                                                                                                                                                                                    |
| ----- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `u7`  | `ERR_BOND_NOT_FOUND`            | No `protocol-bonds` entry for the supplied `bond-index`.                                                                                                                                                                                                                                   |
| `u8`  | `ERR_INSUFFICIENT_STX`          | Paired STX amount below `min-ustx-for-sats-amount` for the cited sats.                                                                                                                                                                                                                     |
| `u9`  | `ERR_ALREADY_REGISTERED`        | Caller has an existing bond membership that _overlaps_ the new bond's term. Non-overlapping memberships are allowed to roll over via the same call.                                                                                                                                        |
| `u10` | `ERR_TOO_MUCH_SATS`             | Lockup sats total exceeds the caller's allowlist cap.                                                                                                                                                                                                                                      |
| `u11` | `ERR_NOT_ALLOWLISTED`           | Caller has no `protocol-bond-allowances` entry for the bond.                                                                                                                                                                                                                               |
| `u19` | `ERR_ALREADY_STAKED`            | Caller has an STX-only stake that _overlaps_ the new bond's term. Non-overlapping STX-only stakes roll over.                                                                                                                                                                               |
| `u23` | `ERR_SIGNER_NOT_FOUND`          | The cited signer has no `get-signer-info` entry.                                                                                                                                                                                                                                           |
| `u39` | `ERR_READ_TX_OUT_OF_BOUNDS`     | Raw BTC tx bytes truncated or malformed at `outputIndex`.                                                                                                                                                                                                                                  |
| `u40` | `ERR_INVALID_BTC_HEADER`        | Header doesn't hash to the burn-chain header at `height`.                                                                                                                                                                                                                                  |
| `u41` | `ERR_INVALID_MERKLE_PROOF`      | Merkle path doesn't reconstruct the block's merkle root.                                                                                                                                                                                                                                   |
| `u42` | `ERR_INVALID_LOCKUP_SCRIPT`     | Output's scriptPubKey doesn't match the expected P2WSH lockup for `(staker, unlockHeight, …)`.                                                                                                                                                                                             |
| `u43` | `ERR_BOND_ALREADY_STARTED`      | Registration window closed — `burn-block-height >= bond-start-height`.                                                                                                                                                                                                                     |
| `u45` | `ERR_INVALID_LOCKUP_AMOUNT`     | Decoded output value doesn't equal the supplied `amount` field.                                                                                                                                                                                                                            |
| `u46` | `ERR_DUPLICATE_LOCKUP_OUTPOINT` | The same `(txid, output-index)` appears twice in the registration's lockup list.                                                                                                                                                                                                           |
| `u47` | `ERR_STAKE_IN_PREPARE_PHASE`    | Call landed during the prepare phase. Broadcast earlier in the cycle.                                                                                                                                                                                                                      |
| `u48` | `ERR_ROLLOVER_TOO_EARLY`        | Rollover attempted before the existing bond's L1 unlock window opened.                                                                                                                                                                                                                     |
| `u49` | `ERR_REENTRANT_CALL`            | Reentrant call into PoX-5 detected while a `signer-manager-validate-stake` call was in flight.                                                                                                                                                                                             |
| `u52` | `ERR_INVALID_UNLOCK_HEIGHT`     | A lockup output's committed `unlock-burn-height` is below the bond's minimum L1 unlock height, at/above `BITCOIN_LOCKTIME_THRESHOLD` (`u500000000` — Bitcoin's locktime/timestamp boundary), or at/above 2³⁹ (the ceiling a 5-byte minimally-encoded Bitcoin script number can represent). |

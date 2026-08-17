---
description: STX-only staking — lock, update, and unstake without a paired BTC commitment.
---

# Solo STX

The [STX-only path](../glossary.md#stx-only-staking-tranche-2-path) mirrors the classic PoX surface: a single user locks STX through their own signer-manager, optionally adjusts the position over time, and unstakes when finished. No BTC, no pairing, no per-transaction signer signature.

Unlike PoX-4, there is no solo-vs-pooling distinction. Every staker — STX-only or bond participant — delegates to a **signer-manager** contract; a solo staker is simply a signer-manager with a single member (often the staker's own signer-manager). The contract lazily adds a signer to the reward set once its delegated stake crosses the 50,000-STX (`SIGNER_SET_MIN_USTX`) minimum, so "going solo" just means running your own signer-manager and meeting that threshold yourself.

`stake`, `stake-update`, and `unstake` all revert during the [prepare phase](../glossary.md#prepare-phase-prepare-window) (`ERR_STAKE_IN_PREPARE_PHASE u47` for `stake`/`stake-update`, `ERR_UNSTAKE_IN_PREPARE_PHASE u28` for `unstake`). Gate every call on `isInPreparePhase` first.

A principal can hold only one position at a time, and bond participation and STX-only staking are mutually exclusive — `stake` reverts with `ERR_ALREADY_STAKED` if the caller already has an STX-only stake or an overlapping bond membership. See [Concepts › One position per principal](../concepts.md#one-position-per-principal).

### Stake

```ts
import { buildStake, fetchEligibleStake, fetchPoxInfo } from '@stacks/bitcoin-staking';
import { TransactionSigner, broadcastTransaction, fetchNonce } from '@stacks/transactions';

const network = 'mainnet';
const pox = await fetchPoxInfo({ network });

const eligible = await fetchEligibleStake({
  staker: user.stxAddress,
  signerManager: 'SP000…USER.signer-manager',
  amountUstx: 50_000_000_000n,
  numCycles: 1,
  startBurnHt: pox.currentBurnchainBlockHeight,
  poxInfo: pox,
  network,
});
if (!eligible.ok) throw new Error('stake would fail: u' + eligible.reasons.join(', u'));

const tx = await buildStake({
  signerManager: 'SP000…USER.signer-manager',
  amountUstx: 50_000_000_000n,        // 50,000 STX (signer-set minimum)
  numCycles: 1,
  startBurnHt: pox.currentBurnchainBlockHeight,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

new TransactionSigner(tx).signOrigin(user.stxPrivateKey);
await broadcastTransaction({ transaction: tx, network });
```

`fetchEligibleStake` dry-runs every `stake` gate via read-only fetches — not in prepare phase, the signer registered with an active key grant, `startBurnHt` resolving to the next cycle, a lock period in `[1, MAX_NUM_CYCLES]`, no existing STX-only stake or overlapping bond, any bond rollover within its L1 unlock window, and enough total balance for `amountUstx` — and returns the contract's error codes in evaluation order (`reasons[0]` is what the transaction would abort with).

`signerManager` must already have a recorded signer-key grant — see [Advanced › Signers](advanced/signers.md) for the SIP-018 `grant-signer-key` flow.

There is no indefinite lock: `numCycles` must be between 1 and **`MAX_NUM_CYCLES` = 96** (`check-pox-lock-period`, else `ERR_INVALID_NUM_CYCLES u20`). You _can_ lock for a long horizon and still exit early — `unstake` (below) works at any time. The 96-cycle ceiling is a current parameter and may be raised.

### Update an existing stake

A single `stake-update` call handles three independent dimensions: extending the lock by additional cycles, increasing the locked amount, and rotating the signer-manager. Each is optional — omit a field to leave that dimension untouched. You can only ever **increase** the amount and extend cycles — there is no way to lower the locked amount or shorten the term here (use `unstake` to exit).

Updates require **no cooldown** and can be made at any point. The contract rewrites your membership from the **next cycle** onward — it removes you from each future cycle and re-adds you with the new amount/term/signer — so changes take effect next cycle regardless of when your previous unlock would have been.

The contract's on-chain signature ([pox-5.clar:1092](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1092)) requires both the new `signer-manager` and the staker's currently-recorded `old-signer-manager`. The `old-signer-manager` must match the `signer` field on `staker-info` ([pox-5.clar:224](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L224)); if it doesn't, the call reverts with `ERR_INVALID_OLD_SIGNER_MANAGER (u36)`. Read the current signer back with `fetchStakerInfo` before composing the call.

```ts
import { buildStakeUpdate, fetchEligibleStakeUpdate, fetchStakerInfo } from '@stacks/bitcoin-staking';

const current = await fetchStakerInfo({ address: user.stxAddress, network });
if (!current.staked) throw new Error('not staking');

const eligible = await fetchEligibleStakeUpdate({
  staker: user.stxAddress,
  signerManager: 'SP000…USER.signer-manager-v2',
  oldSignerManager: current.details.signer,
  cyclesToExtend: 4,
  amountIncrease: 10_000_000_000n,
  network,
});
if (!eligible.ok) throw new Error('stake-update would fail: u' + eligible.reasons.join(', u'));

const tx = await buildStakeUpdate({
  signerManager: 'SP000…USER.signer-manager-v2', // rotate (or pass current to keep)
  oldSignerManager: current.details.signer,       // must match staker-info.signer
  cyclesToExtend: 4,
  amountIncrease: 10_000_000_000n,
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

new TransactionSigner(tx).signOrigin(user.stxPrivateKey);
await broadcastTransaction({ transaction: tx, network });
```

`fetchEligibleStakeUpdate` reports every gate that would fail — an active STX-only stake, not in prepare phase, `oldSignerManager` matching the currently-recorded signer, the new signer registered with an active key grant, a resulting lock period in `[1, MAX_NUM_CYCLES]`, and enough unlocked STX to cover `amountIncrease`.

Examples:

* **Extend only** — pass `cyclesToExtend: 4`; the amount field can be omitted (and `signerManager` matches `oldSignerManager`).
* **Rotate signer only** — pass a new `signerManager` distinct from `oldSignerManager`; the cycles/amount fields can be omitted.
* **Top up only** — pass `amountIncrease: 10_000_000_000n`.

The `signer` field on `staker-info` is populated by `stake` and rewritten by every `stake-update` / `unstake`. It's the canonical source for the `oldSignerManager` argument and is exposed through `fetchStakerInfo`.

### Unstake

`unstake` can be called **at any time**, even with many cycles remaining — there is no cooldown. It sets the position to unlock at the **end of the current cycle** (it removes the staker from every remaining cycle after the current one, and lazily drops the signer from the reward set if it falls below the 50k threshold). The contract reverts during the [prepare phase](../glossary.md#prepare-phase-prepare-window) (`ERR_UNSTAKE_IN_PREPARE_PHASE u28`) — that guard exists because the upcoming cycle's reward set is already computed — so check the phase first.

`unstake` ([pox-5.clar:1424](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1424)) takes the staker's currently-recorded signer-manager as `old-signer-manager`. The same `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` revert applies if it doesn't match `staker-info.signer`.

```ts
import {
  buildUnstake,
  fetchEligibleUnstake,
  fetchPoxInfo,
  fetchStakerInfo,
  isInPreparePhase,
} from '@stacks/bitcoin-staking';
import { TransactionSigner, broadcastTransaction, fetchNonce } from '@stacks/transactions';

const network = 'mainnet';
const pox = await fetchPoxInfo({ network });

const inPrepare = isInPreparePhase({
  burnHeight: pox.currentBurnchainBlockHeight,
  poxInfo: pox,
});
if (inPrepare) throw new Error('cannot unstake during prepare phase');

const current = await fetchStakerInfo({ address: user.stxAddress, network });
if (!current.staked) throw new Error('not staking');

const eligible = await fetchEligibleUnstake({
  staker: user.stxAddress,
  oldSignerManager: current.details.signer,
  poxInfo: pox,
  network,
});
if (!eligible.ok) throw new Error('unstake would fail: u' + eligible.reasons.join(', u'));

const tx = await buildUnstake({
  oldSignerManager: current.details.signer, // must match staker-info.signer
  publicKey: user.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: user.stxAddress, network }),
  network,
});

new TransactionSigner(tx).signOrigin(user.stxPrivateKey);
await broadcastTransaction({ transaction: tx, network });
```

`fetchEligibleUnstake` covers every `unstake` gate — an active STX-only stake, `oldSignerManager` matching the currently-recorded signer, and not in prepare phase.

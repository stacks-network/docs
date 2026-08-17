---
description: Reward calculation, claims, and the andon-cord reward pause.
---

# Rewards

Distributions run twice per cycle (\~weekly). The cadence is two-step: a settlement call runs the cycle's waterfall over the active bonds, then each signer-manager pulls its accumulated sBTC for the legs it covers. Onward distribution to end stakers is the signer-manager's responsibility.

All stakers and bond participants are paid in **sBTC**. The contract never _pushes_ rewards to anyone — it only accounts for what is claimable. Rewards are **pulled**: `calculate-rewards` and `claim-rewards` are open entrypoints that anyone can call (a keeper, the signer-manager, or a third party batching many signers in one transaction). Claimed sBTC lands at the signer-manager, which then settles each staker. A staker who elected a BTC reward address receives an sBTC→L1 withdrawal at that point — but that bridging happens in the signer-manager layer, not in pox-5 itself.

### Calculate, then claim

`calculate-rewards` is gated on `calculation-height = distribution-cycle-to-burn-height(current-distribution-cycle) - 1` ([pox-5.clar:2161](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2161)) and refuses to recompute the same height twice (`ERR_DISTRIBUTION_ALREADY_COMPUTED u30`, [pox-5.clar:2173](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2173)). The contract has no fixed "+250 block" guard — any such buffer is enforced by upstream tooling, not the contract.

```ts
import {
  buildCalculateRewards,
  buildClaimRewards,
  burnHeightToRewardCycle,
  currentDistributionCycle,
  distributionCycleToBurnHeight,
  fetchEarned,
  fetchEligibleCalculateRewards,
  fetchEligibleClaimRewards,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';
import { broadcastTransaction, fetchNonce, signTransaction } from '@stacks/transactions';

const network = 'mainnet';
const signerManager = 'SP000…SIGNER.signer-manager';
const activeBondIndices = [7, 6, 5, 4]; // see "Bond ordering" below
const pox = await fetchPoxInfo({ network });
const distCycle = currentDistributionCycle(pox);

// 1. Anyone can run the cycle's waterfall once the calculation-height is reached.
const eligibleCalc = await fetchEligibleCalculateRewards({
  bondIndices: activeBondIndices,
  poxInfo: pox,
  network,
});
if (!eligibleCalc.ok)
  throw new Error('calculate-rewards would fail: u' + eligibleCalc.reasons.join(', u'));

const calcTx = await buildCalculateRewards({
  bondIndices: activeBondIndices,
  publicKey: caller.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: caller.stxAddress, network }),
  network,
});
await broadcastTransaction({
  transaction: signTransaction(calcTx, caller.stxPrivateKey),
  network,
});

// 2. The signer-manager pulls its share for the just-settled cycle.
//    `rewardCycle` is a *reward-cycle* value (the `poxInfo.rewardCycleId`
//    clock), not the distribution-cycle index — distribution cycles tick
//    twice as fast, so `distCycle - 1` is not a valid reward cycle. Convert
//    the settlement height back to its reward cycle instead:
const rewardCycle = burnHeightToRewardCycle({
  burnHeight:
    distributionCycleToBurnHeight({ distributionCycle: distCycle, poxInfo: pox }) - 1,
  poxInfo: pox,
});

const stxEarned = await fetchEarned({ signerManager, rewardCycle, network });
const bondEarned = await Promise.all(
  activeBondIndices.map(bondIndex =>
    fetchEarned({ signerManager, rewardCycle, bondIndex, network }),
  ),
);
const totalEarned = stxEarned + bondEarned.reduce((acc, v) => acc + v, 0n);
if (totalEarned === 0n) return;

const eligibleClaim = await fetchEligibleClaimRewards({
  signerManager,
  rewardCycle,
  bondIndices: activeBondIndices,
  network,
});
if (!eligibleClaim.ok)
  throw new Error('claim-rewards would fail: u' + eligibleClaim.reasons.join(', u'));

const claimTx = await buildClaimRewards({
  rewardCycle,
  bondIndices: activeBondIndices,
  publicKey: signer.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: signer.stxAddress, network }),
  network,
});
await broadcastTransaction({
  transaction: signTransaction(claimTx, signer.stxPrivateKey),
  network,
});
```

### Reading earned rewards

The contract tracks per-signer accounting via two cycle-keyed maps and one read-only:

* `signer-rewards-per-token-settled-for-cycle { reward-cycle, bond-index, signer } -> uint` — snapshot of cumulative `rewards-per-token-for-cycle` at the signer's last settlement. `bond-index` is `(some N)` for a bond cycle, `none` for STX-only.
* `signer-unclaimed-rewards-for-cycle { reward-cycle, bond-index, signer } -> uint` — running unclaimed sBTC, in sats, that has already been settled by `settle-rewards`.
* `get-earned(signer, reward-cycle, bond-index) -> uint` ([pox-5.clar:2341](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341)) — `unclaimed + (shares × (rptCurrent − rptSettled)) / PRECISION` via `compute-earned-rewards`.

The SDK surfaces all three:

```ts
import {
  fetchEarned,
  fetchSignerUnclaimedRewards,
  fetchSignerRewardsPerTokenSettled,
} from '@stacks/bitcoin-staking';

// Total earned-but-unclaimed across the snapshot + accrual since.
// bond legs are keyed per reward cycle
const earnedForBond = await fetchEarned({
  signerManager,
  rewardCycle,
  bondIndex: 7,
  network,
});

// Or break it into the two stored pieces for diagnostics:
const unclaimed = await fetchSignerUnclaimedRewards({
  signerManager,
  rewardCycle,
  bondIndex: 7,
  network,
});
const rptSettled = await fetchSignerRewardsPerTokenSettled({
  signerManager,
  rewardCycle,
  bondIndex: 7,
  network,
});
```

`fetchEarned` and `fetchSignerUnclaimedRewards` return a single `bigint` of sats. `fetchSignerRewardsPerTokenSettled` returns the `PRECISION`-scaled rewards-per-token snapshot, not a sats amount.

The contract-wide sides of the same math are also readable:

* `fetchRewardsPerTokenForCycle({ rewardCycle, bondIndex, network })` — the cumulative `rewards-per-token-for-cycle` accumulator for a leg (the `rptCurrent` in `get-earned`'s formula); pass `bondIndex` for a bond leg, omit it for STX-only.
* `fetchTotalSharesStakedForCycle({ rewardCycle, bondIndex, network })` — the live denominator behind the rewards-per-token math (sats for a bond leg, uSTX for the STX-only leg); mutated on every stake/unstake/register.
* `fetchUstxDelegatedForCycle({ rewardCycle, network })` — protocol-wide uSTX delegated for the cycle, across bonds and STX-only staking.

### Settle-rewards: keeping accounting safe across share mutations

The private `settle-rewards(signer, reward-cycle, bond-index)` ([pox-5.clar:2530](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2530)) is the glue that lets share counts move without smearing accrued sBTC. On every call it:

1. reads the signer's `shares`, the leg's `rewards-per-token-for-cycle`, and the settled/unclaimed snapshots once each, and computes `earned` from them via `compute-earned-rewards` (the same formula `get-earned` exposes),
2. writes `earned` into `signer-unclaimed-rewards-for-cycle` (settling newly-accrued rewards),
3. snapshots the current `rewards-per-token-for-cycle` into `signer-rewards-per-token-settled-for-cycle`,
4. writes the signer's own RPT watermark into `signer-rewards-per-token-for-cycle` (only when the signer has non-zero shares — this is the reference the staker layer reads against, so a sub-threshold signer doesn't seed phantom staker claims).

The private `settle-staker-rewards(signer, reward-cycle, bond-index, staker)` ([pox-5.clar:2581](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2581)) is the per-staker counterpart. It performs the per-staker pendant of the first two writes — reading the signer's current `signer-rewards-per-token-for-cycle` as the RPT source, then writing `staker-unclaimed-rewards-for-cycle` and `staker-rewards-per-token-settled-for-cycle` — and is what lets the contract pay individual stakers via `claim-staker-rewards-for-signer` without recomputing share ratios. Unlike `settle-rewards`, there is no third watermark write: the staker layer only reads the signer's RPT, it never writes its own.

Subsequent accrual then resumes from those fresh snapshots, so a share change immediately afterwards doesn't retroactively re-price the prior balance.

The contract calls both at every site that mutates `signer-shares-staked-for-cycle` or `staker-shares-staked-for-cycle`, in **signer-then-staker** order so the staker's RPT snapshot is taken against the freshly-settled signer-level RPT.

Top-level settlement (called from the public function body before per-cycle helpers run):

* `register-for-bond` (initial registration or rollover)
* `update-bond-registration` (mid-bond signer rotation; settles both old and new legs)
* `announce-l1-early-exit` (off-cycle L1 unlock)
* `unstake-sbtc` (partial / full sBTC withdraw)

Per-cycle settlement (inside the helper for each affected cycle):

* `add-staker-to-signer-for-cycle` and `remove-staker-from-signer-for-cycle` — used by the STX-only lifecycle (`stake`, `stake-update`, `unstake`). `add-staker-to-signer-for-cycle` runs `settle-staker-rewards` only when the staker already holds shares in that cycle — with zero shares, settling would earn nothing, so the call is skipped
* `update-claimable-rewards` and `update-claimable-bond-rewards` — used by `claim-rewards` per cycle/leg

If you're reading on-chain state and `get-earned` keeps returning the same number, that's expected between settlement calls — the running accrual is computed virtually from `rptCurrent - rptSettled`.

### `calculate-rewards` in detail

```ts
buildCalculateRewards({ bondIndices, ...txParams });
```

Pulls newly-received sBTC (`get-new-rewards`) and distributes it across active bonds in waterfall order first; the `RESERVE_RATIO` (1500 bps = 15%) cut is then taken from whatever remains after bonds into `reserve-balance`, and the STX-only cycle leg is credited what's left after that.

**Per-bond target yield.** Each bond's target take per distribution is `(totalSats × targetRateBps / 10_000) / 50` (in `calculate-bond-rewards`, [pox-5.clar:2242](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2242)). The divisor is **50** — 50 distributions per year, twice per \~weekly cycle. If the available pool can't cover the full target, the bond gets the remaining rewards and later bonds receive zero.

**Bond ordering.** `bond-periods` must be in canonical order — **descending `stx-value-ratio`**, with **ascending `bond-index` as tiebreaker** (enforced in `calculate-bond-rewards`). Out of order → `ERR_INVALID_BOND_PERIOD_ORDERING (u29)`. Note the ordering encodes "pay denser-STX bonds first" so any shortfall lands on the lowest-density bond.

**No STX stakers.** When a cycle has no STX-only stakers (`get-total-shares-staked-for-cycle(stx-cycle, none)` is zero), the staker cut is folded into `reserve-balance` as `unallocated-staker-cut` rather than written into `rewards-per-token-for-cycle`. This keeps below-threshold signers from accruing phantom claimable rewards in cycles where nobody is eligible for the STX-only payout.

**All-active-or-revert.** Every bond active at `calculation-height` (per `is-bond-active-at-height`) must appear in `bond-periods`. Missing one → `ERR_ACTIVE_BOND_NOT_INCLUDED (u33)`. The list itself caps at 6 entries.

**Once per height.** `last-reward-compute-height` advances on success; calling at the same `calculation-height` again returns `ERR_DISTRIBUTION_ALREADY_COMPUTED (u30)`.

**Is the cycle settled yet?** `fetchLastRewardComputeHeight` returns the burn height of the last settled distribution. Compare it against the current cycle's calculation-height: while it is lower, the cycle is still _pending_ (rewards sit in the contract, not yet claimable) and `calculate-rewards` can run; once equal, the cycle is settled and `fetchEarned` reflects the claimable per-leg figures.

```ts
const calcHeight =
  distributionCycleToBurnHeight({ distributionCycle: distCycle, poxInfo: pox }) - 1;
const settled = (await fetchLastRewardComputeHeight({ network })) >= calcHeight;
```

`fetchEligibleCalculateRewards` runs this comparison for you (alongside the bond-list checks), reporting `DistributionAlreadyComputed` when the cycle is already settled.

### `claim-rewards` in detail

```ts
buildClaimRewards({ rewardCycle, bondIndices, ...txParams });
```

`contract-caller` is treated as the signer principal. The contract folds over the bond legs and the STX-only cycle leg via `update-claimable-rewards`, which (a) calls `settle-rewards`, (b) zeroes `signer-unclaimed-rewards-for-cycle`, then sums the totals. It transfers `total-rewards` sBTC out of the contract to the signer and decrements `last-accounted-rewards-only` by the same amount.

Return shape (`ok`), once the transaction is mined and its Clarity return value decoded — `buildClaimRewards` itself only returns the unsigned transaction:

```ts
{
  stxRewards: { earned: bigint; rewardsPerToken: bigint };
  bondRewards: { earned: bigint; bondIndex: number; rewardsPerToken: bigint }[];
  bondTotals: bigint;
  totalRewards: bigint;
}
```

Each entry carries `earned` (sats paid out) and `rewardsPerToken` (the snapshot taken at settlement), plus `bondIndex` on bond entries.

If every leg comes up empty the call reverts with `ERR_NO_CLAIMABLE_REWARDS (u32)`. Gate with `fetchEarned` first (omit `bondIndex` for the STX-only leg; pass `bondIndex` for each bond leg).

**Reward claims are pausable.** Before any accounting, `claim-rewards` asserts `(not (var-get rewards-paused))` and otherwise reverts with `ERR_REWARDS_PAUSED (u53)` ([pox-5.clar:2404](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2404)). The `rewards-paused` flag is flipped by the `pause-rewards` entrypoint ([pox-5.clar:489](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L489)), callable only by the current `pause-admin` (a `data-var` initialized to the mainnet operator principal; non-mainnet deploys rewrite it to the configured admin). This is a **one-way switch**: there is no unpause function. Once paused, signers can no longer claim — but rewards keep accruing in-contract exactly as before; settlement accounting is unaffected. Recovery from a pause requires a hard fork. (`pause-admin` itself can be reassigned by the current admin via `set-pause-admin`, [pox-5.clar:470](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L470).)

### Staker-level rewards: paying individuals out of a signer's claim

`claim-rewards` settles the signer manager's slice. Signer managers fan that slice out to individual stakers via `claim-staker-rewards-for-signer(staker, reward-cycle, bond-index)` ([pox-5.clar:2444](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2444)). The contract runs `settle-staker-rewards(contract-caller, reward-cycle, bond-index, staker)`, zeroes the matching `staker-unclaimed-rewards-for-cycle` entry, emits a `claim-staker-rewards-for-signer` print event with the `rewards-claimed` amount, and returns the settled `rewards-info`. **The function does not transfer sBTC and does not update `last-accounted-rewards-only`** — the signer-manager pays the staker out of the sBTC it already received from `claim-rewards`. The per-staker entries are keyed by `contract-caller`, so the call is meaningful only for the signer-manager whose accounting the staker is recorded under; the entrypoint is reentrancy-guarded (`ERR_REENTRANT_CALL u49`).

```ts
import {
  buildClaimStakerRewardsForSigner,
  fetchEarnedStakerRewards,
  fetchStakerUnclaimedRewards,
  fetchStakerRewardsPerTokenSettled,
  fetchSignerRewardsPerTokenForCycle,
} from '@stacks/bitcoin-staking';

// Per-staker pendant of fetchEarned — { unclaimed + virtual accrual } for one staker.
// bond legs are keyed per reward cycle
const stakerEarned = await fetchEarnedStakerRewards({
  signerManager,
  staker,
  rewardCycle,
  bondIndex: 7,
  network,
});
if (stakerEarned === 0n) return;

const claimTx = await buildClaimStakerRewardsForSigner({
  staker,
  rewardCycle,
  bondIndex: 7,
  publicKey: signer.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: signer.stxAddress, network }),
  network,
});
await broadcastTransaction({
  transaction: signTransaction(claimTx, signer.stxPrivateKey),
  network,
});
```

The two stored maps and the signer-level reference RPT are also surfaced individually:

```ts
const stakerUnclaimed = await fetchStakerUnclaimedRewards({ signerManager, staker, rewardCycle, bondIndex: 7, network });
const stakerRptSettled = await fetchStakerRewardsPerTokenSettled({ signerManager, staker, rewardCycle, bondIndex: 7, network });
const signerRptForCycle = await fetchSignerRewardsPerTokenForCycle({ signerManager, rewardCycle, bondIndex: 7, network });
```

`fetchSignerRewardsPerTokenForCycle` returns `0n` for signers that never crossed `SIGNER_SET_MIN_USTX` in the cycle — exactly what gates phantom staker rewards under below-threshold signers.

### Andon cord (reward pause)

The andon-cord is the contract's brake on reward claims, described under "Reward claims are pausable" above: the `pause-admin` principal (intended to be a multisig on mainnet) calls `pause-rewards` to set `rewards-paused`, after which `claim-rewards` reverts with `ERR_REWARDS_PAUSED (u53)`. The pause can **stop** claims but cannot **redirect** rewards — amounts keep accruing in-contract — and it is **one-way**: there is no unpause, so recovery requires a hard fork.

Both values are private data-vars without read-only accessors; the SDK reads them off the node's `/v2/data_var` endpoint:

```ts
import { fetchPauseAdmin, fetchRewardsPaused } from '@stacks/bitcoin-staking';

// Gate any claim flow on the pause flag before broadcasting.
const paused = await fetchRewardsPaused({ network });

// The principal allowed to call pause-rewards.
const pauseAdmin = await fetchPauseAdmin({ network });
```

`fetchEligibleClaimRewards` already includes this gate, reporting `RewardsPaused` ahead of the empty-rewards check — matching the contract's evaluation order.

### Errors

| Code  | Constant                            | Meaning                                                                                                                        |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `u7`  | `ERR_BOND_NOT_FOUND`                | A `bond-periods` entry references a non-existent `bond-index`.                                                                 |
| `u29` | `ERR_INVALID_BOND_PERIOD_ORDERING`  | `bond-periods` not in descending `stx-value-ratio`, ascending-index order.                                                     |
| `u30` | `ERR_DISTRIBUTION_ALREADY_COMPUTED` | `calculation-height <= last-reward-compute-height` — already settled.                                                          |
| `u31` | `ERR_BOND_NOT_ACTIVE`               | A `bond-periods` entry isn't active at `calculation-height`.                                                                   |
| `u32` | `ERR_NO_CLAIMABLE_REWARDS`          | Every claimed leg was empty — nothing to transfer.                                                                             |
| `u33` | `ERR_ACTIVE_BOND_NOT_INCLUDED`      | An on-chain active bond was missing from `bond-periods`.                                                                       |
| `u49` | `ERR_REENTRANT_CALL`                | Reentrant call into PoX-5 detected while a `signer-manager-validate-stake` call was in flight.                                 |
| `u53` | `ERR_REWARDS_PAUSED`                | `claim-rewards` called while `rewards-paused` is set — claims are permanently halted (one-way; recovery requires a hard fork). |

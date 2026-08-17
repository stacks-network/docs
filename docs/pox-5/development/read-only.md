---
description: >-
  Informational reads — positions, bond browsing, ratio quotes, and schedule
  helpers. No transactions.
---

# Read-Only Queries

Read-only queries cover the surface a wallet, explorer, or dashboard hits to render PoX-5 state without sending a transaction. The flows below group them by what they answer:

* **Positions** — what a given address has locked, across STX-only and paired-bond legs.
* **Bond browsing** — capacity, target APY, ratio, and the caller's allowlist entry for an upcoming bond.
* **Ratio quotes** — required STX for a given BTC commitment under a bond's static ratio.
* **Schedule helpers** — cycle, burn-height, and bond-period conversions for "X days until next bond opens" and re-lock window timing.

### Read a staker's current position

A wallet or dashboard fetches everything needed to render "what does this address have locked?" in one shot.

```ts
import {
  fetchAccountStatus,
  fetchBondMembership,
  fetchPoxInfo,
  fetchStakerInfo,
} from '@stacks/bitcoin-staking';

const network = 'mainnet';
const address = user.stxAddress;

const [pox, account, stxOnly, bond] = await Promise.all([
  fetchPoxInfo({ network }),
  fetchAccountStatus({ address, network }),
  fetchStakerInfo({ address, network }),     // STX-only position (if any)
  fetchBondMembership({ address, network }), // paired-bond position (if any)
]);

const position = {
  burnHeight: pox.currentBurnchainBlockHeight,
  cycle: pox.rewardCycleId,
  liquidUstx: account.balance - account.locked,
  lockedUstx: account.locked,
  unlockHeight: account.unlockHeight,
  stxOnly: stxOnly.staked ? stxOnly.details : null,
  bond: bond ?? null,
};
```

`fetchStakerInfo` returns `{ staked: false }` if the address has no STX-only lock, or `{ staked: true, details: { amountUstx, firstRewardCycle, numCycles, signer } }` — `details` is the decoded `staker-info` tuple. The `details.signer` field ([pox-5.clar:224](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L224)) is the principal a client passes as `oldSignerManager` to `stake-update` / `unstake`.

`fetchBondMembership` returns the decoded `protocol-bond-memberships` tuple — `{ bondIndex, amountUstx, signer, isL1Lock, amountSats }`. `amountSats` is the BTC shares currently attributed to the membership — an L1 lockup total when `isL1Lock` is true, an sBTC contribution when false — and is the authoritative source for per-cycle bond share accounting. `fetchProtocolBondMemberships` reads the raw `protocol-bond-memberships` map entry and does **not** filter out expired memberships, unlike `fetchBondMembership` (which goes through `get-bond-membership`) — the latter returns `undefined` once the bond's unlock cycle is reached.

### Browse an upcoming bond

A partner or pool operator inspects the next bond's parameters before enrolling: capacity, target APY, ratio, open burn height, and their own allowlist entry.

`fetchBond` returns the decoded `protocol-bonds` tuple — `{ bondIndex, targetRateBps, stxValueRatio, minUstxRatioBps, earlyUnlockBytes }`. The `earlyUnlockBytes` field is the early-exit subscript embedded in the L1 lockup script (a pre-pushed Bitcoin script fragment that validates the early-exit key(s) signature and **must leave a valid boolean result on the stack** — consumed by the shared `OP_VERIFY` after `OP_ENDIF` — e.g. `<pubkey> OP_CHECKSIG` or an M-of-N `OP_CHECKMULTISIG` template). The `openBurnHeight` and `firstRewardCycle` are not stored on the bond — derive them with the per-bond conversions (`bondPeriodToBurnHeight`, `bondPeriodToRewardCycle`), which take `{ bondIndex, poxInfo }` and read the first bond-period cycle off `poxInfo.contractVersions` internally (`firstPox5RewardCycle(pox)` exposes the same lookup for an explicit is-pox-5-active check).

```ts
import {
  bondPeriodToBurnHeight,
  bondPeriodToRewardCycle,
  fetchBond,
  fetchBondAllowance,
  fetchPoxInfo,
  fetchProtocolBond,
  fetchTotalSbtcStakedForBond,
  firstPox5RewardCycle,
} from '@stacks/bitcoin-staking';

const bondIndex = 7;

const [pox, bond, filledSbtc, allowance] = await Promise.all([
  fetchPoxInfo({ network }),
  fetchBond({ bondIndex, network }),                      // or fetchProtocolBond — same shape via the read-only
  fetchTotalSbtcStakedForBond({ bondIndex, network }),
  fetchBondAllowance({ bondIndex, address: user.stxAddress, network }),
]);
const firstBondPeriodCycle = firstPox5RewardCycle(pox);   // derived from pox.contractVersions; mirrors pox-5's first-bond-period-cycle data var
if (firstBondPeriodCycle === undefined) throw new Error('pox-5 not yet configured');

const openBurnHeight = bondPeriodToBurnHeight({
  bondIndex,
  poxInfo: pox,
});

const summary = {
  bondIndex,
  status: openBurnHeight > pox.currentBurnchainBlockHeight ? 'announced' : 'open',
  openBurnHeight,
  blocksUntilOpen: Math.max(0, openBurnHeight - pox.currentBurnchainBlockHeight),
  filledSbtc,
  targetRateBps: bond.targetRateBps,
  stxValueRatio: bond.stxValueRatio,
  minUstxRatioBps: bond.minUstxRatioBps,
  earlyUnlockBytes: bond.earlyUnlockBytes,
  myAllowanceSats: allowance,
};
```

`fetchProtocolBond` is the read-only wrapper around the same data; `fetchBond` reads the map entry directly. Both return the same shape.

### Quote required STX for a BTC commitment

Before enrolling, a partner computes how much STX must be paired with a given sats amount under the bond's static [ratio](../glossary.md#ratio-requirement-minimum-stx-vs-btc).

```ts
import { fetchBond, minUstxForSatsAmount } from '@stacks/bitcoin-staking';

const bondIndex = 7;
const intendedSats = 2_500_000_000n; // 25 BTC

const bond = await fetchBond({ bondIndex, network });
if (!bond) throw new Error('bond not configured');

const requiredUstx = minUstxForSatsAmount({
  sats: intendedSats,
  stxValueRatio: bond.stxValueRatio,
  minUstxRatioBps: bond.minUstxRatioBps,
});
```

### Schedule helper

Convert between bond index, reward cycle, and burn height. Useful for "X days until next bond opens", re-lock window timing, and indexer pagination.

```ts
import {
  bondPhaseRanges,
  bondStatus,
  fetchBondL1UnlockHeight,
  fetchPoxInfo,
  fetchProtocolBond,
  firstPox5RewardCycle,
  isBondActiveAtHeight,
  isInPreparePhase,
} from '@stacks/bitcoin-staking';

const bondIndex = 7;

const [pox, bond, l1Unlock] = await Promise.all([
  fetchPoxInfo({ network }),
  fetchProtocolBond({ bondIndex, network }),            // some/none — has setup-bond been called?
  fetchBondL1UnlockHeight({ bondIndex, network }),      // BTC CLTV unlock for the bond's L1 lockup
]);
const firstBondPeriodCycle = firstPox5RewardCycle(pox);
if (firstBondPeriodCycle === undefined) throw new Error('pox-5 not yet configured');

const now = pox.currentBurnchainBlockHeight;
const [open, locked, unlocked] = bondPhaseRanges({ bondIndex, poxInfo: pox });

const schedule = {
  bondIndex,
  status: bondStatus({ bondIndex, poxInfo: pox, isBondSetup: bond !== undefined }),
  registrationCutoff: open.endBurnHeight,               // exclusive; final prepare phase folds into `locked`
  lockedRange: locked,                                  // { name, startBurnHeight, length, endBurnHeight }
  reLockWindow: unlocked,                               // ≈ 7.3d on mainnet
  blocksUntilClose: Math.max(0, unlocked.endBurnHeight - now),
  l1UnlockHeight: l1Unlock,
  inPreparePhase: isInPreparePhase({ burnHeight: now, poxInfo: pox }),
  isActiveNow: isBondActiveAtHeight({ bondIndex, burnHeight: now, poxInfo: pox }),
};
```

`bondPhaseRanges` returns the bond's lifecycle as four named, burn-height-anchored ranges — `open`, `locked`, `unlocked`, `finished` — each `{ name, startBurnHeight, length, endBurnHeight }` with an exclusive `endBurnHeight` (the next phase begins there). It is `PoxInfo`-pure: no fetches. `open` ends `prepareCycleLength` blocks _before_ the bond's start height, because registration is blocked in the final prepare phase (`ERR_STAKE_IN_PREPARE_PHASE`) — so `open.endBurnHeight` is the practical registration cutoff. `unlocked` is the last `rewardCycleLength / 2` blocks of the term (the re-lock window), and `finished` is capped at one bond term's worth of blocks as a UI convention.

`bondStatus` classifies the current burn height (`poxInfo.currentBurnchainBlockHeight`) into one of those phase names without assuming the bond exists on-chain. For a bond where `setup-bond` hasn't been called (`isBondSetup: false`) it resolves to `too-early` (before the setup window), `eligible` (inside the `BOND_GAP_CYCLES` setup window — the admin can `setup-bond` now), or `missed` (the start height passed without setup; this bond period can never run). `fetchBondStatus` is the fetching variant — it fetches `poxInfo` and the setup check (`fetchProtocolBond`) for whatever isn't injected:

```ts
import { fetchBondStatus } from '@stacks/bitcoin-staking';

const status = await fetchBondStatus({ bondIndex, network });
// 'open' | 'locked' | 'unlocked' | 'finished' | 'too-early' | 'eligible' | 'missed'
```

The same boundaries can be derived by hand with the pure conversions (all take `{ ..., poxInfo }`, no network):

* `bondPeriodToRewardCycle` / `bondPeriodToBurnHeight` — a bond's first reward cycle and start burn height.
* `rewardCycleToBurnHeight` — mirrors `pox-5.reward-cycle-to-burn-height`.
* `burnHeightToRewardCycle` — mirrors `pox-5.burn-height-to-reward-cycle`; throws when `burnHeight` is below `first-burnchain-block-height`, mirroring the contract's runtime abort.
* `burnHeightToDistributionIndex` — mirrors `pox-5.burn-height-to-distribution-index`; distribution cycles tick twice per reward cycle (every `rewardCycleLength / 2` burn blocks).

```ts
import { bondPeriodToRewardCycle, rewardCycleToBurnHeight } from '@stacks/bitcoin-staking';

const firstRewardCycle = bondPeriodToRewardCycle({ bondIndex, poxInfo: pox });
const closeBurnHt = rewardCycleToBurnHeight({
  cycle: firstRewardCycle + 12, // BOND_LENGTH_CYCLES
  poxInfo: pox,
});

// Re-lock window = pox-reward-cycle-length / 2.
// Mainnet: 2100 / 2 = 1050 blocks (~7.3 days). Testnet: 1050 / 2 = 525.
const reLockWindowBlocks = Math.floor(pox.rewardCycleLength / 2);
```

The [re-lock window](../glossary.md#re-lock-phase) at the end of every bond is when BTC unlocks before STX. On mainnet it is **1,050 blocks ≈ 7.3 days** (`pox-reward-cycle-length / 2`, with `pox-reward-cycle-length = 2100`); on testnet it is 525. The contract's `get-bond-l1-unlock-height(bondIndex)` returns `bondPeriodToBurnHeight(bondIndex + 6) - (pox-reward-cycle-length / 2)`; `fetchBondL1UnlockHeight` wraps it. This is the read to use for L1 timelock construction; the `unlock-burn-height` returned from `register-for-bond` / `stake` / `stake-update` is the start of the unlock cycle (a different value derived from `reward-cycle-to-burn-height`) and is only for indexing the membership's unlock schedule.

`isInPreparePhase` is the gate that `register-for-bond`, `update-bond-registration`, `stake`, `stake-update`, `announce-l1-early-exit`, and `unstake-sbtc` all hit (`ERR_STAKE_IN_PREPARE_PHASE u47`). `unstake` enforces the same window through its own separate check (`ERR_UNSTAKE_IN_PREPARE_PHASE u28`).

### Earned rewards and protocol totals

The reward model splits "what is this signer owed?" into three on-chain reads, plus a convenience aggregator ([pox-5.clar:2341](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341), [pox-5.clar:3217](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3217), [pox-5.clar:3203](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3203)):

* `get-earned(signer, reward-cycle, bond-index) -> uint` — pending + accrued, in sBTC sats. The single number a UI should display.
* `get-signer-unclaimed-rewards-for-cycle` — running pending sBTC for `{ reward-cycle, bond-index, signer }` since the last settlement (`bond-index: (some N)` for a bond cycle, `none` for STX-only).
* `get-signer-rewards-per-token-settled-for-cycle` — last-settled rewards-per-token snapshot for the same key.

```ts
import {
  fetchEarned,
  fetchSignerRewardsPerTokenSettled,
  fetchSignerUnclaimedRewards,
} from '@stacks/bitcoin-staking';

const signerManager = 'SP000…USER.signer-manager';
const bondIndex = 7;

// bond legs are keyed per reward cycle
const rewardCycle = pox.rewardCycleId;
const [earned, unclaimed, rptSettled] = await Promise.all([
  fetchEarned({ signerManager, rewardCycle, bondIndex, network }),
  fetchSignerUnclaimedRewards({ signerManager, rewardCycle, bondIndex, network }),
  fetchSignerRewardsPerTokenSettled({ signerManager, rewardCycle, bondIndex, network }),
]);
```

#### Staker-level rewards

For a signer manager paying individual stakers out of its slice, the staker-level layer mirrors the signer-level reads one level down ([pox-5.clar:2358](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2358), [pox-5.clar:3247](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3247), [pox-5.clar:3231](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3231), [pox-5.clar:3263](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3263)):

* `get-earned-staker-rewards(signer, reward-cycle, bond-index, staker) -> uint` — pending + accrued for a single staker under one signer.
* `get-staker-unclaimed-rewards-for-cycle` — running pending sBTC for `{ reward-cycle, bond-index, signer, staker }`.
* `get-staker-rewards-per-token-settled-for-cycle` — staker's last-settled RPT snapshot.
* `get-signer-rewards-per-token-for-cycle` — the signer's own RPT watermark for the cycle, used as the staker-side RPT reference. Returns `0n` for signers that never crossed `SIGNER_SET_MIN_USTX` in the cycle.

```ts
import {
  fetchBondMembership,
  fetchBondOverlapsNewPosition,
  fetchEarnedStakerRewards,
  fetchSignerRewardsPerTokenForCycle,
  fetchStakerCustodiedSbtc,
  fetchStakerRewardsPerTokenSettled,
  fetchStakerUnclaimedRewards,
} from '@stacks/bitcoin-staking';

const staker = 'SP000…STAKER';

// bond legs are keyed per reward cycle
const rewardCycle = pox.rewardCycleId;
const [stakerEarned, stakerUnclaimed, stakerRptSettled, signerRptForCycle, custodiedSbtc, membership] =
  await Promise.all([
    fetchEarnedStakerRewards({ signerManager, staker, rewardCycle, bondIndex, network }),
    fetchStakerUnclaimedRewards({ signerManager, staker, rewardCycle, bondIndex, network }),
    fetchStakerRewardsPerTokenSettled({ signerManager, staker, rewardCycle, bondIndex, network }),
    fetchSignerRewardsPerTokenForCycle({ signerManager, rewardCycle, bondIndex, network }),
    fetchStakerCustodiedSbtc({ staker, network }),
    fetchBondMembership({ address: staker, network }),
  ]);

// Pre-flight check for `register-for-bond` / `stake` rollovers — true if the
// caller's existing membership term overlaps the proposed new first reward cycle.
// Pass `membership: undefined` if the caller has no existing bond membership.
const overlaps = await fetchBondOverlapsNewPosition({
  membership,
  newFirstRewardCycle: 200,
  network,
});
```

`fetchStakerCustodiedSbtc` returns the sBTC the contract currently holds for a given staker (the source side of `roll-sbtc`). `fetchBondOverlapsNewPosition` wraps the on-chain overlap predicate and is the right call to gate a rollover UI without broadcasting.

For protocol-wide totals:

```ts
import {
  fetchPoxInfo,
  fetchTotalSbtcStaked,
  fetchTotalSbtcStakedForBond,
  fetchTotalUstxStacked,
  firstPox5RewardCycle,
} from '@stacks/bitcoin-staking';

const [pox, sbtcTotal, sbtcForBond7, ustxForCycle142] = await Promise.all([
  fetchPoxInfo({ network }),
  fetchTotalSbtcStaked({ network }),
  fetchTotalSbtcStakedForBond({ bondIndex: 7, network }),
  fetchTotalUstxStacked({ rewardCycle: 142, network }),
]);
const firstCycle = firstPox5RewardCycle(pox);
```

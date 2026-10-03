# bondPhaseRanges

Returns a bond's four lifecycle phases as consecutive ranges of Bitcoin block heights, for timelines and countdowns. Pure computation from `poxInfo`: it does not check whether the bond was set up.

***

### Usage

```ts
import { bondPhaseRanges, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

for (const phase of bondPhaseRanges({ bondIndex: 0, poxInfo })) {
  console.log(phase.name, phase.startBurnHeight, phase.endBurnHeight);
}
// names in order: 'open', 'locked', 'unlocked', 'finished'
```

#### Notes

* With `start` = [bondPeriodToBurnHeight](bondperiodtoburnheight.md) and `end` = `start + 12 * rewardCycleLength`, the ranges are:

| Phase      | `startBurnHeight`                    | `endBurnHeight` (exclusive)          | Mainnet length |
| ---------- | ------------------------------------ | ------------------------------------ | -------------- |
| `open`     | `start - 2 * rewardCycleLength`      | `start - prepareCycleLength`         | 4,100 blocks   |
| `locked`   | `start - prepareCycleLength`         | `end - floor(rewardCycleLength / 2)` | 24,250 blocks  |
| `unlocked` | `end - floor(rewardCycleLength / 2)` | `end + 1`                            | 1,051 blocks   |
| `finished` | `end + 1`                            | `end + 12 * rewardCycleLength`       | 25,199 blocks  |

* `open` starts when `setup-bond` becomes possible and ends where the final prepare phase before the start begins, after which registration fails. It still contains the prepare phase of the cycle two before the start, where `register-for-bond` fails with `ERR_STAKE_IN_PREPARE_PHASE (u47)`. Check with [isInPreparePhase](isinpreparephase.md).
* `unlocked` starts at the height [`get-bond-l1-unlock-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3342-L3346) returns for the bond. From there a member can roll into bond `bondIndex + 6` or an STX-only stake without `ERR_ROLLOVER_TOO_EARLY (u48)`. Each L1 output's `unlockBurnHeight` is at or above this height, as `register-for-bond` requires.
* `unlocked` includes `end` because [`is-bond-active-at-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3027-L3041) counts the end height as active.
* The `finished` range is capped at 12 reward cycles so it has a finite end. The cap is a display convention. The contract never deletes a bond from `protocol-bonds`.
* For a bond that may not be set up, use [bondStatus](bondstatus.md).
* Throws an `Error` whose message starts with `pox-5 not activated yet` if `poxInfo.contractVersions` has no pox-5 entry.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L227-L286)

***

### Signature

```ts
function bondPhaseRanges(opts: { bondIndex: number; poxInfo: PoxInfo }): BondPhaseRange[];
```

***

### Returns

`BondPhaseRange[]`

Four [BondPhaseRange](bondphaserange.md) entries in the order `open`, `locked`, `unlocked`, `finished`. Each range's `endBurnHeight` is the next range's `startBurnHeight`.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond index.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

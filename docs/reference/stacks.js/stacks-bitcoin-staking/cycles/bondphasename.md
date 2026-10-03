# BondPhaseName

Label for one phase of a set-up bond's lifecycle. Each [BondPhaseRange](bondphaserange.md) from [bondPhaseRanges](bondphaseranges.md) carries one, and [bondStatus](bondstatus.md) returns one for a bond that has been set up.

***

### Usage

```ts
import { type BondPhaseName, bondPhaseRanges, fetchPoxInfo } from '@stacks/bitcoin-staking';

const labels: Record<BondPhaseName, string> = {
  open: 'Open',
  locked: 'Locked',
  unlocked: 'Unlocking',
  finished: 'Finished',
};

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

for (const phase of bondPhaseRanges({ bondIndex: 0, poxInfo })) {
  console.log(labels[phase.name], phase.startBurnHeight, phase.endBurnHeight);
}
```

#### Notes

* The source marks this `@experimental`.
* Boundaries are Bitcoin block heights derived from the bond's start height, its end height (start plus 12 reward cycles), `rewardCycleLength` and `prepareCycleLength`. [bondPhaseRanges](bondphaseranges.md) gives the exact heights.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L5-L24)

***

### Definition

```ts
type BondPhaseName = 'open' | 'locked' | 'unlocked' | 'finished';
```

***

### Values

| Value        | Description                                                                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'open'`     | From two reward cycles before the start height until `prepareCycleLength` blocks before it. `register-for-bond` can succeed here, except in a prepare phase                                                                         |
| `'locked'`   | From `prepareCycleLength` blocks before the start height until the bond's `get-bond-l1-unlock-height`. Registration fails with `ERR_STAKE_IN_PREPARE_PHASE (u47)` in the final prepare phase, then `ERR_BOND_ALREADY_STARTED (u43)` |
| `'unlocked'` | The last `rewardCycleLength / 2` blocks of the term, through the end height inclusive. Starts at `get-bond-l1-unlock-height`, from which a member can roll into a new position without `ERR_ROLLOVER_TOO_EARLY (u48)`               |
| `'finished'` | After the end height                                                                                                                                                                                                                |

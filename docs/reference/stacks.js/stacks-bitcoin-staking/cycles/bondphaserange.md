# BondPhaseRange

One named phase of a bond's lifecycle as a range of Bitcoin block heights. [bondPhaseRanges](bondphaseranges.md) returns one per [BondPhaseName](bondphasename.md), in order.

***

### Usage

```ts
import { bondPhaseRanges, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const height = poxInfo.currentBurnchainBlockHeight;

const current = bondPhaseRanges({ bondIndex: 0, poxInfo }).find(
  range => height >= range.startBurnHeight && height < range.endBurnHeight
);
const blocksLeft = current ? current.endBurnHeight - height : undefined;
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L26-L44)

***

### Definition

```ts
interface BondPhaseRange {
  /** Phase label. See {@link BondPhaseName}. */
  name: BondPhaseName;
  /** Inclusive start burn-block height. */
  startBurnHeight: number;
  /** Number of burn blocks the phase spans. */
  length: number;
  /**
   * Exclusive end burn-block height (`startBurnHeight + length`). The next
   * phase, if any, begins at this height.
   */
  endBurnHeight: number;
}
```

***

### Properties

| Property          | Type            | Description                                                       |
| ----------------- | --------------- | ----------------------------------------------------------------- |
| `name`            | `BondPhaseName` | Phase label: `'open'`, `'locked'`, `'unlocked'` or `'finished'`   |
| `startBurnHeight` | `number`        | First Bitcoin block height of the phase, inclusive                |
| `length`          | `number`        | Number of Bitcoin blocks in the phase                             |
| `endBurnHeight`   | `number`        | `startBurnHeight + length`, exclusive. The next phase starts here |

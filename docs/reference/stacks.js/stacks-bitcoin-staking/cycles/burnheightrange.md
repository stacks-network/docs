# BurnHeightRange

A window of Bitcoin block heights with an exclusive end. Its only producer in the package is `bondRegisterRanges`, which the source marks `@internal` and experimental and which returns the windows where bond timing lets `register-for-bond` succeed.

***

### Usage

```ts
import type { BurnHeightRange } from '@stacks/bitcoin-staking';

function contains(range: BurnHeightRange, burnHeight: number): boolean {
  return burnHeight >= range.startBurnHeight && burnHeight < range.endBurnHeight;
}
```

#### Notes

* Same height fields as [BondPhaseRange](bondphaserange.md), without `name`.
* The source recommends [bondPhaseRanges](bondphaseranges.md) over `bondRegisterRanges`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L288-L296)

***

### Definition

```ts
interface BurnHeightRange {
  /** Inclusive start burn-block height. */
  startBurnHeight: number;
  /** Number of burn blocks the window spans. */
  length: number;
  /** Exclusive end burn-block height. */
  endBurnHeight: number;
}
```

***

### Properties

| Property          | Type     | Description                                         |
| ----------------- | -------- | --------------------------------------------------- |
| `startBurnHeight` | `number` | First Bitcoin block height of the window, inclusive |
| `length`          | `number` | Number of Bitcoin blocks in the window              |
| `endBurnHeight`   | `number` | First height after the window, exclusive            |

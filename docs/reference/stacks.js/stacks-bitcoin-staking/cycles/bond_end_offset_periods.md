# BOND\_END\_OFFSET\_PERIODS

The number of bond periods between a bond's start and its end: 6. Bond `n` ends at the start height of bond `n + 6`. It is the hardcoded `u6` in the contract's bond math.

***

### Usage

```ts
import { BOND_END_OFFSET_PERIODS, bondPeriodToBurnHeight, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bondIndex = 0;

const startHeight = bondPeriodToBurnHeight({ bondIndex, poxInfo });
const endHeight = bondPeriodToBurnHeight({ bondIndex: bondIndex + BOND_END_OFFSET_PERIODS, poxInfo });
// endHeight - startHeight === 12 * poxInfo.rewardCycleLength
```

#### Notes

* Computed as `BOND_LENGTH_CYCLES / BOND_GAP_CYCLES`: a 12-cycle bond term divided by the 2-cycle gap between bond starts, matching the contract constants [`BOND_LENGTH_CYCLES` and `BOND_GAP_CYCLES`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L74-L76). Both SDK constants are marked `@internal`.
* The contract uses `(+ bond-index u6)` for the bond's end in [`is-bond-active-at-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3027-L3041) and [`get-bond-l1-unlock-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3342-L3346).
* A member of bond `n` can roll into bond `n + 6` without overlap, because its first reward cycle is the first cycle after bond `n`'s 12-cycle term.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L59-L64)

***

### Definition

```ts
const BOND_END_OFFSET_PERIODS = BOND_LENGTH_CYCLES / BOND_GAP_CYCLES; // 12 / 2 = 6
```

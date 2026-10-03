# distributionCycleToBurnHeight

Returns the first Bitcoin block height of a distribution cycle. Pure computation that mirrors the pox-5 read-only [`distribution-cycle-to-burn-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2938-L2942).

***

### Usage

```ts
import { currentDistributionCycle, distributionCycleToBurnHeight, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const next = currentDistributionCycle(poxInfo) + 1;
const nextStart = distributionCycleToBurnHeight({ distributionCycle: next, poxInfo });
const blocksUntilNext = nextStart - poxInfo.currentBurnchainBlockHeight;
```

#### Notes

* Computes `firstBurnchainBlockHeight + distributionCycle * floor(rewardCycleLength / 2)`. The input is not validated.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L154-L167)

***

### Signature

```ts
function distributionCycleToBurnHeight(opts: {
  distributionCycle: number;
  poxInfo: PoxInfo;
}): number;
```

***

### Returns

`number`

The Bitcoin block height at which the distribution cycle starts.

***

### Parameters

#### opts.distributionCycle (required)

* **Type**: `number`

The distribution cycle index, as from [burnHeightToDistributionIndex](burnheighttodistributionindex.md).

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

# burnHeightToDistributionIndex

Returns the distribution cycle that contains a Bitcoin block height. Distribution cycles are half a reward cycle long and drive the sBTC reward calculation. Pure computation that mirrors the pox-5 read-only [`burn-height-to-distribution-index`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2926-L2930).

***

### Usage

```ts
import { burnHeightToDistributionIndex, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const index = burnHeightToDistributionIndex({ burnHeight: poxInfo.currentBurnchainBlockHeight, poxInfo });
```

#### Notes

* Computes `floor((burnHeight - firstBurnchainBlockHeight) / floor(rewardCycleLength / 2))`. On mainnet a distribution cycle is 1,050 Bitcoin blocks.
* Index 0 starts at `firstBurnchainBlockHeight`, the start of PoX, not at pox-5 activation.
* Throws an `Error` with the message `burnHeight is before first-burnchain-block-height` when `burnHeight` is below `poxInfo.firstBurnchainBlockHeight`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L119-L135)

***

### Signature

```ts
function burnHeightToDistributionIndex(opts: {
  burnHeight: number;
  poxInfo: PoxInfo;
}): number;
```

***

### Returns

`number`

The distribution cycle index.

***

### Parameters

#### opts.burnHeight (required)

* **Type**: `number`

A Bitcoin block height at or above `poxInfo.firstBurnchainBlockHeight`.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

# currentDistributionCycle

Returns the distribution cycle at `poxInfo.currentBurnchainBlockHeight`. Pure computation that mirrors the pox-5 read-only [`current-distribution-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2933-L2935) without a request.

***

### Usage

```ts
import {
  currentDistributionCycle,
  distributionCycleToBurnHeight,
  fetchLastRewardComputeHeight,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const distributionCycle = currentDistributionCycle(poxInfo);
const calculationHeight = distributionCycleToBurnHeight({ distributionCycle, poxInfo }) - 1;

const lastComputed = await fetchLastRewardComputeHeight({ network: 'mainnet' });
const rewardsPending = calculationHeight > lastComputed;
```

#### Notes

* Same as [burnHeightToDistributionIndex](burnheighttodistributionindex.md) with `burnHeight: poxInfo.currentBurnchainBlockHeight`. The result is only as current as `poxInfo`.
* `calculate-rewards` settles at the last block of the previous distribution cycle: the current cycle's start height minus 1. It fails with `ERR_DISTRIBUTION_ALREADY_COMPUTED (u30)` once that height has been computed.
* Throws an `Error` with the message `burnHeight is before first-burnchain-block-height` if the current height is below `poxInfo.firstBurnchainBlockHeight`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L137-L152)

***

### Signature

```ts
function currentDistributionCycle(poxInfo: PoxInfo): number;
```

***

### Returns

`number`

The current distribution cycle index.

***

### Parameters

#### poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

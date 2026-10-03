# rewardCycleToBurnHeight

Returns the first Bitcoin block height of a reward cycle. Pure computation that mirrors the pox-5 read-only [`reward-cycle-to-burn-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2913-L2917).

***

### Usage

```ts
import { fetchPoxInfo, rewardCycleToBurnHeight } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const nextCycleStart = rewardCycleToBurnHeight({ rewardCycle: poxInfo.rewardCycleId + 1, poxInfo });
const preparePhaseStart = nextCycleStart - poxInfo.prepareCycleLength;
```

#### Notes

* Computes `firstBurnchainBlockHeight + rewardCycle * rewardCycleLength`. The input is not validated.
* The prepare phase of a cycle starts `prepareCycleLength` blocks before the next cycle's first block. See [isInPreparePhase](isinpreparephase.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L114-L117)

***

### Signature

```ts
function rewardCycleToBurnHeight(opts: { rewardCycle: number; poxInfo: PoxInfo }): number;
```

***

### Returns

`number`

The Bitcoin block height at which the cycle starts.

***

### Parameters

#### opts.rewardCycle (required)

* **Type**: `number`

The reward cycle ID.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

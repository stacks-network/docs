# burnHeightToRewardCycle

Returns the reward cycle that contains a Bitcoin block height. Pure computation that mirrors the pox-5 read-only [`burn-height-to-reward-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2906-L2910).

***

### Usage

```ts
import { burnHeightToRewardCycle, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const cycle = burnHeightToRewardCycle({ burnHeight: poxInfo.currentBurnchainBlockHeight, poxInfo });
```

#### Notes

* Computes `floor((burnHeight - firstBurnchainBlockHeight) / rewardCycleLength)`.
* Throws an `Error` with the message `burnHeight is before first-burnchain-block-height` when `burnHeight` is below `poxInfo.firstBurnchainBlockHeight`. The contract aborts at runtime in the same case.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L100-L112)

***

### Signature

```ts
function burnHeightToRewardCycle(opts: { burnHeight: number; poxInfo: PoxInfo }): number;
```

***

### Returns

`number`

The reward cycle ID.

***

### Parameters

#### opts.burnHeight (required)

* **Type**: `number`

A Bitcoin block height at or above `poxInfo.firstBurnchainBlockHeight`.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

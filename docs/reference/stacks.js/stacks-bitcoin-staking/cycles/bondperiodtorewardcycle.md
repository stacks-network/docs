# bondPeriodToRewardCycle

Returns the first reward cycle of a bond. Pure computation that mirrors the pox-5 read-only [`bond-period-to-reward-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2900-L2902).

***

### Usage

```ts
import { bondPeriodToRewardCycle, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const firstCycle = bondPeriodToRewardCycle({ bondIndex: 3, poxInfo });
// firstPox5RewardCycle(poxInfo) + 3 * 2
```

#### Notes

* Computes `firstPox5RewardCycle(poxInfo) + bondIndex * 2`. Bond periods start every 2 reward cycles (`BOND_GAP_CYCLES`), and each bond runs for 12 (`BOND_LENGTH_CYCLES`).
* Throws an `Error` whose message starts with `pox-5 not activated yet` if `poxInfo.contractVersions` has no pox-5 entry. See [firstPox5RewardCycle](firstpox5rewardcycle.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L77-L85)

***

### Signature

```ts
function bondPeriodToRewardCycle(opts: { bondIndex: number; poxInfo: PoxInfo }): number;
```

***

### Returns

`number`

The bond's first reward cycle.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond index. Bond 0 starts in the first pox-5 reward cycle.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

# firstPox5RewardCycle

Returns the first reward cycle in which pox-5 is active, which is also the first cycle of bond 0. Pure computation: reads the pox-5 entry of `poxInfo.contractVersions`.

***

### Usage

```ts
import { fetchPoxInfo, firstPox5RewardCycle } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const firstCycle = firstPox5RewardCycle(poxInfo);

if (firstCycle === undefined) {
  // pox-5 has not activated on this network
}
```

#### Notes

* Returns `firstRewardCycleId` of the `contractVersions` entry whose `contractId` ends in `.pox-5`, or `undefined` when there is none.
* In the contract, [`set-burnchain-parameters`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L430-L449) sets the `first-pox-5-reward-cycle` and `first-bond-period-cycle` data-vars to the same value. The SDK uses this result as `first-bond-period-cycle` in [bondPeriodToRewardCycle](bondperiodtorewardcycle.md) and the helpers built on it, which throw when it is `undefined`.
* This value comes from the node's `/v2/pox` response, not from the contract. To read the contract's value, call the [`get-first-pox-5-reward-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3348-L3350) read-only.
* On mainnet both are 141: `/v2/pox` reports `first_reward_cycle_id` 141 for pox-5, and the contract's `first-bond-period-cycle` data-var reads `u141`. Bond 1, the first bond set up on mainnet, starts at reward cycle 143, Bitcoin block 966,350.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L46-L57)

***

### Signature

```ts
function firstPox5RewardCycle(poxInfo: PoxInfo): number | undefined;
```

***

### Returns

`number | undefined`

The first pox-5 reward cycle, or `undefined` if `poxInfo.contractVersions` has no pox-5 entry.

***

### Parameters

#### poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

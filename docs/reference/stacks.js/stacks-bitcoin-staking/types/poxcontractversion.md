# PoxContractVersion

Activation record for one PoX contract version, from an entry of the `contract_versions` array in the node's `/v2/pox` response. [PoxInfo](poxinfo.md) `contractVersions` holds one per version, and [firstPox5RewardCycle](../cycles/firstpox5rewardcycle.md) reads the pox-5 entry.

***

### Usage

```ts
import { fetchPoxInfo, firstPox5RewardCycle } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const pox5 = poxInfo.contractVersions.find(v => v.contractId.endsWith('.pox-5'));
pox5?.activationBurnchainBlockHeight;

// Same lookup, returns pox5?.firstRewardCycleId
const firstCycle = firstPox5RewardCycle(poxInfo);
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L112-L124)

***

### Definition

```ts
export interface PoxContractVersion {
  /** Fully-qualified contract id. */
  contractId: string;
  /** Burn-block height at which this contract version became active. */
  activationBurnchainBlockHeight: number;
  /** First reward cycle in which this contract version is active. */
  firstRewardCycleId: number;
}
```

***

### Properties

| Property                         | Type     | From `/v2/pox`                      | Description                                                                |
| -------------------------------- | -------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `contractId`                     | `string` | `contract_id`                       | Fully qualified contract ID, such as `SP000000000000000000002Q6VF78.pox-5` |
| `activationBurnchainBlockHeight` | `number` | `activation_burnchain_block_height` | Bitcoin block height at which this version became active                   |
| `firstRewardCycleId`             | `number` | `first_reward_cycle_id`             | First reward cycle in which this version is active                         |

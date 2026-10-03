# PoxInfo

The PoX parameters, current and next cycle, and sBTC contracts from the node's `/v2/pox` endpoint, as returned by [fetchPoxInfo](../fetch/fetchpoxinfo.md). The cycle helpers such as [bondPeriodToBurnHeight](../cycles/bondperiodtoburnheight.md) and [isInPreparePhase](../cycles/isinpreparephase.md) compute from it without another network call.

***

### Usage

```ts
import { bondPeriodToBurnHeight, fetchPoxInfo, isInPreparePhase } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const inPrepare = isInPreparePhase({ burnHeight: poxInfo.currentBurnchainBlockHeight, poxInfo });
const bondStart = bondPeriodToBurnHeight({ bondIndex: 0, poxInfo });
```

#### Notes

* The bond helpers take the first pox-5 reward cycle from the `contractVersions` entry whose `contractId` ends in `.pox-5`. If there is no such entry, for example because the node omits `contract_versions`, they throw an `Error` whose message starts with `pox-5 not activated yet`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L50-L83)

***

### Definition

```ts
export interface PoxInfo {
  /** Fully-qualified pox contract id. */
  contractId: string;
  /** Current burnchain block height. */
  currentBurnchainBlockHeight: number;
  /** Burnchain height at which PoX began. */
  firstBurnchainBlockHeight: number;
  /** Reward cycle currently in progress. */
  rewardCycleId: number;
  /** Reward cycle length in burnchain blocks. */
  rewardCycleLength: number;
  /** Prepare phase length in burnchain blocks. */
  prepareCycleLength: number;
  /** Reward slots per cycle. */
  rewardSlots: number;
  /** Current reward cycle summary. */
  currentCycle: CycleInfo;
  /** Next reward cycle summary. */
  nextCycle: NextCycleInfo;
  /** One entry per deployed pox contract version (pox through pox-5). */
  contractVersions: PoxContractVersion[];
  /**
   * sBTC token contract this node uses for pox-5 payments. Fixed on mainnet;
   * node-configured elsewhere, so read it rather than hardcoding it.
   */
  sbtcContract: string;
  /** sBTC registry contract the node reads the per-cycle waterfall recipient from. */
  sbtcRegistryContract: string;
}
```

***

### Properties

| Property                      | Type                                            | From `/v2/pox`                   | Description                                                                                  |
| ----------------------------- | ----------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `contractId`                  | `string`                                        | `contract_id`                    | Active PoX contract, `SP000000000000000000002Q6VF78.pox-5` on mainnet                        |
| `currentBurnchainBlockHeight` | `number`                                        | `current_burnchain_block_height` | Bitcoin block height the node has reached                                                    |
| `firstBurnchainBlockHeight`   | `number`                                        | `first_burnchain_block_height`   | Bitcoin block height at which PoX began                                                      |
| `rewardCycleId`               | `number`                                        | `reward_cycle_id`                | Reward cycle in progress                                                                     |
| `rewardCycleLength`           | `number`                                        | `reward_cycle_length`            | Cycle length in Bitcoin blocks, 2,100 on mainnet                                             |
| `prepareCycleLength`          | `number`                                        | `prepare_cycle_length`           | Prepare phase length in Bitcoin blocks, 100 on mainnet                                       |
| `rewardSlots`                 | `number`                                        | `reward_slots`                   | Reward slots per cycle                                                                       |
| `currentCycle`                | [CycleInfo](cycleinfo.md)                       | `current_cycle`                  | Current cycle ID, micro-STX staked, and whether PoX is active                                |
| `nextCycle`                   | [NextCycleInfo](nextcycleinfo.md)               | `next_cycle`                     | Next cycle ID and micro-STX staked for it so far                                             |
| `contractVersions`            | [PoxContractVersion](poxcontractversion.md)`[]` | `contract_versions`              | One entry per PoX contract version, `pox` through `pox-5`. Empty if the node omits the field |
| `sbtcContract`                | `string`                                        | `pox_5_sbtc_contract`            | sBTC token contract pox-5 pays through                                                       |
| `sbtcRegistryContract`        | `string`                                        | `pox_5_sbtc_registry_contract`   | sBTC registry the node reads the reward recipient from                                       |

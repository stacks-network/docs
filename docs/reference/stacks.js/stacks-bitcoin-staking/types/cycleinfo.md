# CycleInfo

Summary of the current reward cycle, from the `current_cycle` object of the node's `/v2/pox` response. It is the type of [PoxInfo](poxinfo.md) `currentCycle`, returned by [fetchPoxInfo](../fetch/fetchpoxinfo.md).

***

### Usage

```ts
import { fetchPoxInfo } from '@stacks/bitcoin-staking';

const { currentCycle } = await fetchPoxInfo({ network: 'mainnet' });

currentCycle.id; // number
currentCycle.stakedUstx; // bigint, micro-STX
currentCycle.isPoxActive; // boolean
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L85-L97)

***

### Definition

```ts
export interface CycleInfo {
  /** Reward cycle id. */
  id: number;
  /** Total micro-STX stacked for the cycle. */
  stakedUstx: bigint;
  /** Whether PoX is active for the cycle. */
  isPoxActive: boolean;
}
```

***

### Properties

| Property      | Type      | From `/v2/pox`                | Description                                                 |
| ------------- | --------- | ----------------------------- | ----------------------------------------------------------- |
| `id`          | `number`  | `current_cycle.id`            | Reward cycle ID                                             |
| `stakedUstx`  | `bigint`  | `current_cycle.stacked_ustx`  | Total micro-STX staked for the cycle, converted to `bigint` |
| `isPoxActive` | `boolean` | `current_cycle.is_pox_active` | Whether PoX is active for the cycle                         |

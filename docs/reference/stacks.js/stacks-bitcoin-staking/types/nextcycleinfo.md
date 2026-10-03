# NextCycleInfo

Summary of the next reward cycle, from the `next_cycle` object of the node's `/v2/pox` response. It is the type of [PoxInfo](poxinfo.md) `nextCycle`, returned by [fetchPoxInfo](../fetch/fetchpoxinfo.md). Unlike [CycleInfo](cycleinfo.md), it has no `isPoxActive` field, because `next_cycle` carries no `is_pox_active`.

***

### Usage

```ts
import { fetchPoxInfo } from '@stacks/bitcoin-staking';

const { nextCycle } = await fetchPoxInfo({ network: 'mainnet' });

nextCycle.id; // number
nextCycle.stakedUstx; // bigint, micro-STX staked for the next cycle so far
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L99-L110)

***

### Definition

```ts
export interface NextCycleInfo {
  /** Reward cycle id. */
  id: number;
  /** Total micro-STX stacked for the cycle. */
  stakedUstx: bigint;
}
```

***

### Properties

| Property     | Type     | From `/v2/pox`            | Description                                                        |
| ------------ | -------- | ------------------------- | ------------------------------------------------------------------ |
| `id`         | `number` | `next_cycle.id`           | Reward cycle ID                                                    |
| `stakedUstx` | `bigint` | `next_cycle.stacked_ustx` | Total micro-STX staked for the cycle so far, converted to `bigint` |

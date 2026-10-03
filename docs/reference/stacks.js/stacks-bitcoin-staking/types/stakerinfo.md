# StakerInfo

A staker's STX-only stake, or its absence, as returned by [fetchStakerInfo](../fetch/fetchstakerinfo.md). It wraps the pox-5 [`get-staker-info`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3099-L3113) read-only, which returns the [`staker-info`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L218-L226) map entry. Protocol bond memberships are a separate record: see [BondMembership](bondmembership.md).

***

### Usage

```ts
import { fetchStakerInfo } from '@stacks/bitcoin-staking';

const info = await fetchStakerInfo({ address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR' });

if (info.staked) {
  info.details.amountUstx; // bigint, micro-STX
  info.details.signer; // signer-manager contract principal
}
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L126-L133)

***

### Definition

```ts
export type StakerInfo = { staked: false } | { staked: true; details: StakerInfoDetails };
```

***

### Values

| Value                                          | Description                                                                                                                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ staked: false }`                            | No active STX-only stake. `get-staker-info` returns `none` both when no entry exists and when the stake has expired, meaning its first reward cycle plus `num-cycles` is at or before the current cycle |
| `{ staked: true; details: StakerInfoDetails }` | Active STX-only stake. `details` is a [StakerInfoDetails](stakerinfodetails.md)                                                                                                                         |

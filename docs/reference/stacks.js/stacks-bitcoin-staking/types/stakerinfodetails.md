# StakerInfoDetails

The fields of an active STX-only stake: the pox-5 [`staker-info`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L218-L226) map value, decoded. It is the `details` of a [StakerInfo](stakerinfo.md) with `staked: true`, returned by [fetchStakerInfo](../fetch/fetchstakerinfo.md).

***

### Usage

```ts
import { fetchStakerInfo } from '@stacks/bitcoin-staking';

const info = await fetchStakerInfo({ address: stakerAddress, network: 'mainnet' });

if (info.staked) {
  const { amountUstx, firstRewardCycle, numCycles, signer } = info.details;
  const unlockCycle = firstRewardCycle + numCycles; // first cycle the STX is no longer locked
}
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L135-L145)

***

### Definition

```ts
export interface StakerInfoDetails {
  /** Locked micro-STX. */
  amountUstx: bigint;
  /** First reward cycle the lock applies to. */
  firstRewardCycle: number;
  /** Number of cycles locked. */
  numCycles: number;
  /** Stacks principal of the signer the staker is delegated to. */
  signer: string;
}
```

***

### Properties

| Property           | Type     | Description                                                                                                                                                                                                                                                                                          |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `amountUstx`       | `bigint` | Locked micro-STX, from `amount-ustx`                                                                                                                                                                                                                                                                 |
| `firstRewardCycle` | `number` | First reward cycle of the lock, from `first-reward-cycle`. [`stake-update`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1150-L1155) keeps it                                                        |
| `numCycles`        | `number` | Cycles locked, from `num-cycles`. `stake-update` adds the extension to it; [`unstake`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1451-L1456) shortens it so the lock ends after the current cycle |
| `signer`           | `string` | Contract principal of the signer-manager the stake is registered with, from `signer`. pox-5 records it as `contract-of` the signer-manager passed to `stake`                                                                                                                                         |

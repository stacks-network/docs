# EarnedRewards

The rewards a signer-manager has earned for one reward cycle and one leg, in sats of sBTC. Returned by [fetchEarned](../fetch/fetchearned.md), which wraps the pox-5 [`get-earned`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341-L2354) read-only.

***

### Usage

```ts
import { fetchEarned } from '@stacks/bitcoin-staking';

// Bond leg of bond 1; omit bondIndex for the STX-only leg
const earnedSats = await fetchEarned({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  rewardCycle,
  bondIndex: 1,
  network: 'mainnet',
});
```

#### Notes

* The amount is in sats. pox-5 accrues rewards from its sBTC balance ([`get-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2135-L2145)) and [`claim-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387-L2438) pays them out as an sBTC transfer.
* The amount can change between this read and a later `claim-rewards`. A post condition on [buildClaimRewards](../build/buildclaimrewards.md) built from it can come in low and abort the claim with `abort_by_post_condition`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L206-L209)

***

### Definition

```ts
export type EarnedRewards = bigint;
```

# BondMembership

A staker's protocol bond membership: the pox-5 [`protocol-bond-memberships`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L139-L148) map value, decoded. [fetchBondMembership](../fetch/fetchbondmembership.md) returns it while the membership is active, and [fetchProtocolBondMemberships](../fetch/fetchprotocolbondmemberships.md) returns the raw entry, including after the bond has ended.

***

### Usage

```ts
import { fetchBondMembership } from '@stacks/bitcoin-staking';

const membership = await fetchBondMembership({ address: stakerAddress, network: 'mainnet' });

if (membership) {
  membership.bondIndex; // number
  membership.isL1Lock; // true: L1 BTC lockup, false: sBTC
  membership.amountSats; // bigint, sats
}
```

#### Notes

* [`get-bond-membership`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3066-L3079) returns `none`, and `fetchBondMembership` returns `undefined`, once the bond's first reward cycle plus `BOND_LENGTH_CYCLES` (12) is at or before the current cycle.
* `register-for-bond` writes the entry. `update-bond-registration` changes `signer`, `unstake-sbtc` lowers `amountSats`, and `announce-l1-early-exit` sets it to `0`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L163-L178)

***

### Definition

```ts
export interface BondMembership {
  bondIndex: number;
  amountUstx: bigint;
  /** Stacks principal of the signer this membership is bound to. */
  signer: string;
  /** True if the BTC side is an L1 lockup; false if backed by sBTC. */
  isL1Lock: boolean;
  /** BTC shares (sats) currently attributed to this membership. */
  amountSats: bigint;
}
```

***

### Properties

| Property     | Type      | Description                                                                          |
| ------------ | --------- | ------------------------------------------------------------------------------------ |
| `bondIndex`  | `number`  | Index of the bond the staker registered for, from `bond-index`                       |
| `amountUstx` | `bigint`  | Micro-STX locked for the bond, from `amount-ustx`                                    |
| `signer`     | `string`  | Contract principal of the signer-manager the membership is bound to, from `signer`   |
| `isL1Lock`   | `boolean` | `true` if the BTC side is an L1 BTC lockup, `false` if it is sBTC, from `is-l1-lock` |
| `amountSats` | `bigint`  | Sats attributed to the membership, from `amount-sats`                                |

# isBondActiveAtHeight

Returns whether a bond's term covers a Bitcoin block height: above its start height, up to and including its end height. Pure computation that mirrors the height math of the pox-5 read-only [`is-bond-active-at-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3027-L3041).

***

### Usage

```ts
import { fetchPoxInfo, fetchProtocolBond, isBondActiveAtHeight } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bondIndex = 0;

const bond = await fetchProtocolBond({ bondIndex, network: 'mainnet' });
const active =
  bond !== undefined &&
  isBondActiveAtHeight({ bondIndex, burnHeight: poxInfo.currentBurnchainBlockHeight, poxInfo });
```

#### Notes

* True when `bondPeriodToBurnHeight(bondIndex) < burnHeight <= bondPeriodToBurnHeight(bondIndex + 6)`. The term is 12 reward cycles. The start height itself is excluded and the end height is included.
* The contract also requires the bond to exist in the `protocol-bonds` map. This function skips that check: combine it with [fetchProtocolBond](../fetch/fetchprotocolbond.md), as in the example.
* `calculate-rewards` uses the contract version at its calculation height. A listed bond that is not active there fails with `ERR_BOND_NOT_ACTIVE (u31)`, and an active bond left out fails with `ERR_ACTIVE_BOND_NOT_INCLUDED (u33)`.
* Throws an `Error` whose message starts with `pox-5 not activated yet` if `poxInfo.contractVersions` has no pox-5 entry.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L202-L225)

***

### Signature

```ts
function isBondActiveAtHeight(opts: {
  bondIndex: number;
  burnHeight: number;
  poxInfo: PoxInfo;
}): boolean;
```

***

### Returns

`boolean`

`true` if `burnHeight` is inside the bond's term. It does not tell you whether the bond was set up.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond index.

#### opts.burnHeight (required)

* **Type**: `number`

The Bitcoin block height to test.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).

# minUstxForSatsAmount

Returns the minimum micro-STX a staker must lock alongside a sats amount in a bond. Pure computation that mirrors the pox-5 read-only [`min-ustx-for-sats-amount`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3089-L3095).

***

### Usage

```ts
import { fetchProtocolBond, minUstxForSatsAmount } from '@stacks/bitcoin-staking';

minUstxForSatsAmount({ sats: 1_000_000n, stxValueRatio: 2_000n, minUstxRatioBps: 500 }); // 1000000n

const bond = await fetchProtocolBond({ bondIndex: 1, network: 'mainnet' });
if (bond) {
  const minUstx = minUstxForSatsAmount({
    sats: 10_000_000n, // 0.1 BTC in sats
    stxValueRatio: bond.stxValueRatio,
    minUstxRatioBps: bond.minUstxRatioBps,
  });
}
```

#### Notes

* Computes `((stxValueRatio * sats) / 100) * minUstxRatioBps / 10000` in `bigint`, rounding down at each division as the contract does.
* `register-for-bond` fails with `ERR_INSUFFICIENT_STX (u8)` when `amount-ustx` is below this value for the staked sats.
* Both ratios are fixed per bond by `setup-bond`. Read them from [fetchProtocolBond](../fetch/fetchprotocolbond.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L185-L200)

***

### Signature

```ts
function minUstxForSatsAmount(opts: {
  sats: IntegerType;
  stxValueRatio: IntegerType;
  minUstxRatioBps: IntegerType;
}): bigint;
```

***

### Returns

`bigint`

The minimum amount in micro-STX.

***

### Parameters

#### opts.sats (required)

* **Type**: `IntegerType`

The BTC or sBTC amount to stake, in sats. Accepts `number`, `string`, `bigint` or `Uint8Array`.

#### opts.stxValueRatio (required)

* **Type**: `IntegerType`

The bond's `stx-value-ratio`: micro-STX per 100 sats.

#### opts.minUstxRatioBps (required)

* **Type**: `IntegerType`

The bond's `min-ustx-ratio` in basis points. `500` is 5%.

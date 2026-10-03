# Bond

The static configuration of a protocol bond, as set by `setup-bond`: the pox-5 [`protocol-bonds`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L110-L128) map value plus its index. Returned by [fetchBond](../fetch/fetchbond.md) and [fetchProtocolBond](../fetch/fetchprotocolbond.md).

***

### Usage

```ts
import { bondPeriodToBurnHeight, fetchBond, fetchPoxInfo, minUstxForSatsAmount } from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 1, network: 'mainnet' });

if (bond) {
  // Minimum micro-STX to pair with 1 BTC (100,000,000 sats) in this bond
  const minUstx = minUstxForSatsAmount({
    sats: 100_000_000n,
    stxValueRatio: bond.stxValueRatio,
    minUstxRatioBps: bond.minUstxRatioBps,
  });

  // The bond's start height is derived, not stored
  const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
  const startBurnHeight = bondPeriodToBurnHeight({ bondIndex: bond.bondIndex, poxInfo });
}
```

#### Notes

* The bond's start height and first reward cycle are not part of `Bond`. Derive them from `bondIndex` with [bondPeriodToBurnHeight](../cycles/bondperiodtoburnheight.md) and [bondPeriodToRewardCycle](../cycles/bondperiodtorewardcycle.md).
* `register-for-bond` requires `amountUstx` of at least [`min-ustx-for-sats-amount`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3089-L3095) of the sats, computed from `stxValueRatio` and `minUstxRatioBps`, and fails with `ERR_INSUFFICIENT_STX (u8)` otherwise. [minUstxForSatsAmount](../cycles/minustxforsatsamount.md) computes the same value locally.
* Pass `earlyUnlockBytes` to [buildLockScript](../script/buildlockscript.md) when you build an L1 lockup for this bond.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L180-L204)

***

### Definition

```ts
export interface Bond {
  bondIndex: number;
  /** Target APY in basis points. */
  targetRateBps: number;
  /** STX:BTC price representation: ustx per 100 sats. */
  stxValueRatio: bigint;
  /** Minimum amount of STX (in basis points) that must be paired per BTC. */
  minUstxRatioBps: number;
  /**
   * Hex-encoded early-unlock subscript that guards the OP_ELSE (early-exit)
   * branch of the L1 lockup witness script (buff 683), e.g.
   * `<pubkey> OP_CHECKSIG`. Its result is consumed by the script's shared
   * OP_VERIFY.
   */
  earlyUnlockBytes: string;
}
```

***

### Properties

| Property           | Type     | Description                                                                                                                                    |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `bondIndex`        | `number` | Bond index, the map key. Added by the SDK from the requested index                                                                             |
| `targetRateBps`    | `number` | Target yield (APY) in basis points, from `target-rate`                                                                                         |
| `stxValueRatio`    | `bigint` | STX:BTC price as micro-STX per 100 sats, from `stx-value-ratio`                                                                                |
| `minUstxRatioBps`  | `number` | Minimum STX to pair with the BTC, in basis points of the BTC's value in STX, from `min-ustx-ratio`                                             |
| `earlyUnlockBytes` | `string` | Hex, without a `0x` prefix, of the subscript that guards the early-exit branch of the L1 lockup script, from `early-unlock-bytes` (`buff 683`) |

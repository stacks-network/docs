# validateEarlyUnlockBytes

Checks a bond's `early-unlock-bytes` subscript before it is spliced into a lockup script, and returns it as bytes. Pure computation: no network call.

***

### Usage

```ts
import { fetchBond, validateEarlyUnlockBytes } from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 2, network: 'mainnet' });
if (!bond) throw new Error('bond 2 is not set up');

const earlyUnlockBytes = validateEarlyUnlockBytes(bond.earlyUnlockBytes);
```

#### Notes

* The structural check always runs. It throws if the bytes are empty, since the early-exit branch would then carry no spend condition, or if they do not decode as Bitcoin script, since a truncated push corrupts the assembled lockup script.
* The shape check runs unless `opts.shape` is `false`. It throws unless the subscript has exactly one 33-byte public-key push, ends in `OP_CHECKSIG`, and contains no `OP_IF`, `OP_NOTIF`, `OP_ELSE` or `OP_ENDIF`.
* pox-5 treats these bytes as opaque, so an M-of-N template is valid on chain but fails the shape check. Pass `{ shape: false }` for such a bond. [finalizeReclaim](../reclaim/finalizereclaim.md) still cannot assemble an early-exit witness for more than one cosigner key.
* The bytes come from the bond's `early-unlock-bytes` field in the `protocol-bonds` map, up to 683 bytes ([L110-L128](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L110-L128)). Read them with [fetchBond](../fetch/fetchbond.md).
* [buildLockScript](buildlockscript.md) runs this check on its `earlyUnlockBytes`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L197-L240)

***

### Signature

```ts
function validateEarlyUnlockBytes(
  earlyUnlockBytes: Uint8Array | string,
  opts?: { shape?: boolean }
): Uint8Array;
```

***

### Returns

`Uint8Array`

The subscript as bytes, unchanged.

***

### Parameters

#### earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, as bytes or hex.

#### opts.shape (optional)

* **Type**: `boolean`

Whether to run the shape check. Defaults to `true`.

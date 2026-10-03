# buildUnlockScript

Builds the default staker unlock subscript, `<pubkey> OP_CHECKSIG`, from a compressed public key. Pure computation: no network call.

***

### Usage

```ts
import { buildUnlockScript } from '@stacks/bitcoin-staking';

const unlockBytes = buildUnlockScript(
  '0316e35d38b52d4886e40065e4952a49535ce914e02294be58e252d1998f129b19'
);
// 35 bytes: 0x21 (push 33 bytes), the key, 0xac (OP_CHECKSIG)
```

#### Notes

* Throws an `Error` if the key is not 33 bytes, does not start with `0x02` or `0x03`, or is not a point on secp256k1. The on-curve check matters because an off-curve key still yields a fundable lockup address whose `OP_CHECKSIG` can never pass.
* Pass the result as `unlockBytes` to [buildLockScript](buildlockscript.md), [buildLockOutputScript](buildlockoutputscript.md) or [buildLockAddress](buildlockaddress.md), and as `lockup.unlockBytes` to [buildRegisterForBond](../build/buildregisterforbond.md). [buildRegisterMetadata](buildregistermetadata.md) calls it for you.
* pox-5 splices these bytes raw at the end of the lockup script, so they run in both spend branches ([construct-lockup-script](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)). `register-for-bond` takes them as `staker-unlock-bytes`, capped at 683 bytes ([L664](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L664-L664)).
* [finalizeReclaim](../reclaim/finalizereclaim.md) expects exactly one staker public key in this subscript, which this format provides.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L35-L64)

***

### Signature

```ts
function buildUnlockScript(publicKey: Uint8Array | string): Uint8Array;
```

***

### Returns

`Uint8Array`

The encoded subscript: a 33-byte push of the key followed by `OP_CHECKSIG`.

***

### Parameters

#### publicKey (required)

* **Type**: `Uint8Array | string`

The staker's 33-byte compressed secp256k1 public key, as bytes or hex. This is the key that signs the lockup reclaim.

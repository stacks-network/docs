# verifySignerGrant

Checks a signer-key grant signature locally. Recovers the public key from the signature over the grant hash and compares it with `publicKey`, as pox-5 `grant-signer-key` does.

***

### Usage

```ts
import { verifySignerGrant } from '@stacks/bitcoin-staking';
import { STACKS_MAINNET } from '@stacks/network';

// signerKey: 33-byte compressed public key, hex. signerSignature: from signSignerGrant.
function assertGrantSignature(signerKey: string, signerSignature: string) {
  const valid = verifySignerGrant({
    signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
    authId: 1n,
    chainId: STACKS_MAINNET.chainId,
    publicKey: signerKey,
    signature: signerSignature,
  });
  if (!valid) throw new Error('signature does not match signerKey');
}
```

#### Notes

* `true` means the signature passes the signature checks of `grant-signer-key` for these inputs, which otherwise fail with `ERR_INVALID_SIGNATURE_RECOVER (u13)` or `ERR_INVALID_SIGNATURE_PUBKEY (u14)` ([pox-5.clar L2766-L2778](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2766-L2778)). It does not check whether the `authId` is already used ([fetchSignerKeyGrantUsed](../fetch/fetchsignerkeygrantused.md)) or who sends the transaction.
* The recovered key is compressed and compared as case-insensitive hex. Pass the 33-byte compressed public key: an uncompressed key returns `false`.
* Returns `false` instead of throwing when the signature or public key is malformed, for example a signature that is not 65 bytes.
* Makes no network request.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L75-L104)

***

### Signature

```ts
function verifySignerGrant(
  opts: SignerKeyGrantOptions & {
    publicKey: string | Uint8Array;
    signature: string | Uint8Array;
  }
): boolean;
```

`opts` extends [SignerKeyGrantOptions](../types/signerkeygrantoptions.md) with `publicKey` and `signature`.

***

### Returns

`boolean`

`true` if the key recovered from `signature` equals `publicKey`.

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Stacks principal of the signer-manager the grant authorizes.

#### opts.authId (required)

* **Type**: `IntegerType`

Replay nonce the signer signed.

#### opts.chainId (required)

* **Type**: `number`

Chain ID the signer signed for: `1` on mainnet, `0x80000000` on testnet.

#### opts.publicKey (required)

* **Type**: `string | Uint8Array`

Compressed public key of the signer, as hex or bytes.

#### opts.signature (required)

* **Type**: `string | Uint8Array`

65-byte RSV signature, as hex or bytes.

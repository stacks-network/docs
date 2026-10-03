# BuildGrantSignerKeyTxArgs

The arguments of [buildGrantSignerKey](../build/buildgrantsignerkey.md): [TxParams](txparams.md) plus the signer key, the signer-manager it authorizes, the `authId`, and the signer key's signature over the grant. The builder calls pox-5 [`grant-signer-key`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811) with them.

***

### Usage

```ts
import { buildGrantSignerKey, signSignerGrant } from '@stacks/bitcoin-staking';

const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';
const authId = 1n;

const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId: 1, // mainnet
  privateKey: signerPrivateKey,
});

const tx = await buildGrantSignerKey({
  signerKey: signerPublicKey, // 33-byte compressed, hex or bytes
  signerManager,
  authId,
  signerSignature,
  publicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* `grant-signer-key` requires `contract-caller` to equal `signerManager` and fails with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)` otherwise. The built transaction calls pox-5 directly, so `contract-caller` is the transaction's sender. A grant for a signer-manager contract succeeds only when that contract makes the call.
* `signerSignature` must recover to `signerKey` over the grant hash for `signerManager`, `authId` and the network's chain ID: `ERR_INVALID_SIGNATURE_RECOVER (u13)` if no key recovers, `ERR_INVALID_SIGNATURE_PUBKEY (u14)` if a different key does. [verifySignerGrant](../signer/verifysignergrant.md) runs the same check locally.
* A signer key, signer-manager and `authId` combination works once. A repeat fails with `ERR_SIGNER_KEY_GRANT_USED (u12)`.
* [fetchEligibleGrantSignerKey](../eligibility/fetcheligiblegrantsignerkey.md) checks the signature and replay conditions read-only. It does not check the `contract-caller` condition.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L253-L263)

***

### Definition

```ts
export type BuildGrantSignerKeyTxArgs = TxParams & {
  /** Compressed secp256k1 public key (33 bytes) of the signer. */
  signerKey: Uint8Array | string;
  /** Stacks principal of the signer-manager being authorized. */
  signerManager: string;
  /** Replay nonce: must match the value signed in the SIP-018 grant. */
  authId: IntegerType;
  /** Recoverable secp256k1 signature in RSV order (65 bytes). */
  signerSignature: Uint8Array | string;
};
```

***

### Properties

| Property          | Type                   | Description                                                                                                                                         |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `signerKey`       | `Uint8Array \| string` | Signer's compressed secp256k1 public key, 33 bytes, as bytes or hex. Sent as `signer-key` (`buff 33`)                                               |
| `signerManager`   | `string`               | Contract principal of the signer-manager being authorized. Sent as `signer-manager`                                                                 |
| `authId`          | `IntegerType`          | Replay nonce. Must equal the `authId` that was signed. Sent as `auth-id` (`uint`)                                                                   |
| `signerSignature` | `Uint8Array \| string` | 65-byte recoverable signature in RSV order, as bytes or hex, from [signSignerGrant](../signer/signsignergrant.md). Sent as `signer-sig` (`buff 65`) |

The transaction fields come from [TxParams](txparams.md).

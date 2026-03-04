# verifySignature

Verifies a secp256k1 signature against a message hash and public key. Re-exported from `@noble/secp256k1`.

***

### Usage

```ts
import { verifySignature } from '@stacks/transactions';

const isValid = verifySignature(
  signatureBytes,  // The signature as a Uint8Array
  messageHash,     // The message hash as a hex string or Uint8Array
  publicKey        // The public key as a hex string or Uint8Array
);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L12)**

***

### Signature

```ts
function verifySignature(
  signature: Uint8Array,
  messageHash: Uint8Array | string,
  publicKey: Uint8Array | string
): boolean;
```

***

### Returns

`boolean`

`true` if the signature is valid for the given message hash and public key, `false` otherwise.

***

### Parameters

#### signature (required)

* **Type**: `Uint8Array`

The signature to verify.

#### messageHash (required)

* **Type**: `Uint8Array | string`

The message hash that was signed.

#### publicKey (required)

* **Type**: `Uint8Array | string`

The public key to verify against.

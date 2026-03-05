# privateKeyToPublic

Derives the public key from a private key. Supports both compressed and uncompressed private keys.

***

### Usage

```ts
import { privateKeyToPublic } from '@stacks/transactions';

const publicKey = privateKeyToPublic(
  'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603'
);
// '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa'
```

#### Notes

- If the private key is compressed (ends with `01`, 33 bytes), the returned public key will be compressed.
- If the private key is uncompressed (32 bytes), the returned public key will be uncompressed.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L143)**

***

### Signature

```ts
function privateKeyToPublic(privateKey: PrivateKey): PublicKey;
```

***

### Returns

`PublicKey` (`string`)

The derived public key as a hex string.

***

### Parameters

#### privateKey (required)

* **Type**: `PrivateKey` (`string | Uint8Array`)

The private key to derive the public key from.

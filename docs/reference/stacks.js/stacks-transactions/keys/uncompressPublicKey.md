# uncompressPublicKey

Uncompresses a compressed public key to its uncompressed form.

***

### Usage

```ts
import { uncompressPublicKey } from '@stacks/transactions';

const uncompressed = uncompressPublicKey(
  '0367b23680c33a3adc784b80952f9bba83169d84c6567f49c9a92f7cc9c9b6f61b'
);
// '04171ee91c13f2007bd22c3280987d113e9ffdb2f10631783473899868e67dcdb876f2be26558ea1d4194a96a3707aff085c96a643d43e02c0e9e67c5d47a7dac6'
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L171)**

***

### Signature

```ts
function uncompressPublicKey(publicKey: PublicKey): string;
```

***

### Returns

`string`

The uncompressed public key as a hex string (65 bytes, starts with `04`).

***

### Parameters

#### publicKey (required)

* **Type**: `PublicKey` (`string | Uint8Array`)

The public key to uncompress.

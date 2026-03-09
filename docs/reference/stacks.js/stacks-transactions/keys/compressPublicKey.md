# compressPublicKey

Compresses an uncompressed public key to its compressed form.

***

### Usage

```ts
import { compressPublicKey } from '@stacks/transactions';

const compressed = compressPublicKey(
  '04171ee91c13f2007bd22c3280987d113e9ffdb2f10631783473899868e67dcdb876f2be26558ea1d4194a96a3707aff085c96a643d43e02c0e9e67c5d47a7dac6'
);
// '0367b23680c33a3adc784b80952f9bba83169d84c6567f49c9a92f7cc9c9b6f61b'
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L158)**

***

### Signature

```ts
function compressPublicKey(publicKey: PublicKey): string;
```

***

### Returns

`string`

The compressed public key as a hex string (33 bytes, starts with `02` or `03`).

***

### Parameters

#### publicKey (required)

* **Type**: `PublicKey` (`string | Uint8Array`)

The public key to compress. Can already be compressed (in which case it is returned as-is).

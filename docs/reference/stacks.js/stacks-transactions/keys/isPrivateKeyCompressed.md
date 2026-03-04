# isPrivateKeyCompressed

Checks if a private key is in compressed format (33 bytes / 66 hex characters).

***

### Usage

```ts
import { isPrivateKeyCompressed } from '@stacks/transactions';

isPrivateKeyCompressed(
  '64879bd015b0fbc19a798040b399b59c3c756cc79eaa9d24d18e66106ad7ee4801'
); // true (66 hex chars, ends with 01)

isPrivateKeyCompressed(
  '64879bd015b0fbc19a798040b399b59c3c756cc79eaa9d24d18e66106ad7ee48'
); // false (64 hex chars)
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L114)**

***

### Signature

```ts
function isPrivateKeyCompressed(privateKey: PrivateKey): boolean;
```

***

### Returns

`boolean`

`true` if the private key is compressed (33 bytes), `false` otherwise.

***

### Parameters

#### privateKey (required)

* **Type**: `PrivateKey` (`string | Uint8Array`)

The private key to check.

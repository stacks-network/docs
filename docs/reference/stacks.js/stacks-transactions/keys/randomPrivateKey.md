# randomPrivateKey

Generates a random compressed private key.

***

### Usage

```ts
import { randomPrivateKey } from '@stacks/transactions';

const privateKey = randomPrivateKey();
// e.g. 'f5a31c1268a1e37d4edaa05c7d11183c5fbfdcdc48aae36ea4d8cd5cb709932801'
```

#### Notes

- The returned key is always in compressed format (ends with `01`, 66 hex characters).
- Uses cryptographically secure random bytes from `@noble/secp256k1`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L187)**

***

### Signature

```ts
function randomPrivateKey(): string;
```

***

### Returns

`string`

A random compressed private key as a hex string.

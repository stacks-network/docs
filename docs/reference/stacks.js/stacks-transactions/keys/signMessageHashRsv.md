# signMessageHashRsv

Signs a message hash using a private key, producing a recoverable signature in RSV order. The resulting signature can be verified using `verifyMessageSignatureRsv`.

This is the Clarity-compatible signature format.

***

### Usage

```ts
import { signMessageHashRsv } from '@stacks/transactions';

const signature = signMessageHashRsv({
  messageHash: 'a1b2c3d4...', // 32-byte hash as hex string
  privateKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/keys.ts#L213)**

***

### Signature

```ts
function signMessageHashRsv(opts: {
  messageHash: string;
  privateKey: PrivateKey;
}): string;
```

***

### Returns

`string`

A recoverable signature in RSV order as a hex string.

***

### Parameters

#### opts (required)

* **Type**: `{ messageHash: string; privateKey: PrivateKey }`

#### opts.messageHash (required)

* **Type**: `string`

The message hash to sign (hex-encoded, 32 bytes).

#### opts.privateKey (required)

* **Type**: `PrivateKey` (`string | Uint8Array`)

The private key to sign with.

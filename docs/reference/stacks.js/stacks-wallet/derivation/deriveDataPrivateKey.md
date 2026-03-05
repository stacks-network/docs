# deriveDataPrivateKey

Derives the data private key for a specific account index. Uses the data derivation path `m/888'/0'/{index + HARDENED_OFFSET}`.

This key was used in Stacks 1.0 for BNS name registration and is still used for Gaia storage and profile signing.

***

### Usage

```ts
import { deriveDataPrivateKey } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const dataPrivateKey = deriveDataPrivateKey({ rootNode, index: 0 });
// compressed hex private key string
```

#### Notes

- The returned private key is compressed (33 bytes, hex-encoded).
- Uses a hardened child derivation (`index + 0x80000000`).
- This key is separate from the STX private key and is used for data-layer operations (Gaia, profiles).

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L249)**

***

### Signature

```ts
function deriveDataPrivateKey(opts: {
  rootNode: HDKey;
  index: number;
}): string;
```

***

### Returns

`string`

A compressed hex-encoded private key string.

***

### Parameters

#### opts (required)

| Property | Type | Description |
| --- | --- | --- |
| `rootNode` | `HDKey` | The root HD key derived from the wallet's seed phrase. |
| `index` | `number` | The account index to derive the key for (0-based). |

# deriveStxPrivateKey

Derives the STX private key for a specific account index. Uses the STX derivation path `m/44'/5757'/0'/0/{index}`.

***

### Usage

```ts
import { deriveStxPrivateKey } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const stxPrivateKey = deriveStxPrivateKey({ rootNode, index: 0 });
// compressed hex private key string
```

#### Notes

- The returned private key is compressed (33 bytes, hex-encoded).
- This key is used for signing STX transactions and is the primary key for an account.
- The derivation path follows BIP44: `m/44'/5757'/0'/0/{index}`, where `5757` is the Stacks coin type.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L243)**

***

### Signature

```ts
function deriveStxPrivateKey(opts: {
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

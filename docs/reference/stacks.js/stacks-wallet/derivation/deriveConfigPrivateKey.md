# deriveConfigPrivateKey

Derives the configuration private key from the wallet's root node. This key is used to encrypt wallet configuration data that can be synced across devices.

The key is derived from path `m/5757'/0'/1`, following the BIP44 recommendation for keys relating to non-public data.

***

### Usage

```ts
import { deriveConfigPrivateKey } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const configKey = deriveConfigPrivateKey(rootNode);
// Uint8Array — the raw private key bytes
```

#### Notes

- Returns the raw private key as a `Uint8Array`.
- Throws a `TypeError` if the key cannot be derived.
- This is called internally by `deriveWalletKeys`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L42)**

***

### Signature

```ts
function deriveConfigPrivateKey(rootNode: HDKey): Uint8Array;
```

***

### Returns

`Uint8Array`

The raw private key bytes for the configuration key.

***

### Parameters

#### rootNode (required)

* **Type**: `HDKey` (from `@scure/bip32`)

The root HD key derived from the wallet's seed phrase.

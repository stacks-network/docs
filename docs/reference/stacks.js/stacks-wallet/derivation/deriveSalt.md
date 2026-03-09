# deriveSalt

Generates a salt from the wallet's root node. The salt is derived by hashing the public key of the identity keychain at path `m/888'/0'`.

The salt is used when generating app-specific private keys for each account.

***

### Usage

```ts
import { deriveSalt } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const salt = await deriveSalt(rootNode);
// hex string
```

#### Notes

- Returns a hex-encoded SHA-256 hash of the identity keychain's public key.
- The same salt is shared across all accounts in a wallet and is used as an input when deriving app-specific keys.
- This is called internally by `deriveWalletKeys`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L65)**

***

### Signature

```ts
function deriveSalt(rootNode: HDKey): Promise<string>;
```

***

### Returns

`Promise<string>`

A hex-encoded string representing the wallet-level salt.

***

### Parameters

#### rootNode (required)

* **Type**: `HDKey` (from `@scure/bip32`)

The root HD key derived from the wallet's seed phrase.

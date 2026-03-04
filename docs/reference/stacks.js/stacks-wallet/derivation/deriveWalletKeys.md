# deriveWalletKeys

Derives the root-level wallet keys from an HD root node. Returns the salt, root extended private key, and configuration private key.

***

### Usage

```ts
import { deriveWalletKeys } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const walletKeys = await deriveWalletKeys(rootNode);

console.log(walletKeys.salt);            // hex string
console.log(walletKeys.rootKey);         // xprv... extended private key
console.log(walletKeys.configPrivateKey); // hex string
```

#### Notes

- This is called internally by `generateWallet`. You typically don't need to call it directly unless building custom wallet flows.
- The `salt` is derived from the identity keychain's public key and used for generating app-specific private keys.
- The `configPrivateKey` is derived from path `m/5757'/0'/1` and is used to encrypt wallet configuration data.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L24)**

***

### Signature

```ts
function deriveWalletKeys(rootNode: HDKey): Promise<WalletKeys>;
```

***

### Returns

`Promise<WalletKeys>`

```ts
interface WalletKeys {
  salt: string;
  rootKey: string;
  configPrivateKey: string;
}
```

***

### Parameters

#### rootNode (required)

* **Type**: `HDKey` (from `@scure/bip32`)

The root HD key derived from the wallet's seed phrase.

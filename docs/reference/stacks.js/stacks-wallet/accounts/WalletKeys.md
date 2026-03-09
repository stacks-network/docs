# WalletKeys

Interface representing the root-level keys derived from a wallet's seed phrase. These keys are the foundation for all account derivation and configuration encryption.

***

### Usage

```ts
import { deriveWalletKeys, WalletKeys } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const walletKeys: WalletKeys = await deriveWalletKeys(rootNode);

console.log(walletKeys.salt);            // hex string
console.log(walletKeys.rootKey);         // xprv...
console.log(walletKeys.configPrivateKey); // hex string
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/common.ts#L34)**

***

### Definition

```ts
interface WalletKeys {
  /** Used when generating app private keys, which encrypt app-specific data */
  salt: string;
  /** The private key associated with the root of a BIP39 keychain */
  rootKey: string;
  /** A private key used to encrypt configuration data */
  configPrivateKey: string;
}
```

***

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `salt` | `string` | Hex-encoded salt derived from the identity keychain. Used as input when deriving app-specific keys. |
| `rootKey` | `string` | The root extended private key (`xprv...`) from the BIP39 seed. Used to reconstruct the HD keychain. |
| `configPrivateKey` | `string` | Hex-encoded private key derived from path `m/5757'/0'/1`. Used to encrypt/decrypt wallet configuration data stored in Gaia. |

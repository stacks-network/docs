# deriveAccount

Derives a full `Account` object for a given account index. Combines the STX private key, data private key, apps key, and salt into a single account structure.

***

### Usage

```ts
import { deriveAccount, DerivationType } from '@stacks/wallet-sdk';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';

const seed = await mnemonicToSeed('your 24-word seed phrase ...');
const rootNode = HDKey.fromMasterSeed(seed);

const account = deriveAccount({
  rootNode,
  index: 0,
  salt: 'wallet-salt-hex-string',
  stxDerivationType: DerivationType.Wallet,
});

console.log(account.stxPrivateKey);  // hex private key for STX transactions
console.log(account.dataPrivateKey); // hex private key for Gaia/profiles
console.log(account.appsKey);       // extended private key for app-specific keys
console.log(account.index);          // 0
```

#### Notes

- The `stxDerivationType` determines which derivation path is used for the STX private key: `DerivationType.Wallet` uses the STX path (`m/44'/5757'/0'/0`), while `DerivationType.Data` uses the data path (`m/888'/0'`).
- The data private key and apps key are always derived from the data derivation path regardless of `stxDerivationType`.
- This is called internally by `generateWallet` and `generateNewAccount`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/derive.ts#L255)**

***

### Signature

```ts
function deriveAccount(opts: {
  rootNode: HDKey;
  index: number;
  salt: string;
  stxDerivationType: DerivationType.Wallet | DerivationType.Data;
}): Account;
```

***

### Returns

`Account`

An `Account` object containing all derived keys for the given index.

***

### Parameters

#### opts (required)

| Property | Type | Description |
| --- | --- | --- |
| `rootNode` | `HDKey` | The root HD key derived from the wallet's seed phrase. |
| `index` | `number` | The account index (0-based). |
| `salt` | `string` | The wallet-level salt (from `deriveWalletKeys`). |
| `stxDerivationType` | `DerivationType.Wallet \| DerivationType.Data` | Which derivation path to use for the STX private key. |

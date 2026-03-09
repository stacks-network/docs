# Account

Interface representing a single account within a Stacks wallet. Contains the private keys and metadata needed for STX transactions, Gaia storage, and app-specific key derivation.

***

### Usage

```ts
import { generateWallet, getStxAddress, Account } from '@stacks/wallet-sdk';

const wallet = await generateWallet({
  secretKey: 'your 24-word seed phrase ...',
  password: 'password',
});

const account: Account = wallet.accounts[0];

console.log(account.index);          // 0
console.log(account.stxPrivateKey);  // hex string — used for STX transactions
console.log(account.dataPrivateKey); // hex string — used for Gaia/profiles
console.log(account.appsKey);       // xprv... — root for app-specific keys
console.log(account.salt);           // hex string — wallet-level salt
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/common.ts#L7)**

***

### Definition

```ts
interface Account {
  /** The private key used for STX payments */
  stxPrivateKey: string;
  /** The private key used in Stacks 1.0 to register BNS names */
  dataPrivateKey: string;
  /** The salt is the same as the wallet-level salt. Used for app-specific keys */
  salt: string;
  /** A single username registered via BNS for this account */
  username?: string;
  /** A profile object that is publicly associated with this account's username */
  profile?: Profile;
  /** The root of the keychain used to generate app-specific keys */
  appsKey: string;
  /** The index of this account in the user's wallet */
  index: number;
}
```

***

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `stxPrivateKey` | `string` | Hex-encoded private key for signing STX transactions. |
| `dataPrivateKey` | `string` | Hex-encoded private key for Gaia storage and profile operations. |
| `salt` | `string` | Wallet-level salt used when deriving app-specific keys. |
| `username` | `string \| undefined` | BNS username registered for this account, if any. |
| `profile` | `Profile \| undefined` | Public profile associated with this account's username. |
| `appsKey` | `string` | Extended private key (`xprv...`) used as the root for deriving app-specific keys. |
| `index` | `number` | The index of this account in the wallet (0-based). |

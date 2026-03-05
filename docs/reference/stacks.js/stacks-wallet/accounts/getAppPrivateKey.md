# getAppPrivateKey

Derives an app-specific private key for a given account and app domain. Each app gets a unique private key derived from the account's `appsKey` and the app domain + wallet salt.

***

### Usage

```ts
import { getAppPrivateKey, generateWallet } from '@stacks/wallet-sdk';

const wallet = await generateWallet({
  secretKey: 'your 24-word seed phrase ...',
  password: 'password',
});

const account = wallet.accounts[0];

const appPrivateKey = getAppPrivateKey({
  account,
  appDomain: 'https://my-app.example.com',
});
// hex private key string unique to this account + app combination
```

#### Notes

- The app private key is deterministic — the same account + app domain always produces the same key.
- The derivation uses `SHA-256(appDomain + account.salt)` to compute an app index, then derives a hardened child key from the account's `appsKey`.
- This key is used for Gaia storage and app-specific authentication.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/account.ts#L71)**

***

### Signature

```ts
function getAppPrivateKey(opts: {
  account: Account;
  appDomain: string;
}): string;
```

***

### Returns

`string`

A hex-encoded private key unique to the account and app domain.

***

### Parameters

#### opts (required)

| Property | Type | Description |
| --- | --- | --- |
| `account` | `Account` | The account to derive the app key for. |
| `appDomain` | `string` | The origin URL of the app (e.g. `'https://my-app.example.com'`). |

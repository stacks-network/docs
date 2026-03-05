# getAccountDisplayName

Returns a human-readable display name for an account. If the account has a BNS username, it returns the first label (e.g. `myname.btc` → `myname`). Otherwise, it returns `Account {index + 1}`.

***

### Usage

```ts
import { getAccountDisplayName, generateWallet } from '@stacks/wallet-sdk';

const wallet = await generateWallet({
  secretKey: 'your 24-word seed phrase ...',
  password: 'password',
});

const account = wallet.accounts[0];

// Account without a username
console.log(getAccountDisplayName(account));
// 'Account 1'

// Account with a username
account.username = 'myname.btc';
console.log(getAccountDisplayName(account));
// 'myname'
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/account.ts#L62)**

***

### Signature

```ts
function getAccountDisplayName(account: Account): string;
```

***

### Returns

`string`

The display name for the account.

***

### Parameters

#### account (required)

* **Type**: `Account`

The account to get the display name for.

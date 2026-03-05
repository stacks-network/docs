# generateNewAccount

Derives the next account for an existing wallet. Returns a new wallet object with the additional account appended — the original wallet is not mutated.

***

### Usage

```ts
import { generateWallet, generateNewAccount } from '@stacks/wallet-sdk';

let wallet = await generateWallet({
  secretKey: 'your 24-word seed phrase here ...',
  password: 'my-secure-password',
});

console.log(wallet.accounts.length); // 1

// Add a second account
wallet = generateNewAccount(wallet);
console.log(wallet.accounts.length); // 2

// Add a third account
wallet = generateNewAccount(wallet);
console.log(wallet.accounts.length); // 3
```

#### Notes

- Each call derives the next sequential account index.
- The returned wallet is a new object — the original wallet is not mutated.
- Accounts are derived using the `DerivationType.Wallet` derivation path (`m/44'/5757'/0'/0`).

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/generate.ts#L70)**

***

### Signature

```ts
function generateNewAccount(wallet: Wallet): Wallet;
```

***

### Returns

`Wallet`

A new `Wallet` object with the additional account appended to `wallet.accounts`.

***

### Parameters

#### wallet (required)

* **Type**: `Wallet`

The existing wallet to derive a new account for. The new account's index will be `wallet.accounts.length`.

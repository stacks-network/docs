# generateWallet

Creates a new `Wallet` from a BIP39 mnemonic seed phrase and a password. The seed phrase is encrypted with the password and stored in the wallet. Automatically derives the first account.

***

### Usage

```ts
import { randomSeedPhrase, generateWallet } from '@stacks/wallet-sdk';

const secretKey = randomSeedPhrase();

const wallet = await generateWallet({
  secretKey,
  password: 'my-secure-password',
});

console.log(wallet.accounts.length); // 1 (first account auto-derived)
console.log(wallet.encryptedSecretKey); // hex-encoded encrypted mnemonic
```

#### Notes

- The `secretKey` must be a valid BIP39 mnemonic (12 or 24 words).
- The `password` is used to encrypt the mnemonic via `@stacks/encryption`.
- The wallet is returned with one account already derived (index 0).
- Use `generateNewAccount` to add additional accounts to the wallet.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/generate.ts#L43)**

***

### Signature

```ts
function generateWallet(opts: {
  secretKey: string;
  password: string;
}): Promise<Wallet>;
```

***

### Returns

`Promise<Wallet>`

A promise that resolves to a `Wallet` object containing the encrypted secret key, wallet keys, and one derived account.

***

### Parameters

#### opts (required)

| Property | Type | Description |
| --- | --- | --- |
| `secretKey` | `string` | A valid BIP39 mnemonic phrase (12 or 24 words). |
| `password` | `string` | A password used to encrypt the mnemonic. |

# signProfileForUpload

Signs a user profile with the account's STX private key and returns a JSON string of the wrapped token records, ready for upload to a Gaia hub.

***

## Usage

```ts
import { signProfileForUpload, generateWallet, generateNewAccount } from '@stacks/wallet-sdk';

const wallet = await generateWallet({
  secretKey: 'your twelve word seed phrase ...',
  password: 'password',
});
const updatedWallet = generateNewAccount(wallet);
const account = updatedWallet.accounts[0];

const profile = {
  '@type': 'Person',
  '@context': 'http://schema.org',
  name: 'Alice',
  description: 'Stacks developer',
};

const signedData = signProfileForUpload({ profile, account });

console.log(signedData);
// A JSON string containing an array of signed token records
```

### Notes

- The profile is always signed with the account's `stxPrivateKey`, since any on-chain username is owned by the STX key.
- The returned value is a JSON string (pretty-printed with 2-space indentation) containing an array with one wrapped profile token record.
- This function is typically used in combination with `uploadProfile` or you can use `signAndUploadProfile` which does both steps.

***

## Reference

[Source code](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/profile.ts)

***

## Function Signature

```ts
function signProfileForUpload(options: {
  profile: PublicProfileBase;
  account: Account;
}): string
```

***

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `profile` | `PublicProfileBase` | The profile object to sign. Must conform to the `PublicProfileBase` schema (e.g., `{ '@type': 'Person', '@context': 'http://schema.org' }`). |
| `account` | `Account` | The account whose `stxPrivateKey` is used to sign the profile token. |

***

## Returns

`string`

A JSON string containing an array of signed, wrapped profile token records.

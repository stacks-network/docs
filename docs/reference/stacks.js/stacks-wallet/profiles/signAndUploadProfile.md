# signAndUploadProfile

Signs a user profile with the account's STX private key and uploads it to a Gaia hub in a single step. This is a convenience function that combines `signProfileForUpload` and `uploadProfile`.

***

## Usage

```ts
import {
  signAndUploadProfile,
  generateWallet,
  generateNewAccount,
} from '@stacks/wallet-sdk';

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

await signAndUploadProfile({
  profile,
  gaiaHubUrl: 'https://hub.blockstack.org',
  account,
});
```

### Notes

- This function signs the profile with `signProfileForUpload` and then uploads the result via `uploadProfile`.
- The profile is uploaded to `profile.json` in the account's Gaia storage bucket.
- You can optionally pass a pre-existing `GaiaHubConfig` to avoid re-connecting to the Gaia hub.
- If no `gaiaHubConfig` is provided, one is created automatically using the account's `dataPrivateKey`.

***

## Reference

[Source code](https://github.com/stx-labs/stacks.js/tree/main/packages/wallet-sdk/src/models/profile.ts)

***

## Function Signature

```ts
function signAndUploadProfile(options: {
  profile: PublicProfileBase;
  gaiaHubUrl: string;
  account: Account;
  gaiaHubConfig?: GaiaHubConfig;
}): Promise<void>
```

***

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `profile` | `PublicProfileBase` | The profile object to sign and upload. |
| `gaiaHubUrl` | `string` | The URL of the Gaia hub (e.g., `'https://hub.blockstack.org'`). |
| `account` | `Account` | The account used for signing the profile and authenticating with the Gaia hub. |
| `gaiaHubConfig` | `GaiaHubConfig` | _(Optional)_ A pre-existing Gaia hub configuration. If omitted, the function connects to the hub using the account's `dataPrivateKey`. |

***

## Returns

`Promise<void>`

Resolves when the profile has been signed and successfully uploaded.

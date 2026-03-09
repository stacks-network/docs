# stx\_getAccounts

Requests the user's Stacks account information from the connected wallet. This includes addresses, public keys, and Gaia Hub connection details.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_getAccounts', {
  network: 'mainnet',
});

for (const account of result.accounts) {
  console.log(`Address: ${account.address}`);
  console.log(`Public Key: ${account.publicKey}`);
  console.log(`Gaia Hub URL: ${account.gaiaHubUrl}`);
  console.log(`Gaia App Key: ${account.gaiaAppKey}`);
}
```

#### Notes

- Unlike [`stx_getAddresses`](stx_getAddresses.md), this method also returns Gaia Hub information (`gaiaHubUrl` and `gaiaAppKey`), which is needed for decentralized storage operations.
- Not all wallets may support this method. Check wallet documentation for compatibility.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L124)**

***

### Signature

```ts
function request(
  'stx_getAccounts',
  params?: GetAccountsParams
): Promise<GetAccountsResult>
```

***

### Returns

`GetAccountsResult`

```ts
interface GetAccountsResult {
  accounts: AccountEntry[];
}

interface AccountEntry {
  symbol?: string;
  address: string;
  publicKey: string;
  gaiaHubUrl: string;
  gaiaAppKey: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `accounts` | `AccountEntry[]` | An array of account entries from the wallet. |

Each `AccountEntry` contains:

| Property | Type | Description |
| --- | --- | --- |
| `symbol` | `string` (optional) | The symbol for the address. |
| `address` | `string` | The Stacks address string. |
| `publicKey` | `string` | The hex-encoded public key for this account. |
| `gaiaHubUrl` | `string` | The Gaia Hub URL for this account. |
| `gaiaAppKey` | `string` | The Gaia app-specific key for this account. |

***

### Parameters

#### network (optional)

* **Type**: `NetworkString`

The network to request accounts for (e.g. `'mainnet'`, `'testnet'`, `'devnet'`).

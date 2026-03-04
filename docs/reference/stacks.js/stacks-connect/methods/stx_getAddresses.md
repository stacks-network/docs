# stx\_getAddresses

Requests the user's Stacks addresses from the connected wallet.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_getAddresses', {
  network: 'mainnet',
});

for (const entry of result.addresses) {
  console.log(`Address: ${entry.address}`);
  console.log(`Public Key: ${entry.publicKey}`);
}
```

#### Notes

- This method returns only Stacks (STX) addresses. For BTC addresses, use [`getAddresses`](getAddresses.md).
- If you need to prompt the user to select a wallet first, use [`connect`](../connection/connect.md) instead.
- Results are automatically cached in local storage when `enableLocalStorage` is `true` (the default).

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L118)**

***

### Signature

```ts
function request(
  'stx_getAddresses',
  params?: GetAddressesParams
): Promise<GetAddressesResult>
```

***

### Returns

`GetAddressesResult`

```ts
interface GetAddressesResult {
  addresses: AddressEntry[];
}

interface AddressEntry {
  symbol?: string;
  address: string;
  publicKey: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `addresses` | `AddressEntry[]` | An array of address entries from the wallet. |

Each `AddressEntry` contains:

| Property | Type | Description |
| --- | --- | --- |
| `symbol` | `string` (optional) | The symbol for the address (e.g. `'STX'`). |
| `address` | `string` | The Stacks address string. |
| `publicKey` | `string` | The hex-encoded public key for this address. |

***

### Parameters

#### network (optional)

* **Type**: `NetworkString`

The network to request addresses for (e.g. `'mainnet'`, `'testnet'`, `'devnet'`).

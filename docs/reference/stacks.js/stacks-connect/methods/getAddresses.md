# getAddresses

Requests the user's Bitcoin and Stacks addresses from the connected wallet. This is a multi-chain address discovery method that typically returns both BTC and STX addresses.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('getAddresses', {
  network: 'mainnet',
});

for (const entry of result.addresses) {
  console.log(`Address: ${entry.address}`);
  console.log(`Public Key: ${entry.publicKey}`);
  console.log(`Symbol: ${entry.symbol}`);
}
```

#### Notes

* This method returns addresses for **all supported chains** (BTC and STX). For Stacks-only addresses, use [`stx_getAddresses`](stx_getAddresses.md).
* Results are automatically cached in local storage when `enableLocalStorage` is `true` (the default).
* For Xverse-like wallets, this method is automatically overridden to use `wallet_connect` when provider overrides are enabled.
* The [`connect`](../connection/connect.md) function is a convenience wrapper that calls this method with `forceWalletSelect: true`.
* To derive a Bitcoin Staking lock address from an entry, pass its `publicKey` to [`buildLockAddress`](../../stacks-bitcoin-staking/script/buildlockaddress.md) in `@stacks/bitcoin-staking`, with `stxAddress`, `unlockHeight`, `earlyUnlockBytes` and `network`. The key must be a 33-byte compressed key starting with `02` or `03`. [`buildUnlockScript`](../../stacks-bitcoin-staking/script/buildunlockscript.md) throws on any other key, so check the entry's key length first.

[**Reference Link**](https://github.com/stx-labs/connect/blob/v8.2.7/packages/connect/src/methods.ts#L236-L239)

***

### Signature

```ts
function request(
  'getAddresses',
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

| Property    | Type             | Description                                  |
| ----------- | ---------------- | -------------------------------------------- |
| `addresses` | `AddressEntry[]` | An array of address entries from the wallet. |

Each `AddressEntry` contains:

| Property    | Type                | Description                                         |
| ----------- | ------------------- | --------------------------------------------------- |
| `symbol`    | `string` (optional) | The symbol for the address (e.g. `'STX'`, `'BTC'`). |
| `address`   | `string`            | The address string.                                 |
| `publicKey` | `string`            | The hex-encoded public key for this address.        |

***

### Parameters

#### network (optional)

* **Type**: `NetworkString`

The network to request addresses for (e.g. `'mainnet'`, `'testnet'`).

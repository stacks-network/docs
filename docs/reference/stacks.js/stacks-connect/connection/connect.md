# connect

Initiates a wallet connection by prompting the user to select a wallet and then requesting their addresses. This is a convenience wrapper around [`request`](../request/request.md) that calls `getAddresses` with `forceWalletSelect: true`.

***

### Usage

```ts
import { connect } from '@stacks/connect';

const response = await connect();

console.log('Addresses:', response.addresses);
```

```ts
import { connect } from '@stacks/connect';

// With options
const response = await connect({
  forceWalletSelect: true,
  approvedProviderIds: ['LeatherProvider', 'XverseProviders.BitcoinProvider'],
  network: 'mainnet',
});
```

#### Notes

- This always opens the wallet selection modal, regardless of whether a wallet was previously selected.
- The returned addresses include both STX and BTC addresses provided by the wallet.
- Accepts all [`ConnectRequestOptions`](../request/ConnectRequestOptions.md) properties as well as `GetAddressesParams` (e.g. `network`).

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/request.ts#L307)**

***

### Signature

```ts
function connect(
  options?: ConnectRequestOptions & MethodParams<'getAddresses'>
): Promise<GetAddressesResult>
```

***

### Returns

`Promise<GetAddressesResult>`

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

An object containing an `addresses` array. Each entry includes the address string, its public key, and an optional `symbol` (e.g. `'STX'` or `'BTC'`).

***

### Parameters

#### options (optional)

* **Type**: `ConnectRequestOptions & MethodParams<'getAddresses'>`

Combines all properties from [`ConnectRequestOptions`](../request/ConnectRequestOptions.md) with `GetAddressesParams`.

The additional parameter from `GetAddressesParams`:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `network` | `NetworkString` | No | The network to request addresses for (e.g. `'mainnet'`, `'testnet'`). |

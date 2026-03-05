# request

The main method for interacting with Stacks and Bitcoin wallets via JSON-RPC. This method handles automatic error handling, request parameter serialization, wallet selection UI, and optional local storage caching.

For more advanced or low-level use cases, consider using the [`requestRaw`](requestRaw.md) method directly.

***

### Usage

```ts
import { request } from '@stacks/connect';

// Simple usage with just a method and params
const result = await request('stx_transferStx', {
  recipient: 'SP2...address',
  amount: 1000000n,
  memo: 'Payment',
});
```

```ts
import { request } from '@stacks/connect';

// Usage with ConnectRequestOptions
const result = await request(
  {
    forceWalletSelect: true,
    persistWalletSelect: true,
    enableOverrides: true,
    enableLocalStorage: true,
  },
  'stx_transferStx',
  {
    recipient: 'SP2...address',
    amount: 1000000n,
    memo: 'Payment',
  }
);
```

```ts
import { request } from '@stacks/connect';

// Send BTC
const result = await request('sendTransfer', {
  recipients: [
    {
      address: 'bc1q...address',
      amount: 100_000_000n, // 1 BTC = 100,000,000 sats
    },
  ],
});
```

#### Notes

- When no `provider` is specified and no wallet has been previously selected, the wallet selection modal is automatically displayed.
- Parameters containing `bigint` values and Clarity values are automatically serialized before being sent to the wallet.
- Post conditions are automatically serialized to hex strings.
- If `enableLocalStorage` is `true` (the default), address results from `getAddresses` calls are cached in local storage.
- In SSR (server-side rendering) contexts, the method returns `undefined` instead of throwing an error.
- Pressing `Escape` while the wallet modal is open will cancel the request and throw a `JsonRpcError` with code `UserCanceled`.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/request.ts#L168)**

***

### Signature

The `request` function supports two call signatures via overloads:

```ts
// Overload 1: Method and params only
function request<M extends keyof Methods>(
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>>;

// Overload 2: With ConnectRequestOptions
function request<M extends keyof Methods>(
  options: ConnectRequestOptions,
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>>;
```

***

### Returns

`Promise<MethodResult<M>>`

The return type depends on the wallet method being called. Each wallet method defines its own result type. See individual method reference pages for specific return types.

| Method | Result Type |
| --- | --- |
| `getAddresses` | [`GetAddressesResult`](../methods/getAddresses.md) |
| `sendTransfer` | [`TxidResult`](../methods/sendTransfer.md) |
| `signPsbt` | [`SignPsbtResult`](../methods/signPsbt.md) |
| `stx_transferStx` | [`TransactionResult`](../methods/stx_transferStx.md) |
| `stx_callContract` | [`TransactionResult`](../methods/stx_callContract.md) |
| `stx_deployContract` | [`TransactionResult`](../methods/stx_deployContract.md) |
| `stx_signTransaction` | [`SignTransactionResult`](../methods/stx_signTransaction.md) |
| `stx_signMessage` | [`SignMessageResult`](../methods/stx_signMessage.md) |
| `stx_signStructuredMessage` | [`SignMessageResult`](../methods/stx_signStructuredMessage.md) |
| `stx_getAddresses` | [`GetAddressesResult`](../methods/stx_getAddresses.md) |
| `stx_getAccounts` | [`GetAccountsResult`](../methods/stx_getAccounts.md) |
| `stx_updateProfile` | [`UpdateProfileResult`](../methods/stx_updateProfile.md) |
| `stx_transferSip10Ft` | [`TransactionResult`](../methods/stx_transferSip10Ft.md) |
| `stx_transferSip9Nft` | [`TransactionResult`](../methods/stx_transferSip9Nft.md) |

***

### Parameters

#### method (required)

* **Type**: `keyof Methods`

The wallet JSON-RPC method name to call. See the table above for all available methods.

#### params (optional)

* **Type**: `MethodParams<M>`

The parameters object for the specified method. Each method defines its own parameter type. See individual method reference pages for details.

#### options (optional)

* **Type**: [`ConnectRequestOptions`](ConnectRequestOptions.md)

Configuration options for the request, including provider selection, wallet UI behavior, and local storage settings. See the [`ConnectRequestOptions`](ConnectRequestOptions.md) reference for full details.

***

### Error Handling

The `request` method throws a [`JsonRpcError`](../errors/JsonRpcError.md) when the wallet returns an error or the user cancels the request. You should wrap calls in a `try/catch` block:

```ts
import { request } from '@stacks/connect';
import { JsonRpcError } from '@stacks/connect';

try {
  const result = await request('stx_transferStx', {
    recipient: 'SP2...address',
    amount: 1000000n,
  });
  console.log('Transaction ID:', result.txid);
} catch (error) {
  if (error instanceof JsonRpcError) {
    console.error('Wallet error:', error.code, error.message);
  }
}
```

***

### Provider Override Behavior

When `enableOverrides` is `true` (the default), `request` automatically adjusts method names and parameter formats for different wallet providers (e.g. Xverse, Leather, Fordefi) to normalize behavior across the ecosystem. This includes:

- Converting `getAddresses` to `wallet_connect` for Xverse-like wallets.
- Normalizing `amount` types between `number` and `string` depending on the wallet.
- Transforming `signPsbt` input formats to match each wallet's expected schema.
- Normalizing response fields like `txId` vs `txid` and `hex` vs `psbt`.

# requestRaw

A low-level function for sending JSON-RPC requests directly to a wallet provider. Unlike [`request`](request.md), this function does not handle wallet selection UI, parameter serialization, provider overrides, or local storage caching. It communicates directly with a given `StacksProvider` instance.

Use `requestRaw` when you need full control over the request lifecycle, are building custom wallet integrations, or want to bypass the automatic behaviors provided by `request`.

***

### Usage

```ts
import { requestRaw } from '@stacks/connect';
import { getStacksProvider } from '@stacks/connect';

const provider = getStacksProvider();

const result = await requestRaw(provider, 'stx_transferStx', {
  recipient: 'SP2...address',
  amount: '1000000',
  memo: 'Payment',
});

console.log('Transaction ID:', result.txid);
```

```ts
import { requestRaw } from '@stacks/connect';

// Get addresses directly from a known provider
const result = await requestRaw(provider, 'stx_getAddresses', {
  network: 'mainnet',
});

console.log('Addresses:', result.addresses);
```

#### Notes

- Unlike `request`, you must provide a `StacksProvider` directly. No wallet selection UI is shown.
- Parameters are **not** automatically serialized. You must ensure `bigint` values are converted to strings and Clarity values are hex-encoded before passing them.
- Provider overrides are **not** applied. The method name and params are sent as-is to the provider.
- Local storage caching is **not** performed.
- Errors from the wallet are caught and re-thrown as [`JsonRpcError`](../errors/JsonRpcError.md) instances.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/request.ts#L97)**

***

### Signature

```ts
function requestRaw<M extends keyof MethodsRaw>(
  provider: StacksProvider,
  method: M,
  params?: MethodParamsRaw<M>
): Promise<MethodResultRaw<M>>
```

***

### Returns

`Promise<MethodResultRaw<M>>`

The raw result from the wallet provider. The `MethodResultRaw` type is identical to `MethodResult` but with all `bigint` and `ClarityValue` types transformed to `string`. This reflects the actual JSON-RPC response shape from wallets.

***

### Parameters

#### provider (required)

* **Type**: `StacksProvider`

```ts
interface StacksProvider {
  request<M extends keyof MethodsRaw>(
    method: M,
    params?: MethodParamsRaw<M>
  ): Promise<JsonRpcResponse<M>>;
}
```

The wallet provider instance to send the request to. This is an object that implements the `StacksProvider` interface, exposing a `request` method compatible with the JSON-RPC protocol.

#### method (required)

* **Type**: `keyof MethodsRaw`

The wallet JSON-RPC method name to call (e.g. `'stx_transferStx'`, `'getAddresses'`, `'signPsbt'`).

#### params (optional)

* **Type**: `MethodParamsRaw<M>`

The parameters for the specified method. Unlike `request`, these must already be in their raw (serialized) form—`bigint` values should be strings, and `ClarityValue` objects should be hex-encoded strings.

***

### Error Handling

`requestRaw` normalizes all wallet errors into [`JsonRpcError`](../errors/JsonRpcError.md) instances:

```ts
import { requestRaw, JsonRpcError } from '@stacks/connect';

try {
  const result = await requestRaw(provider, 'stx_transferStx', {
    recipient: 'SP2...address',
    amount: '1000000',
  });
} catch (error) {
  if (error instanceof JsonRpcError) {
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

The following scenarios produce a `JsonRpcError`:

- The provider returns no response → `UnknownError`
- The provider response contains an `error` field → error is extracted from the response
- The provider throws an exception with a `jsonrpc` field → error is extracted from the exception
- Any other thrown exception → wrapped with `UnknownError` code

***

### Difference from `request`

| Feature | `request` | `requestRaw` |
| --- | --- | --- |
| Wallet selection UI | ✅ Automatic | ❌ Manual |
| Parameter serialization | ✅ Automatic | ❌ Manual |
| Provider overrides | ✅ Automatic | ❌ None |
| Local storage caching | ✅ Optional | ❌ None |
| Error handling | ✅ `JsonRpcError` | ✅ `JsonRpcError` |

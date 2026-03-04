# isConnected

Checks whether the user is currently connected to a wallet. A user is considered connected if at least one STX or BTC address has been cached in local storage from a previous [`connect`](connect.md) or [`request`](../request/request.md) call.

***

### Usage

```ts
import { isConnected } from '@stacks/connect';

if (isConnected()) {
  console.log('Wallet is connected');
} else {
  console.log('No wallet connected');
}
```

#### Notes

- This function relies on local storage data. It will only return `true` if `enableLocalStorage` was `true` (the default) when the user connected.
- Calling [`disconnect`](disconnect.md) or [`clearLocalStorage`](../storage/clearLocalStorage.md) will cause this function to return `false`.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/storage.ts#L120)**

***

### Signature

```ts
function isConnected(): boolean
```

***

### Returns

`boolean`

Returns `true` if at least one STX or BTC address exists in the local storage cache. Returns `false` otherwise.

***

### Parameters

This function takes no parameters.

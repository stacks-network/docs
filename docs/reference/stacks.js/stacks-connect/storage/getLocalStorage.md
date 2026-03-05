# getLocalStorage

Retrieves the current Stacks Connect data from local storage. The data is stored as a hex-encoded JSON string under the `@stacks/connect` key.

***

### Usage

```ts
import { getLocalStorage } from '@stacks/connect';

const data = getLocalStorage();

if (data) {
  console.log('STX addresses:', data.addresses.stx);
  console.log('BTC addresses:', data.addresses.btc);
  console.log('Last updated:', data.updatedAt);
}
```

#### Notes

- Returns `null` if no data is stored or if reading from local storage fails.
- The stored data is hex-encoded for safety. This function handles decoding automatically.
- Data is written to local storage automatically when [`request`](../request/request.md) is called with `enableLocalStorage: true` (the default) and addresses are returned from the wallet.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/storage.ts#L96)**

***

### Signature

```ts
function getLocalStorage(): StorageData | null
```

***

### Returns

[`StorageData`](StorageData.md) `| null`

Returns the parsed storage data object, or `null` if no data exists or an error occurs.

***

### Parameters

This function takes no parameters.

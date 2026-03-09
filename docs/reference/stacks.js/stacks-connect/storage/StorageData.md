# StorageData

The shape of the data stored in local storage by Stacks Connect. This data is automatically managed when using [`request`](../request/request.md) with `enableLocalStorage: true` (the default).

***

### Definition

```ts
interface StorageData {
  addresses: {
    stx: Omit<AddressEntry, 'publicKey'>[];
    btc: Omit<AddressEntry, 'publicKey'>[];
  };
  updatedAt?: number;
  version: string;
}
```

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/storage.ts#L9)**

***

### Properties

#### addresses (required)

* **Type**: `{ stx: Omit<AddressEntry, 'publicKey'>[]; btc: Omit<AddressEntry, 'publicKey'>[] }`

An object containing two arrays of address entries: one for STX addresses and one for BTC addresses. For privacy, the `publicKey` field is stripped before storing.

Each address entry has the shape:

```ts
{
  symbol?: string;
  address: string;
}
```

***

#### updatedAt (optional)

* **Type**: `number`

A Unix timestamp (in milliseconds) indicating when the storage was last updated. Set automatically when addresses are written.

***

#### version (optional)

* **Type**: `string`

The version of the storage schema. Currently `'0.0.1'`.

***

### Related

- [`getLocalStorage`](getLocalStorage.md) — Retrieve this data from local storage.
- [`clearLocalStorage`](clearLocalStorage.md) — Clear this data from local storage.
- [`isConnected`](../connection/isConnected.md) — Check if any addresses are stored.

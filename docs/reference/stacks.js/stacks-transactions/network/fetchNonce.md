# fetchNonce

Looks up the next nonce for an address from a Stacks node.

***

### Usage

```ts
import { fetchNonce } from '@stacks/transactions';

const nonce = await fetchNonce({
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  network: 'testnet',
});

console.log(nonce); // e.g. 42n
```

#### Notes

- Returns a `bigint` representing the next nonce for the address.
- The builder functions (`makeSTXTokenTransfer`, `makeContractCall`, etc.) call this automatically when `nonce` is not provided.
- Tries the Hiro API's `/extended/v1/address/{address}/nonces` endpoint first, then falls back to the core node's `/v2/accounts/{address}` endpoint.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L99)**

***

### Signature

```ts
function fetchNonce(opts: {
  address: string;
} & NetworkClientParam): Promise<bigint>;
```

***

### Returns

`Promise<bigint>`

A promise that resolves to the next nonce for the address.

***

### Parameters

#### opts.address (required)

* **Type**: `string`

The Stacks address to look up the next nonce for.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.

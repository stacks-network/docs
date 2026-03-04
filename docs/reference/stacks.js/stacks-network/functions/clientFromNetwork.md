# clientFromNetwork

Returns the client configuration from a `StacksNetwork` object, ensuring a fetch function is always present. If the network's `client.fetch` is not set, a default fetch function is created automatically.

***

### Usage

```ts
import { clientFromNetwork, STACKS_TESTNET } from '@stacks/network';

const client = clientFromNetwork(STACKS_TESTNET);

console.log(client.baseUrl); // 'https://api.testnet.hiro.so'
console.log(typeof client.fetch); // 'function' — always defined
```

#### Notes

- This is primarily used internally by `@stacks/transactions` networking functions to ensure a fetch function is always available.
- If `network.client.fetch` is already set, it is returned as-is.
- If not set, a new default fetch function is created via `createFetchFn()` from `@stacks/common`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L107)**

***

### Signature

```ts
function clientFromNetwork(network: StacksNetwork): Required<ClientOpts>;
```

***

### Returns

`Required<ClientOpts>`

An object with both `baseUrl` and `fetch` guaranteed to be defined:

```ts
{
  baseUrl: string;
  fetch: FetchFn;
}
```

***

### Parameters

#### network (required)

* **Type**: `StacksNetwork`

The network object to extract client configuration from.

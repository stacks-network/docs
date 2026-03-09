# NetworkClientParam

A convenience type used by `@stacks/transactions` functions that accept both a network and an optional API client override. Combines `NetworkParam` with `ClientParam`.

***

### Usage

```ts
import { NetworkClientParam } from '@stacks/network';

// Functions that use NetworkClientParam accept these options:
async function myApiCall(opts: { data: string } & NetworkClientParam) {
  // opts.network — optional, defaults to mainnet
  // opts.client  — optional, overrides the network's client
}

// Pass just a network string
await myApiCall({ data: 'hello', network: 'testnet' });

// Or override the client entirely
await myApiCall({
  data: 'hello',
  client: {
    baseUrl: 'https://my-custom-node.example.com',
  },
});
```

#### Notes

- When both `network` and `client` are provided, the `client` values take precedence.
- If neither is provided, mainnet defaults are used.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L36)**

***

### Definition

```ts
type NetworkClientParam = NetworkParam & ClientParam;

interface NetworkParam {
  network?: StacksNetworkName | StacksNetwork;
}

interface ClientParam {
  client?: ClientOpts;
}

interface ClientOpts {
  baseUrl?: string;
  fetch?: FetchFn;
}
```

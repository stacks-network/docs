# createNetwork

Creates a customized `StacksNetwork` object from a base network. Supports configuring a custom API key, custom base URL, and custom fetch function. Returns a deep copy — the original network constants are never mutated.

***

### Usage

#### Basic usage

```ts
import { createNetwork } from '@stacks/network';

// From a network name string
const network = createNetwork('mainnet');

// From a network constant
import { STACKS_TESTNET } from '@stacks/network';
const network = createNetwork(STACKS_TESTNET);
```

#### With an API key

```ts
import { createNetwork } from '@stacks/network';

const network = createNetwork('testnet', 'my-hiro-api-key');
```

#### With an options object

```ts
import { createNetwork } from '@stacks/network';

const network = createNetwork({
  network: 'mainnet',
  apiKey: 'my-hiro-api-key',
});
```

#### With custom API key options

```ts
import { createNetwork } from '@stacks/network';

const network = createNetwork({
  network: 'mainnet',
  apiKey: 'my-api-key',
  host: /\.example\.com$/,       // default: /(.*)api(.*)(\.stacks\.co|\.hiro\.so)$/i
  httpHeader: 'x-custom-api-key', // default: 'x-api-key'
});
```

#### With custom client options

```ts
import { createNetwork, STACKS_TESTNET } from '@stacks/network';

const network = createNetwork({
  network: STACKS_TESTNET,
  client: {
    baseUrl: 'https://custom-api.example.com',
    fetch: customFetchFunction,
  },
});
```

#### Notes

- Always returns a deep copy of the base network — the original constants (`STACKS_MAINNET`, etc.) are never modified.
- When an `apiKey` is provided, it creates an API key middleware that attaches the key as an HTTP header to matching requests.
- The default host pattern for the API key middleware matches Hiro-hosted APIs (`*.stacks.co`, `*.hiro.so`).

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L140)**

***

### Signature

```ts
function createNetwork(network: StacksNetworkName | StacksNetwork): StacksNetwork;

function createNetwork(
  network: StacksNetworkName | StacksNetwork,
  apiKey: string
): StacksNetwork;

function createNetwork(options: {
  network: StacksNetworkName | StacksNetwork;
  client?: ClientOpts;
  apiKey?: string;
  host?: RegExp | string;
  httpHeader?: string;
}): StacksNetwork;
```

***

### Returns

`StacksNetwork`

A new `StacksNetwork` object with the specified customizations applied.

***

### Parameters

The function has three overloaded call signatures:

#### Overload 1: Network only

| Parameter | Type | Description |
| --- | --- | --- |
| `network` | `StacksNetworkName \| StacksNetwork` | The base network to clone. |

#### Overload 2: Network + API key

| Parameter | Type | Description |
| --- | --- | --- |
| `network` | `StacksNetworkName \| StacksNetwork` | The base network to clone. |
| `apiKey` | `string` | API key added as an HTTP header to matching requests. |

#### Overload 3: Options object

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `network` | `StacksNetworkName \| StacksNetwork` | Yes | The base network to clone. |
| `client` | `ClientOpts` | No | Custom client with `baseUrl` and/or `fetch`. |
| `apiKey` | `string` | No | API key for the middleware. |
| `host` | `RegExp \| string` | No | Host pattern the API key header applies to. Default: `/(.*)api(.*)(\.stacks\.co\|\.hiro\.so)$/i`. |
| `httpHeader` | `string` | No | HTTP header name for the API key. Default: `'x-api-key'`. |

# networkFromName

Returns the pre-configured `StacksNetwork` object for a given network name string. This is the primary way to convert a `StacksNetworkName` into a full network configuration.

***

### Usage

```ts
import { networkFromName } from '@stacks/network';

const mainnet = networkFromName('mainnet');
// Same as STACKS_MAINNET

const testnet = networkFromName('testnet');
// Same as STACKS_TESTNET

const devnet = networkFromName('devnet');
// Same as STACKS_DEVNET

const mocknet = networkFromName('mocknet');
// Same as STACKS_MOCKNET
```

#### Notes

- Throws an `Error` if an unknown network name is provided.
- Most `@stacks/transactions` functions call this internally when you pass a network string like `'testnet'`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L87)**

***

### Signature

```ts
function networkFromName(name: StacksNetworkName): StacksNetwork;
```

***

### Returns

`StacksNetwork`

The pre-configured network object corresponding to the given name.

***

### Parameters

#### name (required)

* **Type**: `StacksNetworkName` — `'mainnet' | 'testnet' | 'devnet' | 'mocknet'`

The network name to resolve.

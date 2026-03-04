# fetchAbi

Fetches a smart contract's ABI (Application Binary Interface) from a Stacks node.

***

### Usage

```ts
import { fetchAbi } from '@stacks/transactions';

const abi = await fetchAbi({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  network: 'testnet',
});

console.log(abi.functions);
console.log(abi.variables);
console.log(abi.maps);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L261)**

***

### Signature

```ts
function fetchAbi(opts: {
  contractAddress: string;
  contractName: string;
} & NetworkClientParam): Promise<ClarityAbi>;
```

***

### Returns

`Promise<ClarityAbi>`

A promise that resolves to the contract's ABI object, describing its functions, variables, maps, and types.

***

### Parameters

#### opts.contractAddress (required)

* **Type**: `string`

The Stacks address of the contract deployer.

#### opts.contractName (required)

* **Type**: `string`

The name of the contract.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.

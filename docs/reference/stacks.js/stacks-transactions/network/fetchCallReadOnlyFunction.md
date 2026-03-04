# fetchCallReadOnlyFunction

Calls a read-only function on a deployed smart contract. The function is executed by the node without creating a transaction on-chain.

***

### Usage

```ts
import { fetchCallReadOnlyFunction, Cl } from '@stacks/transactions';

const result = await fetchCallReadOnlyFunction({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'get-balance',
  functionArgs: [Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')],
  senderAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  network: 'testnet',
});

console.log(result); // ClarityValue — e.g. UIntCV { type: 'uint', value: 1000n }
```

#### Notes

- The function does **not** need to be defined as `read-only` in the contract — any public function can be called this way (without side effects).
- The `senderAddress` is the simulated sender for the read-only call.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L296)**

***

### Signature

```ts
function fetchCallReadOnlyFunction(opts: {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  senderAddress: string;
} & NetworkClientParam): Promise<ClarityValue>;
```

***

### Returns

`Promise<ClarityValue>`

A promise that resolves to the Clarity value returned by the function.

***

### Parameters

#### opts.contractAddress (required)

* **Type**: `string`

The Stacks address of the contract deployer.

#### opts.contractName (required)

* **Type**: `string`

The name of the contract.

#### opts.functionName (required)

* **Type**: `string`

The name of the function to call.

#### opts.functionArgs (required)

* **Type**: `ClarityValue[]`

An array of Clarity values to pass as arguments. Use the `Cl` namespace helpers to construct them.

#### opts.senderAddress (required)

* **Type**: `string`

The address of the simulated sender.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.

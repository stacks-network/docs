# fetchContractMapEntry

Fetches a data entry from a contract's map. Queries the node's `/v2/map_entry` endpoint.

***

### Usage

```ts
import { fetchContractMapEntry, Cl } from '@stacks/transactions';

const value = await fetchContractMapEntry({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  mapName: 'balances',
  mapKey: Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'),
  network: 'testnet',
});

console.log(value); // ClarityValue — e.g. SomeCV wrapping a UIntCV, or NoneCV
```

#### Notes

- Returns `NoneCV` if the map does not contain the given key, if the map does not exist, or if the contract principal does not exist.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L350)**

***

### Signature

```ts
function fetchContractMapEntry<T extends ClarityValue = ClarityValue>(opts: {
  contractAddress: string;
  contractName: string;
  mapName: string;
  mapKey: ClarityValue;
} & NetworkClientParam): Promise<T | NoneCV>;
```

***

### Returns

`Promise<T | NoneCV>`

A promise that resolves to the Clarity value stored in the map, or `NoneCV` if the key is not found.

***

### Parameters

#### opts.contractAddress (required)

* **Type**: `string`

The Stacks address of the contract deployer.

#### opts.contractName (required)

* **Type**: `string`

The name of the contract.

#### opts.mapName (required)

* **Type**: `string`

The name of the map variable in the contract.

#### opts.mapKey (required)

* **Type**: `ClarityValue`

The key to look up in the map. Use the `Cl` namespace helpers to construct it.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.

# Cl.contractPrincipal

Creates a Clarity `principal` type for a contract address. Alias for `contractPrincipalCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.contractPrincipal('ST000000000000000000002AMW42H', 'asset');
```

#### Notes

- If you have the full contract identifier string (e.g. `address.contract-name`), use `Cl.principal` instead — it auto-detects the type.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L107)**

***

### Signature

```ts
const contractPrincipal: (address: string, contractName: string) => ContractPrincipalCV;
```

***

### Returns

`ContractPrincipalCV`

A Clarity contract principal value object.

***

### Parameters

#### address (required)

* **Type**: `string`

The Stacks address that deployed the contract.

#### contractName (required)

* **Type**: `string`

The name of the contract.

# Cl.principal

Creates a Clarity `principal` type from any address string. Automatically detects whether the address is a standard principal or a contract principal (if it contains a `.`).

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

// Standard principal
Cl.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6');

// Contract principal
Cl.principal('ST000000000000000000002AMW42H.asset');
```

#### Notes

- This is the recommended way to create principal values — it auto-detects the type.
- `Cl.address` is an alias for `Cl.principal`.
- For explicit control, use `Cl.standardPrincipal` or `Cl.contractPrincipal`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L77)**

***

### Signature

```ts
function principal(address: string): StandardPrincipalCV | ContractPrincipalCV;
```

***

### Returns

`StandardPrincipalCV | ContractPrincipalCV`

A Clarity principal value object. The specific type depends on whether the input contains a `.` separator.

***

### Parameters

#### address (required)

* **Type**: `string`

A Stacks address string. If it contains a `.`, it is treated as a contract principal (`address.contract-name`). Otherwise, it is treated as a standard principal.

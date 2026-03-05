# Cl.standardPrincipal

Creates a Clarity `principal` type for a standard (non-contract) address. Alias for `standardPrincipalCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.standardPrincipal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6');
```

#### Notes

- If you want auto-detection of standard vs. contract principals, use `Cl.principal` instead.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L119)**

***

### Signature

```ts
const standardPrincipal: (address: string) => StandardPrincipalCV;
```

***

### Returns

`StandardPrincipalCV`

A Clarity standard principal value object.

***

### Parameters

#### address (required)

* **Type**: `string`

A Stacks address string.

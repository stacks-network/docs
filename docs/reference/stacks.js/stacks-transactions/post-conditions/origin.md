# Pc.origin

Entry point for building post conditions that apply to the transaction's origin (sender). Equivalent to `Pc.principal('origin')` but uses the special `origin` keyword.

***

### Usage

```ts
import { Pc } from '@stacks/transactions';

// The transaction sender will send exactly 10,000 microSTX
Pc.origin().willSendEq(10000).ustx();

// The transaction sender will send at most 5,000 of a fungible token
Pc.origin()
  .willSendLte(5000)
  .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-contract', 'token-name');
```

#### Notes

- Use `Pc.origin()` when the post condition should apply to the sender of the transaction without specifying a specific address.
- The builder chain is the same as `Pc.principal()`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/pc.ts#L60)**

***

### Signature

```ts
function origin(): PartialPcWithPrincipal;
```

***

### Returns

`PartialPcWithPrincipal`

An intermediate builder object. See `Pc.principal` for the full chain API.

# origin

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

// The transaction sender will lock at most 1 STX when staking
Pc.origin().willSendLte(1000000).ustxToLock();

// The transaction sender will not perform any gated PoX action
Pc.origin().willNotPerformPox();
```

#### Notes

* Use `Pc.origin()` when the post condition should apply to the sender of the transaction without specifying a specific address.
* `Pc.origin()` takes no arguments.
* The builder chain is the same as [`Pc.principal`](principal.md), including the staking and PoX terminals.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/pc.ts)

{% hint style="info" %}
`.ustxToLock()` and the PoX methods were added for Stacks epoch 4.0 and are available in `@stacks/transactions` 7.5.0 and later.
{% endhint %}

***

### Signature

```ts
function origin(): PartialPcWithPrincipal;
```

***

### Returns

`PartialPcWithPrincipal`

An intermediate builder object. See [`Pc.principal`](principal.md) for the full chain API.

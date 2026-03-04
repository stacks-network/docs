# Cl.ok

Creates a Clarity response `ok` type. Alias for `responseOkCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.ok(Cl.uint(100));
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L240)**

***

### Signature

```ts
const ok: (value: ClarityValue) => ResponseOkCV;
```

***

### Returns

`ResponseOkCV`

A Clarity `ok` response value object.

***

### Parameters

#### value (required)

* **Type**: `ClarityValue`

The Clarity value representing the success result.

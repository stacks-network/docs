# Cl.error

Creates a Clarity response `error` type. Alias for `responseErrorCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.error(Cl.uint(9900));
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L252)**

***

### Signature

```ts
const error: (value: ClarityValue) => ResponseErrorCV;
```

***

### Returns

`ResponseErrorCV`

A Clarity `err` response value object.

***

### Parameters

#### value (required)

* **Type**: `ClarityValue`

The Clarity value representing the error result.

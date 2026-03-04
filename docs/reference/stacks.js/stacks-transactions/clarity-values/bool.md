# Cl.bool

Creates a Clarity `bool` type, represented as a JS object. Alias for `boolCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.bool(true);  // { type: 'bool', value: true }
Cl.bool(false); // { type: 'bool', value: false }
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L39)**

***

### Signature

```ts
const bool: (value: boolean) => BooleanCV;
```

***

### Returns

`BooleanCV`

A Clarity boolean value object (`TrueCV` or `FalseCV`).

***

### Parameters

#### value (required)

* **Type**: `boolean`

The boolean value to wrap.

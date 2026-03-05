# Cl.int

Creates a Clarity `int` type (signed 128-bit integer), represented as a JS object. Alias for `intCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.int(100);
Cl.int(-100);
Cl.int(100n); // BigInt also accepted
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L51)**

***

### Signature

```ts
const int: (value: IntegerType) => IntCV;
```

***

### Returns

`IntCV`

A Clarity signed integer value object.

***

### Parameters

#### value (required)

* **Type**: `IntegerType` (`number | bigint | string`)

The signed integer value. Must fit within the Clarity 128-bit signed integer range.

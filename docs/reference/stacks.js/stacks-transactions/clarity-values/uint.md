# Cl.uint

Creates a Clarity `uint` type (unsigned 128-bit integer), represented as a JS object. Alias for `uintCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.uint(100);
Cl.uint(100n); // BigInt also accepted
Cl.uint('100'); // String also accepted
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L63)**

***

### Signature

```ts
const uint: (value: IntegerType) => UIntCV;
```

***

### Returns

`UIntCV`

A Clarity unsigned integer value object.

***

### Parameters

#### value (required)

* **Type**: `IntegerType` (`number | bigint | string`)

The unsigned integer value. Must be non-negative and fit within the Clarity 128-bit unsigned integer range.

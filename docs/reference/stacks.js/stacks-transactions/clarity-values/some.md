# Cl.some

Creates a Clarity optional `some` type, wrapping a Clarity value. Alias for `someCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.some(Cl.uint(100));
Cl.some(Cl.stringAscii('hello'));
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L228)**

***

### Signature

```ts
const some: (value: ClarityValue) => SomeCV;
```

***

### Returns

`SomeCV`

A Clarity `some` value object wrapping the provided value.

***

### Parameters

#### value (required)

* **Type**: `ClarityValue`

The Clarity value to wrap in the optional.

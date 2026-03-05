# Cl.tuple

Creates a Clarity `tuple` type from a JavaScript object. Alias for `tupleCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.tuple({
  a: Cl.uint(100),
  b: Cl.stringUtf8('hello world'),
  c: Cl.bool(true),
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L267)**

***

### Signature

```ts
const tuple: (data: Record<string, ClarityValue>) => TupleCV;
```

***

### Returns

`TupleCV`

A Clarity tuple value object.

***

### Parameters

#### data (required)

* **Type**: `Record<string, ClarityValue>`

An object mapping string keys to Clarity values. Keys must be valid Clarity names.

# Cl.stringify

Formats a Clarity value into a human-readable Clarity-style string. Useful for logging and debugging.

> **Note:** `Cl.prettyPrint` is a deprecated alias for `Cl.stringify`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.stringify(Cl.uint(100));
// 'u100'

Cl.stringify(Cl.tuple({ id: Cl.some(Cl.uint(1)) }));
// '{ id: (some u1) }'

// With indentation (2 spaces)
Cl.stringify(Cl.tuple({ id: Cl.some(Cl.uint(1)), name: Cl.stringAscii('hello') }), 2);
// '{
//   id: (some u1),
//   name: "hello"
// }'
```

#### Notes

- Tuple keys are sorted alphabetically in the output.
- The optional `space` parameter controls indentation for nested structures.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/prettyPrint.ts#L136)**

***

### Signature

```ts
function stringify(cv: ClarityValue, space?: number): string;
```

***

### Returns

`string`

A human-readable Clarity-style string representation of the value.

***

### Parameters

#### cv (required)

* **Type**: `ClarityValue`

The Clarity value to format.

#### space (optional)

* **Type**: `number`

The number of spaces to use for indentation. If omitted (or `0`), the output is compact (single line).

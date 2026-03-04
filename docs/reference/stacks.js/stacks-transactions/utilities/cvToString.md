# cvToString

Converts a Clarity value to its Clarity syntax representation as a string.

***

### Usage

```ts
import { cvToString, Cl } from '@stacks/transactions';

cvToString(Cl.uint(100));
// 'u100'

cvToString(Cl.bool(true));
// 'true'

cvToString(Cl.some(Cl.uint(100)));
// '(some u100)'

cvToString(Cl.tuple({ a: Cl.uint(1) }));
// '(tuple (a u1))'
```

#### Notes

- For human-readable output with indentation support, use `Cl.stringify` instead.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/clarityValue.ts#L41)**

***

### Signature

```ts
function cvToString(val: ClarityValue, encoding?: 'tryAscii' | 'hex'): string;
```

***

### Returns

`string`

The Clarity syntax string representation.

***

### Parameters

#### val (required)

* **Type**: `ClarityValue`

The Clarity value to convert.

#### encoding (optional)

* **Type**: `'tryAscii' | 'hex'`

For buffer values, controls how bytes are displayed. `'tryAscii'` attempts ASCII rendering, `'hex'` (default) shows hex.

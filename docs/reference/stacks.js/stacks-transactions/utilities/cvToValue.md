# cvToValue

Extracts the JavaScript value from a Clarity value object.

***

### Usage

```ts
import { cvToValue, Cl } from '@stacks/transactions';

cvToValue(Cl.uint(100));
// 100n (bigint)

cvToValue(Cl.bool(true));
// true

cvToValue(Cl.stringAscii('hello'));
// 'hello'

cvToValue(Cl.none());
// null

// With strict JSON compatibility (integers as strings)
cvToValue(Cl.uint(100), true);
// '100' (string)
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/clarityValue.ts#L86)**

***

### Signature

```ts
function cvToValue(val: ClarityValue, strictJsonCompat?: boolean): any;
```

***

### Returns

`any`

The JavaScript representation of the Clarity value. Types map as follows:

| Clarity Type | JS Type |
| --- | --- |
| `bool` | `boolean` |
| `int`, `uint` | `bigint` (or `string` if `strictJsonCompat` is `true`) |
| `buffer` | `string` (hex with `0x` prefix) |
| `none` | `null` |
| `some` | Wrapped value via `cvToJSON` |
| `ok`, `err` | Wrapped value via `cvToJSON` |
| `principal` | `string` |
| `string-ascii`, `string-utf8` | `string` |
| `list` | `any[]` |
| `tuple` | `Record<string, any>` |

***

### Parameters

#### val (required)

* **Type**: `ClarityValue`

The Clarity value to extract the JS value from.

#### strictJsonCompat (optional)

* **Type**: `boolean`

If `true`, integers are returned as strings instead of `bigint` for JSON serialization. Defaults to `false`.

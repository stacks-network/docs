# cvToJSON

Converts a Clarity value to a JSON-serializable object. Includes the type name and value, with integers represented as strings for JSON compatibility.

***

### Usage

```ts
import { cvToJSON, Cl } from '@stacks/transactions';

cvToJSON(Cl.uint(100));
// { type: 'uint', value: '100' }

cvToJSON(Cl.ok(Cl.uint(100)));
// { type: '(response uint UnknownType)', value: { type: 'uint', value: '100' }, success: true }

cvToJSON(Cl.tuple({ name: Cl.stringAscii('hello'), id: Cl.uint(1) }));
// { type: '(tuple ...)', value: { name: { type: '...', value: 'hello' }, id: { type: 'uint', value: '1' } } }
```

#### Notes

- Integers are converted to strings for JSON compatibility (unlike `cvToValue` which returns `bigint`).
- Response types include a `success` boolean property.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/clarityValue.ts#L122)**

***

### Signature

```ts
function cvToJSON(val: ClarityValue): any;
```

***

### Returns

`any`

A JSON-serializable object with `type` and `value` properties.

***

### Parameters

#### val (required)

* **Type**: `ClarityValue`

The Clarity value to convert.

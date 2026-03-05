# Cl.parse

Parses a Clarity value string syntax into a Clarity JS object. Supports all Clarity value types including primitives, sequences, and composite types.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.parse('u4');
// UIntCV { type: 'uint', value: 4n }

Cl.parse('"hello"');
// StringAsciiCV { type: 'string-ascii', value: 'hello' }

Cl.parse('(tuple (a 1) (b 2))');
// TupleCV with keys 'a' and 'b'

Cl.parse('(ok u100)');
// ResponseOkCV wrapping UIntCV

Cl.parse("'ST000000000000000000002AMW42H");
// StandardPrincipalCV
```

#### Notes

- The input must be valid Clarity syntax.
- Throws a parse error if the input cannot be parsed.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/parser.ts#L335)**

***

### Signature

```ts
function parse(clarityValueString: string): ClarityValue;
```

***

### Returns

`ClarityValue`

The parsed Clarity value object.

***

### Parameters

#### clarityValueString (required)

* **Type**: `string`

A string in Clarity value syntax (e.g. `u100`, `"hello"`, `(ok u1)`, `(tuple (a 1))`).

# Cl.serialize

Serializes a Clarity JS object to the equivalent hex-encoded representation. Alias for `serializeCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

const hex = Cl.serialize(Cl.uint(100));
// '0100000000000000000000000000000064'
```

#### Notes

- The result is a hex string (without `0x` prefix).
- Use `Cl.deserialize` to reverse this operation.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L281)**

***

### Signature

```ts
const serialize: (value: ClarityValue) => string;
```

***

### Returns

`string`

A hex-encoded string representing the serialized Clarity value.

***

### Parameters

#### value (required)

* **Type**: `ClarityValue`

The Clarity value to serialize.

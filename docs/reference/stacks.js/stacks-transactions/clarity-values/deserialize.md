# Cl.deserialize

Deserializes a hex string to the equivalent Clarity JS object. Alias for `deserializeCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

const value = Cl.deserialize('0100000000000000000000000000000064');
// UIntCV { type: 'uint', value: 100n }
```

#### Notes

- The input hex string may or may not include a `0x` prefix.
- Use `Cl.serialize` to reverse this operation.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L293)**

***

### Signature

```ts
const deserialize: (hex: string) => ClarityValue;
```

***

### Returns

`ClarityValue`

The deserialized Clarity value object.

***

### Parameters

#### hex (required)

* **Type**: `string`

A hex-encoded string representing a serialized Clarity value.

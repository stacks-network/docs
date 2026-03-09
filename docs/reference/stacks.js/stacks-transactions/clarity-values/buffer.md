# Cl.buffer

Creates a Clarity `buffer` type from a `Uint8Array`. Alias for `bufferCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.buffer(Uint8Array.from([0x01, 0x02, 0x03]));
```

#### Notes

- For convenience, use `Cl.bufferFromHex`, `Cl.bufferFromAscii`, or `Cl.bufferFromUtf8` to create buffers from strings.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L169)**

***

### Signature

```ts
const buffer: (value: Uint8Array) => BufferCV;
```

***

### Returns

`BufferCV`

A Clarity buffer value object.

***

### Parameters

#### value (required)

* **Type**: `Uint8Array`

Raw bytes to use as the buffer value.

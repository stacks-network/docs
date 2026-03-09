# Cl.bufferFromAscii

Creates a Clarity `buffer` type from an ASCII string. Converts the ASCII string to bytes and wraps it in a `BufferCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.bufferFromAscii('hello world');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L191)**

***

### Signature

```ts
const bufferFromAscii: (ascii: string) => BufferCV;
```

***

### Returns

`BufferCV`

A Clarity buffer value object.

***

### Parameters

#### ascii (required)

* **Type**: `string`

An ASCII string to convert to a buffer.

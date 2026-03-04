# Cl.bufferFromUtf8

Creates a Clarity `buffer` type from a UTF-8 string. Converts the UTF-8 string to bytes and wraps it in a `BufferCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.bufferFromUtf8('hello world');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L202)**

***

### Signature

```ts
const bufferFromUtf8: (utf8: string) => BufferCV;
```

***

### Returns

`BufferCV`

A Clarity buffer value object.

***

### Parameters

#### utf8 (required)

* **Type**: `string`

A UTF-8 string to convert to a buffer.

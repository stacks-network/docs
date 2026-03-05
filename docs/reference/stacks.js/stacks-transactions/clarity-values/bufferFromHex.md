# Cl.bufferFromHex

Creates a Clarity `buffer` type from a hex string. Converts the hex string to bytes and wraps it in a `BufferCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.bufferFromHex('a1b2c3');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L180)**

***

### Signature

```ts
const bufferFromHex: (hex: string) => BufferCV;
```

***

### Returns

`BufferCV`

A Clarity buffer value object.

***

### Parameters

#### hex (required)

* **Type**: `string`

A hex-encoded string (without `0x` prefix).

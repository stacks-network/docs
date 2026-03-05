# Cl.stringAscii

Creates a Clarity `string-ascii` type. Alias for `stringAsciiCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.stringAscii('hello world');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L145)**

***

### Signature

```ts
const stringAscii: (value: string) => StringAsciiCV;
```

***

### Returns

`StringAsciiCV`

A Clarity ASCII string value object.

***

### Parameters

#### value (required)

* **Type**: `string`

An ASCII string value.

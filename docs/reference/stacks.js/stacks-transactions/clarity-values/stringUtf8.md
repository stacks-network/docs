# Cl.stringUtf8

Creates a Clarity `string-utf8` type. Alias for `stringUtf8CV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.stringUtf8('hello world 🌍');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L157)**

***

### Signature

```ts
const stringUtf8: (value: string) => StringUtf8CV;
```

***

### Returns

`StringUtf8CV`

A Clarity UTF-8 string value object.

***

### Parameters

#### value (required)

* **Type**: `string`

A UTF-8 string value.

# isClarityName

Checks if a string is a valid Clarity name. Clarity names must start with a letter (or be a single operator character) and can contain letters, numbers, and special characters (`-`, `_`, `!`, `?`, `+`, `<`, `>`, `=`, `/`, `*`).

***

### Usage

```ts
import { isClarityName } from '@stacks/transactions';

isClarityName('my-function');    // true
isClarityName('transfer!');      // true
isClarityName('123invalid');     // false (starts with digit)
isClarityName('');               // false (empty)
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L139)**

***

### Signature

```ts
function isClarityName(name: string): boolean;
```

***

### Returns

`boolean`

`true` if the string is a valid Clarity name, `false` otherwise.

***

### Parameters

#### name (required)

* **Type**: `string`

The string to check. Must be less than 128 characters.

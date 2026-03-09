# validateStacksAddress

Validates whether a string is a valid Stacks address (c32check encoded).

***

### Usage

```ts
import { validateStacksAddress } from '@stacks/transactions';

validateStacksAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
// true

validateStacksAddress('invalid-address');
// false
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L190)**

***

### Signature

```ts
function validateStacksAddress(address: string): boolean;
```

***

### Returns

`boolean`

`true` if the address is a valid c32check-encoded Stacks address, `false` otherwise.

***

### Parameters

#### address (required)

* **Type**: `string`

The address string to validate.

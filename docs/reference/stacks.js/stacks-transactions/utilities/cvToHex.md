# cvToHex

Converts a Clarity value to a hex-encoded string with a `0x` prefix.

***

### Usage

```ts
import { cvToHex, Cl } from '@stacks/transactions';

const hex = cvToHex(Cl.uint(100));
// '0x0100000000000000000000000000000064'
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L148)**

***

### Signature

```ts
function cvToHex(cv: ClarityValue): string;
```

***

### Returns

`string`

A hex-encoded string with `0x` prefix.

***

### Parameters

#### cv (required)

* **Type**: `ClarityValue`

The Clarity value to convert.

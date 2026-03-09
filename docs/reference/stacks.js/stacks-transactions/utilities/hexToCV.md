# hexToCV

Converts a hex-encoded string to a Clarity value object. The inverse of `cvToHex`.

***

### Usage

```ts
import { hexToCV } from '@stacks/transactions';

const cv = hexToCV('0x0100000000000000000000000000000064');
// UIntCV { type: 'uint', value: 100n }

// Also works without 0x prefix
const cv2 = hexToCV('0100000000000000000000000000000064');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L157)**

***

### Signature

```ts
function hexToCV(hex: string): ClarityValue;
```

***

### Returns

`ClarityValue`

The deserialized Clarity value.

***

### Parameters

#### hex (required)

* **Type**: `string`

A hex-encoded string with or without `0x` prefix.

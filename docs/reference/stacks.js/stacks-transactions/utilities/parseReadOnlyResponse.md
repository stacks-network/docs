# parseReadOnlyResponse

Converts the response of a read-only function call into its Clarity Value. Handles the `okay`/`result` format returned by the Stacks node.

***

### Usage

```ts
import { parseReadOnlyResponse } from '@stacks/transactions';

// Typically used internally by fetchCallReadOnlyFunction,
// but can be used directly with raw node responses:
const cv = parseReadOnlyResponse({
  okay: true,
  result: '0x0100000000000000000000000000000064',
});
// UIntCV { type: 'uint', value: 100n }

// Throws if the response is not okay:
parseReadOnlyResponse({
  okay: false,
  cause: 'Runtime error',
});
// Error: 'Runtime error'
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/utils.ts#L186)**

***

### Signature

```ts
function parseReadOnlyResponse(response: ReadOnlyFunctionResponse): ClarityValue;
```

***

### Returns

`ClarityValue`

The parsed Clarity value from the response.

***

### Parameters

#### response (required)

* **Type**: `ReadOnlyFunctionResponse`

```ts
type ReadOnlyFunctionResponse =
  | { okay: true; result: string }
  | { okay: false; cause: string };
```

The response object from a read-only function call. Throws if `okay` is `false`.

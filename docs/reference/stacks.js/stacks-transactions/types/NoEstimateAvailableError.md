# NoEstimateAvailableError

Error class thrown when no fee estimate is available for a transaction, typically when the Stacks API cannot provide an estimate.

***

### Usage

```ts
import { fetchFeeEstimate, NoEstimateAvailableError } from '@stacks/transactions';

try {
  const fee = await fetchFeeEstimate(transaction);
} catch (error) {
  if (error instanceof NoEstimateAvailableError) {
    console.log('No fee estimate available — set the fee manually');
  }
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/errors.ts#L29)**

***

### Definition

```ts
class NoEstimateAvailableError extends Error {
  constructor(message?: string);
}
```

***

### Notes

- Thrown by `fetchFeeEstimate` and `fetchFeeEstimateTransaction` when the API returns a response indicating no estimate is available.
- When caught, you can fall back to a manually specified fee in the transaction options.

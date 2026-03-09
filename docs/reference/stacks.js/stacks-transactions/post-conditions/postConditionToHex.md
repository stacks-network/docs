# postConditionToHex

Converts a post condition object to a hex-encoded string.

***

### Usage

```ts
import { postConditionToHex } from '@stacks/transactions';

const hex = postConditionToHex({
  type: 'stx-postcondition',
  address: 'ST00000000000000000002Q6VF78',
  condition: 'eq',
  amount: '1000000000000000000',
});
```

#### Notes

- The inverse of `Pc.fromHex`.
- Useful for serializing post conditions for storage or transmission.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/postcondition.ts#L174)**

***

### Signature

```ts
function postConditionToHex(postcondition: PostCondition): string;
```

***

### Returns

`string`

A hex-encoded string representation of the post condition.

***

### Parameters

#### postcondition (required)

* **Type**: `PostCondition`

```ts
type PostCondition = StxPostCondition | FungiblePostCondition | NonFungiblePostCondition;
```

The post condition object to serialize.

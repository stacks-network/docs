# postConditionToHex

Converts a post condition object to a hex-encoded string.

***

### Usage

```ts
import { postConditionToHex } from '@stacks/transactions';

const hex = postConditionToHex({
  type: 'stx-postcondition',
  address: 'SP000000000000000000002Q6VF78',
  condition: 'eq',
  amount: '1000000000000000000',
});
```

#### Notes

* The inverse of [`Pc.fromHex`](fromHex.md).
* Useful for serializing post conditions for storage or transmission.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/postcondition.ts)

{% hint style="info" %}
`StakingPostCondition` and `PoxPostCondition` were added for Stacks epoch 4.0 and are available in `@stacks/transactions` 7.5.0 and later.
{% endhint %}

***

### Signature

```ts
function postConditionToHex(postcondition: PostCondition): string;
```

***

### Returns

`string`

The wire-format serialization: the same bytes the post condition occupies inside a signed transaction.

***

### Parameters

#### postcondition (required)

* **Type**: [`PostCondition`](../types/PostCondition.md)

```ts
type PostCondition =
  | StxPostCondition
  | FungiblePostCondition
  | NonFungiblePostCondition
  | StakingPostCondition
  | PoxPostCondition;
```

The post condition object to serialize.

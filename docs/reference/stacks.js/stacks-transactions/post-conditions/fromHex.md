# fromHex

Deserializes a serialized post condition hex string into a post condition object.

***

### Usage

```ts
import { Pc } from '@stacks/transactions';

const hex = '00021600000000000000000000000000000000000000000200000000000003e8';
const postCondition = Pc.fromHex(hex);
// {
//   type: 'stx-postcondition',
//   address: 'SP000000000000000000002Q6VF78',
//   condition: 'gt',
//   amount: '1000'
// }
```

#### Notes

* Useful for parsing post conditions from serialized transaction data.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/pc.ts)

***

### Signature

```ts
function fromHex(hex: string): PostCondition;
```

***

### Returns

`PostCondition`

```ts
type PostCondition =
  | StxPostCondition
  | FungiblePostCondition
  | NonFungiblePostCondition
  | StakingPostCondition
  | PoxPostCondition;
```

A deserialized post condition object.

`StakingPostCondition` and `PoxPostCondition` were added for Stacks epoch 4.0 and are available in `@stacks/transactions` 7.5.0 and later.

***

### Parameters

#### hex (required)

* **Type**: `string`

A hex-encoded serialized post condition string.

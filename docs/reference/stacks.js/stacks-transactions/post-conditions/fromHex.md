# Pc.fromHex

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

- Useful for parsing post conditions from serialized transaction data.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/pc.ts#L289)**

***

### Signature

```ts
function fromHex(hex: string): PostCondition;
```

***

### Returns

`PostCondition`

```ts
type PostCondition = StxPostCondition | FungiblePostCondition | NonFungiblePostCondition;
```

A deserialized post condition object.

***

### Parameters

#### hex (required)

* **Type**: `string`

A hex-encoded serialized post condition string.

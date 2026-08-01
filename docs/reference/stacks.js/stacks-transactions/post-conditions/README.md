# Post Conditions

Helpers for constructing and serializing transaction post conditions.

Post conditions are assertions attached to a transaction that must hold once it executes, or the whole transaction aborts. The `Pc` builder is the recommended way to construct them.

***

### Builder entry points

| Function                  | Use                                                                  |
| ------------------------- | -------------------------------------------------------------------- |
| [principal](principal.md) | Start a post condition for a specific standard or contract principal |
| [origin](origin.md)       | Start a post condition for the transaction's origin (sender)         |

### Serialization

| Function                                    | Use                                                   |
| ------------------------------------------- | ----------------------------------------------------- |
| [fromHex](fromHex.md)                       | Deserialize a hex string into a post condition object |
| [postConditionToHex](postConditionToHex.md) | Serialize a post condition object to a hex string     |

***

### Post condition types

```ts
type PostCondition =
  | StxPostCondition
  | FungiblePostCondition
  | NonFungiblePostCondition
  | StakingPostCondition
  | PoxPostCondition;
```

`StakingPostCondition` and `PoxPostCondition` were added for Stacks epoch 4.0 and are available in `@stacks/transactions` 7.5.0 and later. See [PostCondition](../types/PostCondition.md) for the shape of each, and [PostConditionType](../types/PostConditionType.md) for the wire values and the condition codes each type pairs with.

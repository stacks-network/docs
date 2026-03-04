# PostConditionMode

Enum that controls how unspecified transfers are treated in a transaction.

Post-conditions are **always** validated by nodes, regardless of the mode. `Allow` permits additional (unspecified) transfers, while `Deny` does not.

***

### Usage

```ts
import { PostConditionMode, makeContractCall } from '@stacks/transactions';

const transaction = await makeContractCall({
  // ...
  postConditionMode: PostConditionMode.Deny, // Only allow transfers specified by post-conditions
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L107)**

***

### Definition

```ts
enum PostConditionMode {
  /** Allow unspecified transfers */
  Allow = 0x01,
  /** Do not allow unspecified transfers */
  Deny = 0x02,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Allow` | `0x01` | Allows transfers not covered by post-conditions |
| `Deny` | `0x02` | Blocks any transfers not covered by post-conditions |

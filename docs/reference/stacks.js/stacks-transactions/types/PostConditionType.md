# PostConditionType

Enum representing the type of a post-condition (STX, fungible token, or non-fungible token). Used internally for serialization.

***

### Usage

```ts
import { PostConditionType } from '@stacks/transactions';

// Check post-condition type
if (pc.type === 'stx-postcondition') {
  // PostConditionType.STX
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L115)**

***

### Definition

```ts
enum PostConditionType {
  STX = 0x00,
  Fungible = 0x01,
  NonFungible = 0x02,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `STX` | `0x00` | STX token post-condition |
| `Fungible` | `0x01` | Fungible token (SIP-010) post-condition |
| `NonFungible` | `0x02` | Non-fungible token (SIP-009) post-condition |

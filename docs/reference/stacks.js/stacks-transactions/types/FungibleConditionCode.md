# FungibleConditionCode

Enum specifying the comparison type for fungible token (STX or custom FT) post-conditions.

***

### Usage

```ts
import { FungibleConditionCode } from '@stacks/transactions';

// Used internally — prefer the Pc builder's readable methods instead:
// Pc.principal('...').willSendEq(1000).ustx()  →  FungibleConditionCode.Equal
// Pc.principal('...').willSendGt(1000).ustx()   →  FungibleConditionCode.Greater
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L193)**

***

### Definition

```ts
enum FungibleConditionCode {
  Equal = 0x01,
  Greater = 0x02,
  GreaterEqual = 0x03,
  Less = 0x04,
  LessEqual = 0x05,
}
```

***

### Values

| Value | Number | Pc Builder Method | String Code |
| --- | --- | --- | --- |
| `Equal` | `0x01` | `.willSendEq()` | `'eq'` |
| `Greater` | `0x02` | `.willSendGt()` | `'gt'` |
| `GreaterEqual` | `0x03` | `.willSendGte()` | `'gte'` |
| `Less` | `0x04` | `.willSendLt()` | `'lt'` |
| `LessEqual` | `0x05` | `.willSendLte()` | `'lte'` |

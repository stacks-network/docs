# NonFungibleConditionCode

Enum specifying the comparison type for non-fungible token (NFT) post-conditions.

***

### Usage

```ts
import { NonFungibleConditionCode } from '@stacks/transactions';

// Used internally — prefer the Pc builder's readable methods instead:
// Pc.principal('...').willSendAsset().nft(...)     →  NonFungibleConditionCode.Sends
// Pc.principal('...').willNotSendAsset().nft(...)  →  NonFungibleConditionCode.DoesNotSend
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L205)**

***

### Definition

```ts
enum NonFungibleConditionCode {
  Sends = 0x10,
  DoesNotSend = 0x11,
}
```

***

### Values

| Value | Number | Pc Builder Method | String Code |
| --- | --- | --- | --- |
| `Sends` | `0x10` | `.willSendAsset()` | `'sent'` |
| `DoesNotSend` | `0x11` | `.willNotSendAsset()` | `'not-sent'` |

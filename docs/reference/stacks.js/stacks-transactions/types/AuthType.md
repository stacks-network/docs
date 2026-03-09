# AuthType

Enum specifying the sponsorship mode of a transaction.

***

### Usage

```ts
import { AuthType } from '@stacks/transactions';

// Check if a transaction is sponsored
if (transaction.auth.authType === AuthType.Sponsored) {
  console.log('Transaction is sponsored');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L127)**

***

### Definition

```ts
enum AuthType {
  /** Standard (not sponsored) — The sender will pay fees */
  Standard = 0x04,
  /** Sponsored — The sponsor will pay fees on behalf of the sender */
  Sponsored = 0x05,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Standard` | `0x04` | The transaction is not sponsored; the sender pays fees |
| `Sponsored` | `0x05` | The transaction is sponsored; the sponsor pays fees |

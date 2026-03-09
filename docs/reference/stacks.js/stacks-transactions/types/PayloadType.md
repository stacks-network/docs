# PayloadType

Enum representing the type of transaction payload. Used internally for serialization and deserialization.

***

### Usage

```ts
import { PayloadType } from '@stacks/transactions';

// Check transaction type
if (transaction.payload.payloadType === PayloadType.ContractCall) {
  console.log('This is a contract call transaction');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/constants.ts#L32)**

***

### Definition

```ts
enum PayloadType {
  TokenTransfer = 0x00,
  SmartContract = 0x01,
  VersionedSmartContract = 0x06,
  ContractCall = 0x02,
  PoisonMicroblock = 0x03,
  Coinbase = 0x04,
  CoinbaseToAltRecipient = 0x05,
  TenureChange = 0x07,
  NakamotoCoinbase = 0x08,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `TokenTransfer` | `0x00` | STX token transfer |
| `SmartContract` | `0x01` | Smart contract deployment (unversioned) |
| `VersionedSmartContract` | `0x06` | Smart contract deployment (with Clarity version) |
| `ContractCall` | `0x02` | Contract function call |
| `PoisonMicroblock` | `0x03` | Poison microblock |
| `Coinbase` | `0x04` | Coinbase |
| `CoinbaseToAltRecipient` | `0x05` | Coinbase to alternate recipient |
| `TenureChange` | `0x07` | Tenure change (Nakamoto) |
| `NakamotoCoinbase` | `0x08` | Nakamoto coinbase |

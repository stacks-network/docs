# TransactionVersion

Enum representing the transaction version byte. Used internally for serializing and deserializing transactions, ensuring transactions can't be replayed on other networks. Similar in purpose to `ChainId`.

***

### Usage

```ts
import { TransactionVersion } from '@stacks/network';

if (network.transactionVersion === TransactionVersion.Mainnet) {
  console.log('Mainnet transaction version');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/constants.ts#L35)**

***

### Definition

```ts
enum TransactionVersion {
  Mainnet = 0x00,
  Testnet = 0x80,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Mainnet` | `0x00` | Transaction version byte for mainnet |
| `Testnet` | `0x80` | Transaction version byte for testnet (also used by devnet and mocknet) |

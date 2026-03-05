# ChainId

Enum representing the chain ID, an unsigned 32-bit integer used so transactions can't be replayed on other chains. Similar in purpose to `TransactionVersion`.

***

### Usage

```ts
import { ChainId } from '@stacks/network';

if (network.chainId === ChainId.Mainnet) {
  console.log('This is a mainnet network');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/constants.ts#L5)**

***

### Definition

```ts
enum ChainId {
  Mainnet = 0x00000001,
  Testnet = 0x80000000,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Mainnet` | `0x00000001` | Stacks mainnet chain ID |
| `Testnet` | `0x80000000` | Stacks testnet chain ID (also used by devnet and mocknet) |

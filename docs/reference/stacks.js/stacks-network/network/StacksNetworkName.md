# StacksNetworkName

A string union type representing the four pre-configured Stacks network names.

***

### Usage

```ts
import { StacksNetworkName } from '@stacks/network';

function getExplorerUrl(network: StacksNetworkName): string {
  switch (network) {
    case 'mainnet':
      return 'https://explorer.hiro.so';
    case 'testnet':
      return 'https://explorer.hiro.so/?chain=testnet';
    default:
      return 'http://localhost:3999';
  }
}
```

Most `@stacks/transactions` builder functions accept `StacksNetworkName` directly for the `network` property:

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const tx = await makeSTXTokenTransfer({
  // ...
  network: 'testnet', // StacksNetworkName
});
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L77)**

***

### Definition

```ts
type StacksNetworkName = 'mainnet' | 'testnet' | 'devnet' | 'mocknet';
```

***

### Values

| Value | Description |
| --- | --- |
| `'mainnet'` | Stacks mainnet — resolves to `STACKS_MAINNET` |
| `'testnet'` | Stacks testnet — resolves to `STACKS_TESTNET` |
| `'devnet'` | Local devnet (e.g. Clarinet) — resolves to `STACKS_DEVNET` |
| `'mocknet'` | Mocknet — resolves to `STACKS_MOCKNET` |

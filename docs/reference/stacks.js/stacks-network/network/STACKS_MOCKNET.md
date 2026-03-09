# STACKS\_MOCKNET

Pre-configured `StacksNetwork` object for **mocknet**. Identical to devnet in configuration — uses `http://localhost:3999` as the default base URL.

***

### Usage

```ts
import { STACKS_MOCKNET } from '@stacks/network';

console.log(STACKS_MOCKNET.client.baseUrl);
// 'http://localhost:3999'
```

Most `@stacks/transactions` functions accept a network string directly:

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const tx = await makeSTXTokenTransfer({
  // ...
  network: 'mocknet', // equivalent to passing STACKS_MOCKNET
});
```

#### Notes

- Mocknet is a deep copy of `STACKS_DEVNET` — same chain ID, transaction version, magic bytes, address versions, and default URL.
- It exists as a separate constant so that consumers can distinguish between devnet and mocknet contexts if needed.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L70)**

***

### Definition

```ts
const STACKS_MOCKNET: StacksNetwork = {
  ...STACKS_DEVNET,
  addressVersion: { ...STACKS_DEVNET.addressVersion },
  client: { ...STACKS_DEVNET.client },
};
```

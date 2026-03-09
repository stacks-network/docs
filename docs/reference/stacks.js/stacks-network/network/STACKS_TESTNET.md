# STACKS\_TESTNET

Pre-configured `StacksNetwork` object for Stacks **testnet**. Uses the Hiro testnet API (`https://api.testnet.hiro.so`) as the default base URL.

***

### Usage

```ts
import { STACKS_TESTNET } from '@stacks/network';

console.log(STACKS_TESTNET.client.baseUrl);
// 'https://api.testnet.hiro.so'
```

Most `@stacks/transactions` functions accept a network string directly:

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const tx = await makeSTXTokenTransfer({
  // ...
  network: 'testnet', // equivalent to passing STACKS_TESTNET
});
```

#### Notes

- Addresses on testnet start with `ST` (single-sig) or `SN` (multi-sig).
- The `bootAddress` is `ST000000000000000000002AMW42H`.
- Magic bytes: `T2`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L51)**

***

### Definition

```ts
const STACKS_TESTNET: StacksNetwork = {
  chainId: ChainId.Testnet,            // 0x80000000
  transactionVersion: TransactionVersion.Testnet, // 0x80
  peerNetworkId: PeerNetworkId.Testnet, // 0xff000000
  magicBytes: 'T2',
  bootAddress: 'ST000000000000000000002AMW42H',
  addressVersion: {
    singleSig: AddressVersion.TestnetSingleSig, // 26
    multiSig: AddressVersion.TestnetMultiSig,    // 21
  },
  client: { baseUrl: 'https://api.testnet.hiro.so' },
};
```

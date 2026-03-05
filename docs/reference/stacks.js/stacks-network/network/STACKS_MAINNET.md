# STACKS\_MAINNET

Pre-configured `StacksNetwork` object for Stacks **mainnet**. Uses the Hiro mainnet API (`https://api.mainnet.hiro.so`) as the default base URL.

***

### Usage

```ts
import { STACKS_MAINNET } from '@stacks/network';

console.log(STACKS_MAINNET.client.baseUrl);
// 'https://api.mainnet.hiro.so'
```

Most `@stacks/transactions` functions accept a network string directly, making the constant optional:

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const tx = await makeSTXTokenTransfer({
  // ...
  network: 'mainnet', // equivalent to passing STACKS_MAINNET
});
```

#### Notes

- Addresses on mainnet start with `SP` (single-sig) or `SM` (multi-sig).
- The `bootAddress` is `SP000000000000000000002Q6VF78`.
- Magic bytes: `X2`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L38)**

***

### Definition

```ts
const STACKS_MAINNET: StacksNetwork = {
  chainId: ChainId.Mainnet,            // 0x00000001
  transactionVersion: TransactionVersion.Mainnet, // 0x00
  peerNetworkId: PeerNetworkId.Mainnet, // 0x17000000
  magicBytes: 'X2',
  bootAddress: 'SP000000000000000000002Q6VF78',
  addressVersion: {
    singleSig: AddressVersion.MainnetSingleSig, // 22
    multiSig: AddressVersion.MainnetMultiSig,    // 20
  },
  client: { baseUrl: 'https://api.mainnet.hiro.so' },
};
```

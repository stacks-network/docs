# StacksNetwork

The core type representing a Stacks network configuration. Contains chain identifiers, address versioning, magic bytes, and the API client configuration.

***

### Usage

```ts
import { StacksNetwork, STACKS_MAINNET } from '@stacks/network';

// Use a pre-configured network
const network: StacksNetwork = STACKS_MAINNET;

// Or create a custom network with a different API URL
const customNetwork: StacksNetwork = {
  ...STACKS_MAINNET,
  client: { baseUrl: 'https://my-custom-api.example.com' },
};
```

#### Notes

- In most cases, you can pass a string (`'mainnet'`, `'testnet'`, `'devnet'`, `'mocknet'`) instead of a full `StacksNetwork` object to `@stacks/transactions` functions.
- Use the `StacksNetwork` type directly when you need a custom API URL, a custom fetch function, or want to inspect network properties.
- The `client.fetch` property is optional — if not provided, a default fetch function is created automatically by the networking helpers.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L14)**

***

### Definition

```ts
type StacksNetwork = {
  chainId: number;
  transactionVersion: number;
  peerNetworkId: number;
  magicBytes: string;
  bootAddress: string;
  addressVersion: {
    singleSig: number;
    multiSig: number;
  };
  client: {
    baseUrl: string;
    fetch?: FetchFn;
  };
};
```

***

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `chainId` | `number` | The chain ID used for replay protection. `0x00000001` for mainnet, `0x80000000` for testnet. |
| `transactionVersion` | `number` | Transaction version byte. `0x00` for mainnet, `0x80` for testnet. |
| `peerNetworkId` | `number` | Peer network ID for P2P broadcasting. |
| `magicBytes` | `string` | Two-character magic bytes identifying the network (`X2`, `T2`, `id`). |
| `bootAddress` | `string` | The boot contract address for the network. |
| `addressVersion.singleSig` | `number` | Address version byte for single-sig addresses. |
| `addressVersion.multiSig` | `number` | Address version byte for multi-sig addresses. |
| `client.baseUrl` | `string` | The base URL for the Stacks API node. |
| `client.fetch` | `FetchFn \| undefined` | Optional custom fetch function. Created automatically if not provided. |

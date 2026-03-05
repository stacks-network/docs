# PeerNetworkId

Enum representing the peer network ID. Used for broadcasting to the P2P network and can be used to determine the parent of a subnet.

***

### Usage

```ts
import { PeerNetworkId } from '@stacks/network';

if (network.peerNetworkId === PeerNetworkId.Mainnet) {
  console.log('Connected to mainnet peer network');
}
```

#### Notes

- For mainnet/testnet, the `v2/info` response `.network_id` refers to the chain ID, not the peer network ID.
- For subnets, `.network_id` refers to the peer network ID.
- The `.parent_network_id` refers to the actual peer network ID of the parent in both cases.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/constants.ts#L15)**

***

### Definition

```ts
enum PeerNetworkId {
  Mainnet = 0x17000000,
  Testnet = 0xff000000,
}
```

***

### Values

| Value | Number | Description |
| --- | --- | --- |
| `Mainnet` | `0x17000000` | Mainnet peer network ID |
| `Testnet` | `0xff000000` | Testnet peer network ID |

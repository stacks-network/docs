# STACKS\_DEVNET

Pre-configured `StacksNetwork` object for a local **devnet** environment (e.g. Clarinet's local blockchain). Uses `http://localhost:3999` as the default base URL.

***

### Usage

```ts
import { STACKS_DEVNET } from '@stacks/network';

console.log(STACKS_DEVNET.client.baseUrl);
// 'http://localhost:3999'
```

Most `@stacks/transactions` functions accept a network string directly:

```ts
import { makeContractCall, Cl } from '@stacks/transactions';

const tx = await makeContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'my-function',
  functionArgs: [Cl.uint(1)],
  senderKey: '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601',
  network: 'devnet', // equivalent to passing STACKS_DEVNET
});
```

#### Notes

- Devnet inherits all testnet settings (chain ID, transaction version, address versions) but uses different magic bytes (`id`) and a local API URL.
- Addresses on devnet use the same format as testnet (`ST` / `SN`).

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/network/src/network.ts#L64)**

***

### Definition

```ts
const STACKS_DEVNET: StacksNetwork = {
  ...STACKS_TESTNET,
  magicBytes: 'id',
  client: { baseUrl: 'http://localhost:3999' },
};
```

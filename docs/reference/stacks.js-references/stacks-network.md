# @stacks/network

The `@stacks/network` package exports network configurations and helper functions for working with different Stacks networks.

## Installation

{% code title="Install" %}
```bash
npm install @stacks/network
```
{% endcode %}

## Network constants

### STACKS\_MAINNET

`STACKS_MAINNET` provides the mainnet network configuration.

{% code title="TypeScript" %}
```ts
import { STACKS_MAINNET } from '@stacks/network';

console.log(STACKS_MAINNET);
// {
//   chainId: 1,
//   transactionVersion: 0,
//   peerNetworkId: 385875968,
//   magicBytes: "X2",
//   bootAddress: "SP000000000000000000002Q6VF78",
//   addressVersion: {
//     singleSig: 22,
//     multiSig: 20,
//   },
//   client: {
//     baseUrl: "https://api.mainnet.hiro.so",
//   },
// }
```
{% endcode %}

### STACKS\_TESTNET

`STACKS_TESTNET` provides the testnet network configuration.

{% code title="TypeScript" %}
```ts
import { STACKS_TESTNET } from '@stacks/network';

console.log(STACKS_TESTNET.chainId); // 2147483648
```
{% endcode %}

### STACKS\_DEVNET / STACKS\_MOCKNET

`STACKS_DEVNET` provides the devnet network configuration.

{% code title="TypeScript" %}
```ts
import { STACKS_DEVNET, STACKS_MOCKNET } from '@stacks/network';

// Use in transactions
import { makeSTXTokenTransfer } from '@stacks/transactions';

const tx = await makeSTXTokenTransfer({
  network: STACKS_DEVNET, // or STACKS_MOCKNET
  // ... other options
});
```
{% endcode %}

## networkFromName

`networkFromName` returns a network configuration for a given name string.

### Signature

```ts
function networkFromName(name: 'mainnet' | 'testnet' | 'devnet' | 'mocknet'): StacksNetwork
```

### Parameters

| Name   | Type                                              | Required | Description  |
| ------ | ------------------------------------------------- | -------- | ------------ |
| `name` | `'mainnet' \| 'testnet' \| 'devnet' \| 'mocknet'` | Yes      | Network name |

### Examples

{% code title="TypeScript" %}
```ts
import { networkFromName } from '@stacks/network';

const mainnet = networkFromName('mainnet'); // Same as STACKS_MAINNET
const testnet = networkFromName('testnet'); // Same as STACKS_TESTNET
const devnet = networkFromName('devnet');   // Same as STACKS_DEVNET
const mocknet = networkFromName('mocknet'); // Same as STACKS_MOCKNET
```
{% endcode %}

### Using with transactions

{% code title="TypeScript" %}
```ts
import { networkFromName } from '@stacks/network';
import { makeContractCall } from '@stacks/transactions';

const network = networkFromName('testnet');

const tx = await makeContractCall({
  network,
  contractAddress: 'ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH',
  contractName: 'hello-world',
  functionName: 'say-hi',
  functionArgs: [],
  senderKey: privateKey
});
```
{% endcode %}

## clientFromNetwork

`clientFromNetwork` extracts the API client configuration from a network.

### Signature

```ts
function clientFromNetwork(network: StacksNetwork): Required<ClientOpts>
```

### Parameters

| Name      | Type            | Required | Description                  |
| --------- | --------------- | -------- | ---------------------------- |
| `network` | `StacksNetwork` | Yes      | Network configuration object |

### Example

{% code title="TypeScript" %}
```ts
import { clientFromNetwork, STACKS_MAINNET } from '@stacks/network';

const client = clientFromNetwork(STACKS_MAINNET);
console.log(client.baseUrl); // 'https://api.mainnet.hiro.so'

// Use with custom fetch
const customClient = {
  ...client,
  fetch: customFetchFunction
};
```
{% endcode %}

## Network configuration properties

All network constants share these properties:

| Property             | Type   | Description                           |
| -------------------- | ------ | ------------------------------------- |
| `chainId`            | number | Unique identifier for the network     |
| `transactionVersion` | number | Transaction serialization version     |
| `peerNetworkId`      | number | P2P network identifier                |
| `magicBytes`         | string | Network magic bytes for serialization |
| `bootAddress`        | string | Boot contract address                 |

## Default values

The package also exports default configuration values:

{% code title="TypeScript" %}
```ts
import { DEFAULT_CHAIN_ID, DEFAULT_TRANSACTION_VERSION } from '@stacks/network';

console.log(DEFAULT_CHAIN_ID); // 1
console.log(DEFAULT_TRANSACTION_VERSION); // 0
```
{% endcode %}

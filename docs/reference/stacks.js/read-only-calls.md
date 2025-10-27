# Read Only Calls

Read-only function calls allow you to query data from smart contracts without creating a transaction. These calls are free, instant, and don't require wallet interaction.

## Basic read-only call

Call a read-only function to get contract data without any transaction fees:

```ts
import { fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions';

const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'my-contract';
const functionName = 'get-balance';

const response = await fetchCallReadOnlyFunction({
  contractAddress,
  contractName,
  functionName,
  functionArgs: [],
  senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
});

const balance = cvToValue(response);
console.log('Balance:', balance);
```

## Passing function arguments

Most read-only functions require arguments. Use Clarity value builders to construct the appropriate types:

```ts
import {
  fetchCallReadOnlyFunction,
  principalCV,
  uintCV,
  stringUtf8CV
} from '@stacks/transactions';

const functionArgs = [
  principalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  stringUtf8CV('admin')
];

const response = await fetchCallReadOnlyFunction({
  contractAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  contractName: 'access-control',
  functionName: 'has-role',
  functionArgs,
  senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
});

const hasRole = cvToValue(response);
console.log('Has admin role:', hasRole);
```

## Handling response types

Read-only functions can return response types (ok/err). Check the response type to handle both success and error cases:

```ts
import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  ResponseOkCV,
  ResponseErrorCV
} from '@stacks/transactions';

const response = await fetchCallReadOnlyFunction({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'sip-010-token',
  functionName: 'get-token-info',
  functionArgs: [],
  senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
});

if (response.type === 'ok') {
  const tokenInfo = cvToJSON(response.value);
  console.log('Token info:', tokenInfo);
  // {
  //   name: "My Token",
  //   symbol: "MTK",
  //   decimals: 6,
  //   totalSupply: "1000000000000"
  // }
} else {
  console.error('Error:', cvToValue(response.value));
}
```

## Using custom network

Specify a custom network URL for testnet or custom node connections:

```ts
import { fetchCallReadOnlyFunction } from '@stacks/transactions';

const response = await fetchCallReadOnlyFunction({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'get-data',
  functionArgs: [],
  senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  network: 'testnet', // or custom URL like 'http://localhost:3999'
});
```

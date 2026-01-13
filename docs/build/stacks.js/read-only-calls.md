# Read Only Calls

Read-only function calls allow you to query data from smart contracts without creating a transaction. These calls are free, instant, and don't require wallet interaction.

## Basic read-only call

Call a read-only function to get contract data without any transaction fees:

```ts
import { fetchCallReadOnlyFunction, type ClarityValue, cvToString } from '@stacks/transactions';

const contractAddress = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4';
const contractName = 'sbtc-token';
const functionName = 'get-total-supply';

const response: ClarityValue = await fetchCallReadOnlyFunction({
  contractName,
  contractAddress,
  functionName,
  functionArgs: [],
  senderAddress: 'SP2W7056R74EXF6GMGYXEKP6T5NT0FPQET74HXSCS',
});

console.log(response);
// { type: 'ok', 
//   value: { type: 'uint', value: 452551588021n } 
// }
console.log(cvToString(response))
// (ok u452551588021)
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

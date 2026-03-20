---
description: Serialize and deserialize Clarity values when calling Hiro-hosted APIs.
---

# Using Clarity Values

Some API endpoints, such as read-only contract calls, expect serialized Clarity values as input and return serialized Clarity values in response. `@stacks/transactions` gives you the helpers you need to encode and decode those values cleanly.

## Example

```ts
import {
  Configuration,
  SmartContractsApiInterface,
  SmartContractsApi,
  ReadOnlyFunctionSuccessResponse,
} from '@stacks/blockchain-api-client';
import { uintCV, UIntCV, cvToHex, hexToCV, ClarityType } from '@stacks/transactions';

(async () => {
  const apiConfig: Configuration = new Configuration({
    fetchApi: fetch,
    basePath: 'https://api.testnet.hiro.so',
  });

  const contractsApi: SmartContractsApiInterface = new SmartContractsApi(apiConfig);
  const principal = 'ST000000000000000000002AMW42H';
  const rewardCycle: UIntCV = uintCV(22);

  const fnCall: ReadOnlyFunctionSuccessResponse = await contractsApi.callReadOnlyFunction({
    contractAddress: principal,
    contractName: 'pox',
    functionName: 'is-pox-active',
    readOnlyFunctionArgs: {
      sender: principal,
      arguments: [cvToHex(rewardCycle)],
    },
  });

  console.log({
    status: fnCall.okay,
    result: fnCall.result,
    representation: hexToCV(fnCall.result).type === ClarityType.BoolTrue,
  });
})().catch(console.error);
```

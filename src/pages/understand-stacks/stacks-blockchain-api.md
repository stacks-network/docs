---
title: Stacks Blockchain API
description: Interacting with the Stacks 2.0 Blockchain via API
images:
  sm: /images/pages/testnet-sm.svg
---

## Introduction

The Stacks 2.0 Blockchain API allows you to query the Stacks 2.0 blockchain and interact with smart contracts. It was built to maintain pageable materialized views of the Stacks 2.0 Blockchain.

~> This API is hosted by Hiro. Using it requires you to trust the hosted server, but provides a faster onboarding experience. You can [run your own API server](#running-an-api-server)

The RESTful JSON API can be used without any authorization. The basepath for the API is:

```bash
# for mainnet, replace `testnet` with `mainnet`
https://stacks-node-api.testnet.stacks.co/
```

-> Check out the [API references](https://blockstack.github.io/stacks-blockchain-api/) for more details

The API is comprised of two parts: the Stacks Blockchain API and the Stacks Node RPC API. The Node RPC API is exposed by every running node. Stacks Blockchain API, however, introduces additional functionality (e.g. get all transactions). It also proxies calls directly to Stacks Node RPC API.

### Stacks Node RPC API

The [stacks-node implementation](https://github.com/blockstack/stacks-blockchain/) exposes JSON RPC endpoints.

All `/v2/` routes a proxied to a Blockstack PBC-hosted Stacks Node. For a trustless architecture, you should make these requests to a self-hosted node.

### Stacks Blockchain API

All `/extended/` routes are provided by the Stacks 2.0 Blockchain API directly. They extend the Stacks Node API capabilities to make it easier to integrate with.

## Using the API

Depending on your programming environment, you might need to access the API differently.
The easiest way to start interacting with the API might be through the [Postman Collection](https://app.getpostman.com/run-collection/614feab5c108d292bffa#?env%5BStacks%20Blockchain%20API%5D=W3sia2V5Ijoic3R4X2FkZHJlc3MiLCJ2YWx1ZSI6IlNUMlRKUkhESE1ZQlE0MTdIRkIwQkRYNDMwVFFBNVBYUlg2NDk1RzFWIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJibG9ja19pZCIsInZhbHVlIjoiMHgiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6Im9mZnNldCIsInZhbHVlIjoiMCIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoibGltaXRfdHgiLCJ2YWx1ZSI6IjIwMCIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoibGltaXRfYmxvY2siLCJ2YWx1ZSI6IjMwIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ0eF9pZCIsInZhbHVlIjoiMHg1NDA5MGMxNmE3MDJiNzUzYjQzMTE0ZTg4NGJjMTlhODBhNzk2MzhmZDQ0OWE0MGY4MDY4Y2RmMDAzY2RlNmUwIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJjb250cmFjdF9pZCIsInZhbHVlIjoiU1RKVFhFSlBKUFBWRE5BOUIwNTJOU1JSQkdRQ0ZOS1ZTMTc4VkdIMS5oZWxsb193b3JsZFxuIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJidGNfYWRkcmVzcyIsInZhbHVlIjoiYWJjIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJjb250cmFjdF9hZGRyZXNzIiwidmFsdWUiOiJTVEpUWEVKUEpQUFZETkE5QjA1Mk5TUlJCR1FDRk5LVlMxNzhWR0gxIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJjb250cmFjdF9uYW1lIiwidmFsdWUiOiJoZWxsb193b3JsZCIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiY29udHJhY3RfbWFwIiwidmFsdWUiOiJzdG9yZSIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoiY29udHJhY3RfbWV0aG9kIiwidmFsdWUiOiJnZXQtdmFsdWUiLCJlbmFibGVkIjp0cnVlfV0=) or [cURL](https://curl.haxx.se/).

-> Postman allows you to [generate sample code](https://learning.postman.com/docs/sending-requests/generate-code-snippets/) for API requests for various languages and libraries

## OpenAPI spec

The API was designed using the [OpenAPI specification](https://swagger.io/specification/), making it compatible with a variety of developer tools.

Thanks to this design choice, we were able to generate parts of our Javascript client library purely from the specification file. The client generation is done using the [openapi-generator](https://github.com/OpenAPITools/openapi-generator).

-> The client generator supports a variety of languages and might be helpful if you are looking to integrate the API using a different lanugage than Javascript

## Javascript client library

A generated JS Client is available for consumption of this API. The client library enables typesafe REST and WebSocket communication. [Please review the client documentation for more details](https://blockstack.github.io/stacks-blockchain-api/client/index.html).

The client is made up of three components:

1. Generated HTTP API client
2. Typescript definitions for [Clarity values](https://docs.blockstack.org/write-smart-contracts/values)
3. WebSocket client

The following chapters will demonstrate the usage of each component.

### HTTP API client sample

It is important to note that the JS client requires setting the underlying HTTP request library that will handle HTTP communication. The example below uses the universal fetch API [`cross-fetch`](https://github.com/lquixada/cross-fetch):

```js
import fetch from 'cross-fetch';
import { Configuration AccountsApi } from '@stacks/blockchain-api-client';

(async () => {
  const apiConfig = new Configuration({
    fetchApi: fetch,
    // for mainnet, replace `testnet` with `mainnet`
    basePath: 'https://stacks-node-api.testnet.stacks.co', // defaults to http://localhost:3999
  });

  // initiate the /accounts API with the basepath and fetch library
  const accountsApi = new AccountsApi(apiConfig);

  // get transactions for a specific account
  const txs = await accountsApi.getAccountTransactions({
    principal: 'ST000000000000000000002AMW42H',
  });

  console.log(txs);

})().catch(console.error);
```

### TypeScript sample

The following sample demonstrate how generated [Typescript models](https://github.com/blockstack/stacks-blockchain-api/tree/master/client/src/generated/models) can be used to ensure typesafety:

```ts
import fetch from 'cross-fetch';
import {
  Configuration,
  AccountsApi,
  AccountsApiInterface,
  AddressBalanceResponse,
  AddressBalanceResponseStx,
} from '@stacks/blockchain-api-client';

(async () => {
  const apiConfig: Configuration = new Configuration({
    fetchApi: fetch,
    // for mainnet, replace `testnet` with `mainnet`
    basePath: 'https://stacks-node-api.testnet.stacks.co', // defaults to http://localhost:3999
  });

  const principal: string = 'ST000000000000000000002AMW42H';

  // initiate the /accounts API with the basepath and fetch library
  const accountsApi: AccountsApiInterface = new AccountsApi(apiConfig);

  // get balance for a specific account
  const balance: AddressBalanceResponse = await accountsApi.getAccountBalance({
    principal,
  });

  // get STX balance details
  const stxAmount: AddressBalanceResponseStx = balance.stx;

  console.log(stxAmount);
})().catch(console.error);
```

### WebSocket sample

The WebSocket components enabled you to subscribe to specific updates, enabling a near real-time display of updates on transactions and accounts.

```js
import { connectWebSocketClient } from '@stacks/blockchain-api-client';

const client = await connectWebSocketClient('ws://stacks-node-api.blockstack.org/');

const sub = await client.subscribeAddressTransactions(contractCall.txId, event => {
  console.log(event);
});

await sub.unsubscribe();
```

## Rate limiting

Rate limiting is only applied to [faucet requests](https://blockstack.github.io/stacks-blockchain-api/#tag/Faucets) and based on the address that tokens are requested for.

### BTC Faucet

The bitcoin faucet is limited to **5 requests per 5 minutes**.

### STX Faucet

The Stacks faucet rate limits depend on the type of request. For stacking requests, a limitation of **1 request per 2 days**. In case of regular Stacks faucet requests, the limits are set to **5 requests per 5 minutes**.

## Pagination

To make API responses more compact, lists returned by the API are paginated. For lists, the response body includes:

- `limit`: the number of list items return per response
- `offset`: the number of elements to skip (starting from 0)
- `total`: the number of all available list items
- `results`: the array of list items (length of array equals the set limit)

Here is a sample response:

```json
{
  "limit": 10,
  "offset": 0,
  "total": 101922,
  "results": [
    {
      "tx_id": "0x5e9f3933e358df6a73fec0d47ce3e1062c20812c129f5294e6f37a8d27c051d9",
      "tx_status": "success",
      "tx_type": "coinbase",
      "fee_rate": "0",
      "sender_address": "ST3WCQ6S0DFT7YHF53M8JPKGDS1N1GSSR91677XF1",
      "sponsored": false,
      "post_condition_mode": "deny",
      "block_hash": "0x58412b50266debd0c35b1a20348ad9c0f17e5525fb155a97033256c83c9e2491",
      "block_height": 3231,
      "burn_block_time": 1594230455,
      "canonical": true,
      "tx_index": 0,
      "coinbase_payload": {
        "data": "0x0000000000000000000000000000000000000000000000000000000000000000"
      }
    },
    { ... }
  ]
}
```

Using the `limit` and `offset` properties, you can paginate through the entire list by increasing the offset by the limit until you reach the total.

## Requesting proofs

Several endpoints will by default request the [MARF Merkel Proof](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-004-materialized-view.md#marf-merkle-proofs).

Provided with the proof, a client can verify the value, cumulative energy spent, and the number of confirmation for the response value provided by the API.

Requesting the proof requires more resources (computation time, response time, and response body size). To avoid the additional resources, in case verification is not required, API endpoints allow setting the request parameter: `proof=0`. The returned response object will not have any proof fields.

## Searching

The API provides a search endpoint ([`/extended/v1/search/{id}`](https://blockstack.github.io/stacks-blockchain-api/#operation/search_by_id)) that takes an identifier and responds with matching blocks, transactions, contracts, or accounts.

The search operation used by the endpoint (e.g. `FROM txs WHERE tx_id = $1 LIMIT 1`) matches hashes **equal** to the provided identifier. Fuzzy search, incomplete identifiers, or wildcards will not return any matches.

## Using Clarity values

Some endpoints, like the [read-only function contract call](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function), require input to as serialized [Clarity value](https://docs.blockstack.org/write-smart-contracts/values). Other endpoints return serialized values that need to be deserialized.

Below is an example for Clarity value usage in combination with the API.

-> The example below is for illustration only. The `@stacks/transactions` library supports typed contract calls and makes [response value utilization much simpler](/write-smart-contracts/values#utilizing-clarity-values-from-transaction-responses)

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
    // for mainnet, replace `testnet` with `mainnet`
    basePath: 'https://stacks-node-api.testnet.stacks.co', // defaults to http://localhost:3999
  });

  const contractsApi: SmartContractsApiInterface = new SmartContractsApi(apiConfig);

  const principal: string = 'ST000000000000000000002AMW42H';

  // use most recent from: https://stacks-node-api.<mainnet/testnet>.stacks.co/v2/pox
  const rewardCycle: UIntCV = uintCV(22);

  // call a read-only function
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

## Error handling

The API can respond with two different error types:

- For URLs that don't match any defined endpoint, an HTTP 404 is returned. The body lists the URL in reference (as a string)
- For invalid input values (URL/body parameters), an HTTP 500 is returned. The body is a JSON object with an `error` property. The object also includes stack trace (`stack`) and an error UUID (`errorTag`)

## Proxied Stacks Node RPC API endpoints

The Stacks 2.0 Blockchain API is centrally-hosted. However, every running Stacks node exposes an RPC API, which allows you to interact with the underlying blockchain. Instead of using a centrally-hosted API, you can directly access the RPC API of a locally-hosted Node.

-> The Stacks Blockchain API proxies to Node RPC endpoints

While the Node RPC API doesn't give the same functionality as the hosted Stacks 2.0 Blockchain API, you get similar functionality in a way that is scoped to that specific node. The RPC API includes the following endpoints:

- [POST /v2/transactions](https://blockstack.github.io/stacks-blockchain-api/#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://blockstack.github.io/stacks-blockchain-api/#operation/get_fee_transfer)
- [GET /v2/info](https://blockstack.github.io/stacks-blockchain-api/#operation/get_core_api_info)

~> If you run a local node, it exposes an HTTP server on port `20443`. The info endpoint would be `localhost:20443/v2/info`.

## Rosetta support

This API supports [v1.4.6 of the Rosetta specification](https://www.rosetta-api.org/). This industry open standard makes it simple to integrate blockchain deployment and interaction.

-> Find all Data and Construction Rosetta endpoints [here](https://blockstack.github.io/stacks-blockchain-api/#tag/Rosetta)

## Running an API server

While Hiro provides a hosted API server of the Stacks Blockchain API, anyone can spin up their own version. Please follow the instructions in this guide to start a Docker container with the API service running:

[@page-reference | inline]
| /understand-stacks/local-development

-> Once started, the API will be available on `localhost:3999`

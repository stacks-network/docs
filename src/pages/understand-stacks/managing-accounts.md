---
title: Managing accounts
description: Learn how to generate and review accounts
icon: TestnetIcon
duration: 15 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

This tutorial will walk you through the following steps:

- Generating an account
- Reviewing account info
- Reviewing account history
- Getting account balances

-> This tutorial is NodeJS-specific. If you would like to understand how to manage Stacks 2.0 accounts using a different language/framework, please [review the accounts guide](/understand-stacks/accounts).

## Requirements

You will need [NodeJS](https://nodejs.org/en/download/) `8.12.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

## Step 1: Installing libraries

First, install all the required libraries:

```bash
npm install --save @stacks/transactions @stacks/blockchain-api-client cross-fetch
```

-> The API client is generated from the [OpenAPI specification](https://github.com/blockstack/stacks-blockchain-api/blob/master/docs/openapi.yaml) ([openapi-generator](https://github.com/OpenAPITools/openapi-generator)). Many other languages and frameworks are be supported by the generator.

## Step 2: Generating an account

To get started, let's generate a new, random Stacks 2.0 private key:

```js
const { fetch } = require('cross-fetch');
const {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
} = require('@stacks/transactions');
const { AccountsApi, FaucetsApi, Configuration } = require('@stacks/blockchain-api-client');

const apiConfig = new Configuration({
  fetchApi: fetch,
  // for mainnet, replace `testnet` with `mainnet`
  basePath: 'https://stacks-node-api.testnet.stacks.co',
});

const privateKey = makeRandomPrivKey();
```

-> Note: The code above also imports methods required for the next steps, including API configuration for the client library usage.

## Step 3: Reviewing account info

With the private key, you can review account details. First, we need to derive the Stacks address from the private key. Then, we can use the `AccountsApi` class to get the account details:

```js
const stacksAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion.Testnet // remove for Mainnet addresses
);

const accounts = new AccountsApi(apiConfig);

async function getAccountInfo() {
  const accountInfo = await accounts.getAccountInfo({
    principal: stacksAddress,
  });

  return accountInfo;
}
```

-> Note: A "principal" is any entity that can have a token balance. Find more details in the [Principals guide](/write-smart-contracts/principals).

The API will respond with a balance, nonce (starting at zero), and respective proofs:

```js
{
  balance: '0x00000000000000000000000000000000',
  nonce: 0,
  balance_proof: '',
  nonce_proof: ''
}
```

The `balance` property represents the Stacks token balance, as hex-encoded string of an unsigned 128-bit integer (big-endian). It is not easy to consume the `balance` property in this format. To simplify that, and to obtain all balances for all tokens (Stacks/STX, fungible, and non-fungible), check out [step 5](#step-5-getting-account-balances).

### Disabling proofs

Proofs, provided as hex-encoded strings, can be removed from the responses by setting the `proof` parameter:

```js
async function getAccountInfoWithoutProof() {
  const accountInfo = await accounts.getAccountInfo({
    principal: stacksAddress,
    proof: 0,
  });

  return accountInfo;
}
```

## Step 4: Reviewing account history

The following step make requires associated accounts transactions. For simplicity, let's run the faucet for the new account:

```js
async function runFaucetStx() {
  const faucets = new FaucetsApi(apiConfig);

  const faucetTx = await faucets.runFaucetStx({
    address: stacksAddress,
  });

  return faucetTx;
}
```

The API will respond with a new transaction ID and confirmation that the faucet run was successful:

```js
{
  success: true,
  txId: '0x5b3d9b47c8f0a3c161868c37d94977b3b0a507558a542fd9499b597bfc799d11',
  txRaw: '80800000000400164247d6f2b425ac5771423ae6c80c754f717...'
}
```

-> Note: Wait a few minutes for the transaction to complete. You can review the status using the Explorer, by navigating to the following URL: `https://explorer.stacks.co/txid/<txid>`.

Assuming the faucet transaction was successfully processed, you can review the account history. We are expecting at least one transactions to show up in the account history.

```js
async function getAccountTransactions() {
  const history = await accounts.getAccountTransactions({
    principal: stacksAddress,
  });

  return history;
}
```

The API will respond with a paginatable list of transactions associated with the account:

```js
{
  limit: 20,
  offset: 0,
  total: 1,
  results: [
    {
      tx_id: '0x89ee63c0',
      tx_type: 'token_transfer',
      fee_rate: '180',
      sender_address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      sponsored: false,
      post_condition_mode: 'deny',
      tx_status: 'success',
      block_hash: '0x167662a4e',
      block_height: 2951,
      burn_block_time: 1598910912,
      burn_block_time_iso: '2020-08-31T21:55:12.000Z',
      canonical: true,
      tx_index: 1,
      tx_result: {"hex":"0x03","repr":"true"},
      token_transfer: {
        recipient_address:"STW617CAFYNFQG6G470DNWW4V56XAY7125S3Z6RK",
        amount:"500000",
        memo:"0x466175636574000000"
        },
      events: [{ ... }]
    }
  ]
}
```

Please review the [API reference](https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_transactions) for property definitions and details.

### Handling pagination

To make API responses more compact, lists returned by the API are paginated. For lists, the response body includes:

| Parameter | Description                                                | Default |
| --------- | ---------------------------------------------------------- | ------- |
| `limit`   | The number of list items returned                          | 20      |
| `offset`  | The number of elements skipped                             | 0       |
| `total`   | The number of all available list items                     | 0       |
| `results` | Array of list items (length of array equals the set limit) | []      |

In order to paginate throughout the full result set, we can use the `limit` and `offset` request properties. Here is an example where we request transactions 50-100 for an account:

```js
async function getAccountTransactions() {
  const history = await accounts.getAccountTransactions({
    principal: stacksAddress,
    limit: 50,
    offset: 50,
  });

  return history;
}
```

## Step 5: Getting account balances

As mentioned above, any Stacks address can have a variety of tokens and associated balances. In order to get balances for all Stacks, fungible, and non-fungible tokens, we can use the `getAccountBalance` method:

```js
async function getAccountBalance() {
  const balances = await accounts.getAccountBalance({
    principal: stacksAddress,
  });

  return balances;
}
```

The API will respond with the following breakdown of token balances:

```js
{
  stx: {
    balance: '500000',
    total_sent: '0',
    total_received: '500000'
  },
  fungible_tokens: {},
  non_fungible_tokens: {}
}
```

-> Note: The `balance` field does **not** represent full Stacks (STX) token, but micro-STX. 1,000,000 micro-STX are worth 1 Stacks (STX) token.

We can see that the current Stacks (STX) balance is `500000` micro-STX, or `0.5` Stacks (STX) token.

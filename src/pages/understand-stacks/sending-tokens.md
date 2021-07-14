---
title: Sending tokens
description: Learn how to transfer tokens
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

This tutorial walks you through the following steps:

- Specifying a sender key
- Generating a token transfer transaction
- Broadcasting the transaction to the network
- Checking transaction completion
- Confirming updates account balances (optional)

-> This tutorial is NodeJS-specific. If you would like to understand how to initiate a token transfer by constructing and broadcasting transactions using a different language/framework, please [review the transactions guide](/understand-stacks/transactions).

## Requirements

You will need [NodeJS](https://nodejs.org/en/download/) `8.12.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

You should also complete the [Managing accounts tutorial](/understand-stacks/managing-accounts). The following steps assume we have access to an existing Stacks 2.0 account.

## Step 1: Installing libraries

First, install all the required libraries:

```bash
npm install --save @stacks/transactions bn.js @stacks/blockchain-api-client cross-fetch
```

-> The API client is generated from the [OpenAPI specification](https://github.com/blockstack/stacks-blockchain-api/blob/master/docs/openapi.yaml) ([openapi-generator](https://github.com/OpenAPITools/openapi-generator)). Many other languages and frameworks are be supported by the generator.

## Step 2: Specifying a sender

In order to build and sign transactions, you will need a Stacks private key. You can easily generate a new, random Stacks 2.0 sender key (see ["Generating an account" from the previous tutorial](/understand-stacks/managing-accounts#step-2-generating-an-account)).

For this tutorial, we will use an existing Stacks account and instantiate the key object from a private key string:

```js
import fetch from 'cross-fetch';
const BN = require('bn.js');
const {
  makeSTXTokenTransfer,
  createStacksPrivateKey,
  broadcastTransaction,
  estimateTransfer,
  getNonce,
  privateKeyToString,
} = require('@stacks/transactions');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const { TransactionsApi, Configuration } = require('@stacks/blockchain-api-client');

const apiConfig = new Configuration({
  fetchApi: fetch,
  // for mainnet, replace `testnet` with `mainnet`
  basePath: 'https://stacks-node-api.testnet.stacks.co',
});

const key = 'edf9aee84d9b7abc145504dde6726c64f369d37ee34ded868fabd876c26570bc01';
const senderKey = createStacksPrivateKey(key);
```

-> Note: The code above also imports methods required for the next steps, including API configuration for the client library usage.

## Step 3: Generating transaction

To generate a token transfer transaction, we will be using the `makeSTXTokenTransfer()` transaction builder function:

```js
const recipient = 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159';

// amount of Stacks (STX) tokens to send (in micro-STX). 1,000,000 micro-STX are worth 1 Stacks (STX) token
const amount = new BN(1000000);

// skip automatic fee estimation
const fee = new BN(2000);

// skip automatic nonce lookup
const nonce = new BN(0);

// override default setting to broadcast to the Testnet network
// for mainnet, use `StacksMainnet()`
const network = new StacksTestnet();

const memo = 'hello world';

const txOptions = {
  recipient,
  amount,
  fee,
  nonce,
  senderKey: privateKeyToString(senderKey),
  network,
  memo,
};

...

const transaction = await makeSTXTokenTransfer(txOptions);
```

The generation method will need a few more pieces of information, as specified in the `txOptions` object:

| Parameter          | Description                                                                                                                      | Optional |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `recipientAddress` | The recipient Stacks address in c32check format                                                                                  | **No**   |
| `amount`           | The amount of Stacks tokens to send denominated in microstacks                                                                   | **No**   |
| `fee`              | The fee that the sender is willing to pay for miners to process the transaction. Denominated in microstacks                      | Yes      |
| `nonce`            | A nonce is an integer that needs to be incremented by 1 for each sequential transaction from the same account. Nonces start at 0 | Yes      |
| `senderKey`        | A private key object                                                                                                             | Yes      |
| `network`          | Specifies whether the transaction is meant for Stacks Mainnet or Testnet                                                         | Yes      |
| `memo`             | A memo string to attach additional information to the transaction. This data is limited to 33 bytes                              | Yes      |

### Estimating fees

If not specified, the transaction builder will automatically estimate the fee. Estimated fee rate is supplied by a Stacks node so network access is required.

-> Learn more about fees in the [network guide](/understand-stacks/network#fees)

Another way to estimate the fee is to use the `estimateTransfer()` function after you have constructed a transaction:

```js
// get fee
const feeEstimate = estimateTransfer(transaction);

// set fee manually
transaction.setFee(feeEstimate);
```

-> Note: By setting a fee in the transaction builder function, the automatic fee estimation step will be skipped.

### Handling nonces

If not specified, the transaction builder will automatically lookup the latest nonce for the sender account. Automatic nonce handling also requires network access. The nonce should be tracked locally when creating multiple sequential transactions from the same account. A Stacks node only updates the nonce once a transaction has been mined.

The updated nonce for each account can be retrieved manually using the `getNonce()` function:

```js
const senderAddress = 'SJ2FYQ8Z7JY9BWYZ5WM53SKR6CK7WHJF0691NZ942';

const senderNonce = getNonce(senderAddress);
```

## Step 4: Broadcasting transaction

Next, we will broadcast the transaction to the Testnet using the `network` object we created earlier:

```js
const txId = await broadcastTransaction(transaction, network);
```

As soon as the `broadcastTransaction` is completed, a transaction ID is returned.

~> Keep in mind that the existence of a transaction ID does not mean the transaction has been successfully processed. Please review the [transaction lifecycle](/understand-stacks/transactions#lifecycle) for more details.

### Serializing transactions

In case you would like to inspect the raw serialized transaction, you can call the `serialize()` method:

```js
const serializedTx = transaction.serialize().toString('hex');
```

## Step 5: Checking completion

With the transaction ID, we can check the status of the transaction. Every transaction needs to be confirmed by the network and will be `pending` as soon as it is broadcasted.

-> Note: A transactions is completed once it is confirmed and the status changes to `success`. Most transactions will be pending for several minutes before confirmed. You should implement polling in your app to refresh the status display.

```js
const transactions = new TransactionsApi(apiConfig);

const txInfo = await transactions.getTransactionById({
  txId,
});

console.log(txInfo);
```

The API will respond with transaction details, including the `tx_status` property:

```js
{
  tx_id: '0x5f5318',
  tx_type: 'token_transfer',
  fee_rate: '180',
  sender_address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
  sponsored: false,
  post_condition_mode: 'deny',
  tx_status: 'success',
  block_hash: '0xe9b93259',
  block_height: 2977,
  burn_block_time: 1598915954,
  burn_block_time_iso: '2020-08-31T23:19:14.000Z',
  canonical: true,
  tx_index: 1,
  tx_result: { hex: '0x03', repr: 'true' },
  token_transfer: {
    recipient_address: 'ST9SW39M98MZXBGWSDVN228NW1NWENWCF321GWMK',
    amount: '500000',
    memo: '0x4661756'
  },
  events: [ { event_index: 0, event_type: 'stx_asset', asset: [ ... ] } ]
}
```

For all property formats and details, please review the [API reference](https://blockstack.github.io/stacks-blockchain-api/#operation/get_transaction_by_id).

## Step 6: Confirming balance (optional)

Now that the token transfer is confirmed, we can verify the new account balance on the sender address by [following the "Getting account balances" steps from the previous tutorial](/understand-stacks/managing-accounts#step-5-getting-account-balances).

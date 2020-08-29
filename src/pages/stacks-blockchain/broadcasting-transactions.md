---
title: Broadcasting transactions
description: Learn how to generate and broadcast Stacks 2.0 transactions
icon: TestnetIcon
duration: 30 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

This tutorial will walk you through the following steps:

- Generating a private key
- Generating a token transfer transaction
- Broadcasting the transaction to the network

## Requirements

You will need [NodeJS](https://nodejs.org/en/download/) `8.12.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

## Step 1: Installing libraries

First install the stacks transactions library and a JavaScript [BigNum](https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic) implementation in your project using npm or yarn:

```shell

# using npm
npm install @blockstack/stacks-transactions bn.js

# using yarn
yarn add @blockstack/stacks-transactions bn.js
```

## Step 2: Generating private key

In order to build and sign transactions, you will need a Stacks private key:

```js
import { BigNum } from 'bn.js';
const {
  makeRandomPrivKey,
  makeSTXTokenTransfer,
  createStacksPrivateKey,
  broadcastTransaction,
  estimateTransfer,
  getNonce,
  StacksMainnet,
  StacksTestnet,
} = require('@blockstack/stacks-transactions');

var secretKey = makeRandomPrivKey();
```

The code above imports required methods from the packages we just installed. The method `makeRandomPrivKey()` generates a new, random private Stacks 2.0 key.

Alternatively, in case you already have a private key from an existing Stacks 2.0 wallet, you can also also instantiate the key object from an private key string:

```js
var key = 'edf9aee84d9b7abc145504dde6726c64f369d37ee34ded868fabd876c26570bc01';
var secretKey = createStacksPrivateKey(key);
```

## Step 3: Generating token transfer transaction

To generate a token transfer transaction, we will be using the `makeSTXTokenTransfer()` transaction builder function. This method will need a few more pieces of information:

| Parameter          | Description                                                                                                                      | Optional |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `recipientAddress` | The recipient Stacks address in c32check format                                                                                  |          |
| `amount`           | The amount of Stacks tokens to send denominated in microstacks                                                                   |          |
| `feeRate`          | The fee that the sender is willing to pay for miners to process the transaction. Denominated in microstacks                      | Yes      |
| `nonce`            | A nonce is an integer that needs to be incremented by 1 for each sequential transaction from the same account. Nonces start at 0 | Yes      |
| `secretKey`        | A private key object                                                                                                             | Yes      |
| `network`          | Specifies whether the transaction is meant for Stacks Mainnet or Testnet                                                         | Yes      |
| `memo`             | A memo string to attach additional information to the transaction. This data is limited to 33 bytes                              | Yes      |

Here is a sample code generating a new transaction object:

```js
var recipientAddress = 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159';

// amount of Stacks tokens to send (in microstacks). 1,000,000 microstacks are worth 1 STX token
var amount = BigNum(1000000);

// skip automatic fee estimation
var feeRate = BigNum(0);

// skip automatic nonce lookup
var nonce = BigNum(0);

// override default setting to broadcast to the Testnet network
var network = new StacksTestnet();

var memo = 'hello world';

var txOptions = {
  recipientAddress,
  amount,
  feeRate,
  nonce,
  secretKey, // generated in the previous step
  network,
  memo,
};
var transaction = makeSTXTokenTransfer(txOptions);
```

### Estimating fees

If not specified, the transaction builder will automatically estimate the fee. Estimated fee rate is supplied by a Stacks node so network access is required. The fee is calculated based on the estimate fee rate and the size of the transaction in bytes.

Another way to estimate the fee is to use the `estimateTransfer()` function after you have constructed a transaction:

```js
estimateTransfer(transaction);
```

> Note: By setting a fee in the transaction builder function, the automatic fee estimation step will be skipped.

### Handling nonces

If not specified, the transaction builder will automatically lookup the latest nonce for the sender account. Automatic nonce handling also requires network access. The nonce should be tracked locally when creating multiple sequential transactions from the same account. A Stacks node only updates the nonce once a transaction has been mined.

The updated nonce for each account can be retrieved manually using the `getNonce()` function:

```js
getNonce(senderAddress);
```

## Step 4: Broadcasting transaction

Next, we will broadcast the transaction to the Testnetm using the `network` object we created earlier:

```js
broadcastTransaction(transaction, testnet);
```

In case you would like to inspect the raw serialized transaction, you can call the `serialize()` method:

```js
var serializedTx = transaction.serialize().toString('hex');
```

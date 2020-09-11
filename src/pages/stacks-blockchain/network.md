---
title: Network
description: Guide to the Stacks 2.0 network
---

## Introduction

## Tokens

Stacks ("STX") are the native tokens on the Stacks 2.0 blockchain. The smallest fraction of a STX is one micro-STX. 1.000.000 micro-STX make one STX.

-> STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX. For display purposes, micro-STX are divided by 1.000.000 (decimal precision of 6).

## Fees

- How is the transaction fee calculated?

## Nonces

Every account carries a nonce property that indicates the number of transactions processed for the given account. Nonces are one-time codes and are by 1 with every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

-> The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.

When a new [token transfer transaction](/stacks-blockchain/transactions#stacks-token-transfer) is constructed, the most recent nonce of the account needs to fetched and set.

## Confirmations

The Stacks 2.0 network is anchored onto the bitcoin network. The time to mine a block, in order to confirm transactions, will eventually match the expected "block time" of the bitcoin network: 10 minutes.

The block time is hardcoded and will change throughout the implementation phases of the [testnet](/stacks-blockchain/testnet). The current block time can be obtained through the [`GET /extended/v1/info/network_block_times`](https://blockstack.github.io/stacks-blockchain-api/#operation/get_network_block_times) endpoint:

```shell
curl 'https://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/info/network_block_times'
```

The API will respond with the block time (in seconds) for the testnet and:

```js
{
    "testnet": {
        "target_block_time": 120
    },
    "mainnet": {
        "target_block_time": 600
    }
}
```

-> The finality of the Stacks 2.0 network matches the bitcoin network finality.

## Read-only function calls

## Block Height

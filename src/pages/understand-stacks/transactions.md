---
title: Transactions
description: Guide to Stacks 2.0 transactions
icon: TestnetIcon
images:
  large: /images/transaction-signing.svg
  sm: /images/transaction-signing.svg
---

## Introduction

Transactions are the fundamental unit of execution in the Stacks blockchain. Each transaction is originated from a [Stacks 2.0 account](/understand-stacks/accounts), and is retained in the Stacks blockchain history for eternity. This guide helps you understand Stacks 2.0 transactions.

## Lifecycle

Transactions go through phases before being finally confirmed, and available for all, on the Stacks 2.0 network.

![Transaction lifecycle](/images/tx-lifecycle.png)

- **Generate**: Transactions are assembled according to the encoding specification.
- **Validate and sign**: Transactions are validated to confirm they are well-formed. Required signatures are filled in.
- **Broadcast**: Transactions are sent to a node.
- **Register**: A miner receives transactions, verifies, and adds them to the ["mempool,"](https://academy.binance.com/en/glossary/mempool) a holding area for all the pending transactions.
- **Process**: Miners review the mempool and select transactions for the next block to be mined. Depending on the transaction type, different actions can happen during this step. For example, post-conditions could be verified for a token transfer, smart-contract defined tokens could be minted, or an attempt to call an existing smart contract method could be made.
- **Confirm**: Miners successfully mine blocks with a set of transactions. The transactions inside are successfully propagated to the network.

-> A transaction can have one of three states once it is registered: `pending`, `success`, or `failed`.

## Types

The Stacks 2.0 supports a set of different transaction types:

| **Type**          | **Value**           | **Description**                                                                                                                                                                                       |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coinbase          | `coinbase`          | The first transaction in a new block (an entity holding several transactions). Used to register for block rewards. These are not manually generated and broadcasted like other types of transactions. |
| Token transfer    | `token_transfer`    | Asset transfer from a sender to a recipient                                                                                                                                                           |
| Contract deploy   | `smart_contract`    | Contract instantiation                                                                                                                                                                                |
| Contract call     | `contract_call`     | Contract call for a public, non read-only function                                                                                                                                                    |
| Poison Microblock | `poison_microblock` | Punish leaders who intentionally equivocate about the microblocks they package                                                                                                                        |

A sample of each transaction type can be found in the [Stacks Blockchain API response definition for transactions](https://docs.hiro.so/api#operation/get_transaction_by_id).

~> Read-only contract call calls do **not** require transactions. Read more about it in the [network guide](/understand-stacks/network#read-only-function-calls).

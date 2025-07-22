# How Transactions Work

### Introduction

Transactions are the fundamental unit of execution in the Stacks blockchain. Each transaction is originated from a Stacks account, and is retained in the Stacks blockchain history for eternity. This guide helps you understand Stacks transactions.

### Lifecycle

Transactions go through phases before being finally confirmed, and available for all, on the Stacks 2.0 network.

<figure><img src="../../.gitbook/assets/image (3) (1).png" alt=""><figcaption></figcaption></figure>

* **Generate**: Transactions are assembled according to the encoding specification.
* **Validate and sign**: Transactions are validated to confirm they are well-formed. Required signatures are filled in.
* **Broadcast**: Transactions are sent to a node.
* **Register**: A miner receives transactions, verifies, and adds them to the ["mempool,"](https://academy.binance.com/en/glossary/mempool) a holding area for all the pending transactions.
* **Process**: Miners review the mempool and select transactions for the next block to be mined. Depending on the transaction type, different actions can happen during this step. For example, post-conditions could be verified for a token transfer, smart-contract defined tokens could be minted, or an attempt to call an existing smart contract method could be made.
* **Confirm**: Miners successfully propose blocks with a set of transactions. The transactions inside are successfully propagated to the network when the stackers approve them.

{% hint style="info" %}
A transaction can have one of three states once it is registered: `pending`, `success`, or `failed`.
{% endhint %}

### Types

Stacks supports a set of different transaction types:

| **Type**                  | **Value**                 | **Description**                                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenure change             | `TenureChange`            | A tenure change is an event in the existing Stacks blockchain when one miner assumes responsibility for creating new stacks blocks from another miner. A change in tenure occurs when a Stacks block is discovered from a cryptographic sortition. Carried out by stackers. |
| Tenure change block found | `TenureChange-BlockFound` | A `TenureChange-BlockFound` transaction is induced by a winning sortition. This causes the new miner to start producing blocks, and stops the current miner from producing more blocks.                                                                                     |
| Tenure change extend      | `TenureChange-Extend`     | A `TenureChange-Extend`, which is induced by Stackers, resets the current tenure's ongoing execution budget, thereby allowing the miner to continue producing blocks.                                                                                                       |
| Token transfer            | `token_transfer`          | Asset transfer from a sender to a recipient                                                                                                                                                                                                                                 |
| Contract deploy           | `smart_contract`          | Contract instantiation                                                                                                                                                                                                                                                      |
| Contract call             | `contract_call`           | Contract call for a public, non read-only function                                                                                                                                                                                                                          |

A sample of each transaction type can be found in the [Stacks Blockchain API response definition for transactions](https://docs.hiro.so/stacks/api/transactions/get-transaction).

{% hint style="info" %}
Read-only contract call calls do **not** require transactions. Read more about it in the network guide.
{% endhint %}

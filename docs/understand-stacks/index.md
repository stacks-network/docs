---
title: Understand Stacks
description: Learn more about the Stacks 2.0 blockchain
sidebar_position: 1
---

![](/img/SBC-L-2x-10.png)
## Introduction

Stacks 2.0 is a layer-1 blockchain that connects to Bitcoin and brings smart contracts and decentralized apps to it.
Smart contracts and apps developed on the Stacks platform are natively integrated with the security, stability, and economic power of Bitcoin.

## Capabilities

Read more about the features provided by the Stacks 2.0 blockchain.

<!-- markdown-link-check-disable -->

:::tip
Check out the [technical specifications](technical-specs) for a brief overview
:::


<!-- markdown-link-check-enable-->

A detailed [comparison of the Stacks blockchain to other blockchain technologies][] is available at the Stacks
Foundation blog.
### Consensus mechanism
![](/img/pages/stacking.svg)
Stacks 2.0 implements a new mining mechanism called Proof of Transfer ("PoX").
PoX is a consensus algorithm between two blockchains. It uses an established blockchain (in this case Bitcoin) to secure a new blockchain (Stacks).

PoX connects to Bitcoin with a 1:1 block ratio, meaning anything that happens on the Stacks blockchain can be verified on the Bitcoin Blockchain.

Instead of burning electricity on proof of work, PoX reuses already minted bitcoins as "proof of computation" and
miners represent their cost of mining in bitcoins directly.


[Read more about Proof of Transfer](proof-of-transfer)
### Mining

![](/img/pages/testnet-sm.svg)
Mining is required to make the network usable, trustworthy, and secure. Miners verify incoming transactions, participate in the consensus mechanism, and write new blocks to the blockchain.

To incentivize mining, miners receive freshly minted Stacks (STX) tokens if they win the bid for becoming the leader of the next round.

[Read more about Mining](mining)

### Stacking

Bitcoins used for miner bids are sent to a set of specific addresses corresponding to Stacks
(STX) tokens holders that are actively participating in consensus ("Stackers"). Thus, rather than being
destroyed, the bitcoins consumed in the mining process go to productive Stacks holders as a
reward based on their holdings of Stacks and participation in the Stacking algorithm.

Stackers have to lock up their Stacks (STX) tokens for a certain period of time.

[Read more about Stacking](stacking)

### Smart contracts

![](/img/pages/write-smart-contracts-sm.svg)
Clarity is a new language for smart contracts on the Stacks 2.0 blockchain. The Clarity smart contract language optimizes
for predictability and security.

Stacks 2.0 anchors clarity smart contracts to Bitcoin making it possible for smart contracts to operate based on actions seen on the bitcoin blockchain.

:::note
The [Clarity open-source project](https://clarity-lang.org/) is supported by Stacks and [Algorand](https://www.algorand.com/)
:::


Clarity is distinct from other languages designed for writing smart contracts in a few ways:

- **Predictability**: The Clarity language uses precise and unambiguous syntax that allows developers to predict exactly how their contracts will be executed.
- **Security**: The Clarity language allows users to supply their own conditions for transactions that ensure that a contract may never unexpectedly transfer a token owned by a user.
- **No compiler**: Contracts written in Clarity are broadcasted on the Stacks blockchain exactly as they are written by developers. This ensures that the code developers wrote, analyzed, and tested, is exactly what gets executed.

[Read more about Clarity](../write-smart-contracts/clarity-language/)

## Guides

Read one of our guides to understand the ins and outs of the Stacks 2.0 blockchain.

* [Account](../understand-stacks/accounts)
* [Transactions](../understand-stacks/transactions)
* [Network](../understand-stacks/network)
* [Microblocks](../understand-stacks/microblocks)

[comparison of the stacks blockchain to other blockchain technologies]: https://stacks.org/stacks-blockchain

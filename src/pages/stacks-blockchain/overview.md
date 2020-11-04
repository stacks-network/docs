---
title: Overview
description: Learn more about the Stacks blockchain
---

## Introduction

Stacks 2.0 is a layer 1 blockchain that enables people to register digital assets and write smart contracts. It connects to Bitcoin with a 1:1 block ratio, meaning anything that happens on the Stacks blockchain can be verified on the Bitcoin Blockchain. It implements a new mining mechanism called Proof of Transfer (PoX). PoX uses an established blockchain (in this case Bitcoin) to secure a new blockchain (Stacks).

-> The Stacks 2.0 blockchain is open-source and the code is available on GitHub: [blockstack/stacks-blockstack](https://github.com/blockstack/stacks-blockchain).

## Status

The Stacks 2.0 blockchain is in active development. While the final release ("mainnet") is in the works, you can get familiar with its features on the "testnet".

More information about the testnet:

[@page-reference | inline]
| /stacks-blockchain/testnet

=> The status of the Stacks 2.0 network can be viewed on the [status checker](/stacks-blockchain/network#health-check)

## Explorer

You can view accounts, blocks, transactions, and smart contracts broadcasted to the Stacks 2.0 blockchain using the [**Stacks 2.0 Explorer**](https://testnet-explorer.blockstack.org/).

-> The Explorer consumes the [Stacks 2.0 Blockchain API](https://blockstack.github.io/stacks-blockchain-api/). You can use this public API for programmatic access to the blockchain.

## Tutorials

[@page-reference | grid-small]
| /stacks-blockchain/managing-accounts, /stacks-blockchain/sending-tokens, /stacks-blockchain/running-testnet-node

## Features

### Clarity Smart Contracts

A [Smart Contract](https://academy.binance.com/glossary/smart-contract) is simply a program that runs on a blockchain.

Smart contracts on the Stacks 2.0 blockchain are written in a new programming language called **Clarity**. Clarity is distinct from other languages designed for writing smart contracts in a few ways:

- **Predictability**: The Clarity language uses precise and unambiguous syntax that allows developers to predict exactly how their contracts will be executed.
- **Security**: The Clarity language allows users to supply their own conditions for transactions that ensure that a contract may never unexpectedly transfer a token owned by a user.
- **No compiler**: Contracts written in Clarity are broadcasted on the blockchain exactly as they are written by developers. This ensures that the code developers wrote, analyzed, and tested, is exactly what gets executed.

-> The [Clarity open-source project](https://clarity-lang.org/) is supported by Blockstack and Algorand.

[@page-reference | inline]
| /smart-contracts/overview

### Stacks Mining

Mining is required to make the network usable, trustworthy, and secure. Miners verify incoming transactions and participate in the consensus mechanism of the Stacks 2.0 blockchain, called Proof of Transfer (PoX). To incentivize mining, miners receive freshly minted Stacks (STX) tokens.

[@page-reference | inline]
| /mining

### Proof of Transfer (PoX)

Proof of Transfer ([PoX](/stacks-blockchain/proof-of-transfer)) is a novel consensus mechanism that leverages the security and stability of Bitcoin to create a new blockchain, without modifying the Bitcoin protocol.

Stacks (STX) miners transfer Bitcoin to other Stacks (STX) holders in order to mine blocks. This BTC reward mechanism is called **Stacking**.

### Stacking

Stacks (STX) token holders can help secure the network by participating in Stacking and locking up their Stacks (STX) tokens for a certain period of time. As a reward for this commitment, Stackers receive Bitcoin that miners transfer as part of Proof of Transfer (PoX).

-> Proof of Transfer and Stacking are in active development and are coming soon

## Protocol specification

The Stacks 2.0 blockchain specification consists a set of proposals, called Stacks improvement proposals (SIPs). Each SIP describes the implementation of a part of the Stacks 2.0 blockchain. Together, all proposals contain concise technical specifications of features or standards and the rationale
behind them.

These SIPs can be found [here](https://github.com/blockstack/stacks-blockchain/blob/master/sip/).

-> See [SIP 000](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-000-stacks-improvement-proposal-process.md) for more details about the SIPs process..

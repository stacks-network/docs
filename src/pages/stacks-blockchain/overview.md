---
title: Overview
description: Learn more about the Stacks blockchain
---

## Introduction

The Stacks 2.0 blockchain connects to Bitcoin for security and enables decentralized apps and predictable smart contracts. Stacks 2.0 implements a new mining mechanism called Proof of Transfer (PoX). PoX anchors to Bitcoin security and makes it possible to reward holders of Stacks (STX) tokens, the native token of the Stacks 2.0 blockchain, with bitcoins.

-> The Stacks 2.0 blockchain is open-source and available on GitHub: [blockstack/stacks-blockstack](https://github.com/blockstack/stacks-blockchain).

## Status

The Stacks 2.0 blockchain is in active development. While the final release ("mainnet") is in the works, you can already get familiar with Stacks 2.0 capabilities on the "testnet".

For more information on the testnet, have a look at this page:

[@page-reference | inline]
| /stacks-blockchain/testnet

=> The health status of the Stacks 2.0 network can be reviewed using the [status checker](/stacks-blockchain/network#health-check)

## Explorer

You can view accounts, blocks, transactions, and smart contracts broadcasted to the Stacks 2.0 blockchain using the [**Stacks 2.0 Explorer**](https://testnet-explorer.blockstack.org/).

-> The Explorer consumes the [Stacks 2.0 Blockchain API](https://blockstack.github.io/stacks-blockchain-api/). You can use this public API for programmatic access to the blockchain.

## Tutorials

[@page-reference | grid-small]
| /stacks-blockchain/managing-accounts, /stacks-blockchain/sending-tokens, /stacks-blockchain/running-testnet-node

## Capabilities

### Clarity Smart Contracts

A [Smart Contract](https://academy.binance.com/glossary/smart-contract) is code running on the Stacks Blockchain that executes autonomously.

Smart contracts on the Stacks 2.0 blockchain are written in a new language called Clarity. This language gives developers a safe way to build complex smart contracts. It's main features are:

- **Predictability**: The Clarity language uses precise and unambiguous syntax that allows developers to predict exactly how their contracts will be executed
- **Security**: The Clarity language allows users to supply their own conditions for transactions that ensure that a contract may never unexpectedly transfer a token owned by a user
- **No compiling**: Contracts written in Clarity are broadcasted on the blockchain exactly as they are written by developers. This ensures that the code developers wrote, analyzed, and tested, is exactly what gets executed

-> The [Clarity open-source project](https://clarity-lang.org/) is supported by Blockstack and Algorand.

[@page-reference | inline]
| /smart-contracts/overview

### Stacks Mining

Mining is required to make the network trustworthy and secure, by verifying transaction information. Mining is the act of participation in the consensus mechanism of the Stacks 2.0 blockchain, called Proof of Transfer (PoX). To incentivize miners, who have to run mining software on their machine, they receive freshly minted Stacks (STX) tokens.

[@page-reference | inline]
| /mining

### Proof of Transfer (PoX)

Proof of Transfer (PoX) is a consensus mechanism that leverages the security and stability of Bitcoin to create a new blockchain, without modifying the Bitcoin protocol. With the PoX mechanism, miners use Bitcoin to secure the Stacks 2.0 network. By anchoring onto the Bitcoin network, it is practically infeasible for malicious actors to have enough computational power or ownership stake to attack the Stacks 2.0 network.

PoX makes it also possible to reward Stacks token holders with bitcoins, a feature called **Stacking**. With Stacking, Stacks (STX) token holders lock up STX tokens for a certain time. With that, they help secure the network by effectively acting as validators on the network, incentivizing honest behavior on the part of miners.

[@page-reference | inline]
| /stacks-blockchain/stacking

## Protocol specification

The Stacks 2.0 blockchain specification consists a set of proposals, called Stacks improvement proposals (SIPs). Each SIP is aimed at describing the implementation of a part of the Stacks 2.0 blockchain. Together, all proposals contain concise technical specifications of features or standards and the rationale
behind it.

You can review the [SIP folder](https://github.com/blockstack/stacks-blockchain/blob/master/sip/) to find all proposals. Reading through the SIPs will help understand the Stacks 2.0 details on a propotcol level.

-> See [SIP 000](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-000-stacks-improvement-proposal-process.md) for more details about the SIPs process..

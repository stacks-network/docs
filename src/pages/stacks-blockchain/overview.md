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

A [Smart Contract](https://academy.binance.com/glossary/smart-contract) is code running on the Stacks Blockchain that executes autonomously. Smart contracts on the Stacks 2.0 blockchain are written in Clarity, a language optimized for predictability and security.

[@page-reference | inline]
| /smart-contracts/overview

### Stacks Mining

Anyone who owns Bitcoin can be a Stacks Miner. Instead of spending energy, Stacks miners spend Bitcoin to mine a block. This mechanism is called Proof of Transfer (PoX).

[@page-reference | inline]
| /mining

### Proof of Transfer (PoX)

Proof of Transfer (PoX) is the consensus mechanism that leverages the security and stability of Bitcoin to create new
blockchains, without modifying the Bitcoin protocol. PoX makes it possible to reward network participants with Bitcoin.
An example of this is Stacking.

### Stacking

Stackers are Stacks (STX) Token holders who help secure the network by effectively acting as validators on the network, incentivizing honest behavior on the part of miners. Stackers have to lock up Stacks (STX) for a certain period of time. As a reward, Stackers receive the Bitcoin that miners transfer as part of Proof of Transfer (PoX).

-> Proof of Transfer and Stacking are in active development and are coming soon

## Protocol specification

Stacks improvement proposals (SIPs) are aimed at describing the implementation of the Stacks blockchain, as well as
proposing improvements. They should contain concise technical specifications of features or standards and the rationale
behind it. SIPs are intended to be the primary medium for proposing new features, for collecting community input on a
system-wide issue, and for documenting design decisions.

-> See [SIP 000](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-000-stacks-improvement-proposal-process.md) for more details about the SIPs process. For an in-depth understanding of the proposals, have a look at the [SIP folder](https://github.com/blockstack/stacks-blockchain/blob/master/sip/).

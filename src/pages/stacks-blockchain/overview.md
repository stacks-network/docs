---
title: Overview
description: Learn more about the Stacks blockchain
---

## Introduction

Stacks 2.0 is an open-membership replicated state machine produced by the coordination of a non-enumerable set of peers.

To unpack this definition:

_A replicated state machine_ is two or more copies ("replicas") of a given set of rules (a "machine") that, in processing
a common input (such as the same sequence of transactions), will arrive at the same configuration ("state"). Bitcoin
is a replicated state machine — its state is the set of UTXOs, which each peer has a full copy of, and given a block,
all peers will independently calculate the same new unspent output (UTXO) set from the existing one.

_Open-membership_ means that any host on the Internet can join the blockchain and independently calculate the same full
replica as all other peers.

_Non-enumerable_ means that the set of peers that are producing the blocks don’t know about one another — they don’t know
their identities, or even how many exist and are online. They are indistinguishable.

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

-> Proof of Transfer and Stacking are in active development and are coming soon

Proof of Transfer (PoX) is a consensus mechanism that leverages the security and stability of Bitcoin to create a new blockchain, without modifying the Bitcoin protocol. With the PoX mechanism, miners use Bitcoin to secure the Stacks 2.0 network. By anchoring onto the Bitcoin network, it is practically infeasible for malicious actors to have enough computational power or ownership stake to attack the Stacks 2.0 network.

PoX makes it also possible to reward Stacks token holders with bitcoins, a feature called **Stacking**.

[@page-reference | inline]
| /stacks-blockchain/stacking

Stackers are Stacks (STX) Token holders who help secure the network by effectively acting as validators on the network, incentivizing honest behavior on the part of miners. Stackers have to lock up STX for a certain period of time. As a reward, Stackers receive the Bitcoin that miners transfer as part of Proof of Transfer (PoX).

## Protocol specification

Stacks improvement proposals (SIPs) are aimed at describing the implementation of the Stacks blockchain, as well as
proposing improvements. They should contain concise technical specifications of features or standards and the rationale
behind it. SIPs are intended to be the primary medium for proposing new features, for collecting community input on a
system-wide issue, and for documenting design decisions.

-> See [SIP 000](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-000-stacks-improvement-proposal-process.md) for more details about the SIPs process.

| **Proposal**                                                                                                   | **Description**                                     |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [SIP 001](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-001-burn-election.md)            | Burn Election                                       |
| [SIP 002](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-002-smart-contract-language.md)  | Clarity, a language for predictable smart contracts |
| [SIP 003](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-003-peer-network.md)             | Peer Network                                        |
| [SIP 004](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-004-materialized-view.md)        | Cryptographic Commitment to Materialized Views      |
| [SIP 005](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md)  | Blocks, Transactions, and Accounts                  |
| SIP 006                                                                                                        | Clarity Execution Cost Assessment _(Q4 2020)_       |
| [SIP 007](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-007-stacking-consensus.md)       | Stacking Consensus                                  |
| [SIP 008](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-008-analysis-cost-assessment.md) | Clarity Parsing and Analysis Cost Assessment        |

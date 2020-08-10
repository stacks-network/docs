---
title: Overview
description: Help build the user owned internet by testing the latest builds for Stacks nodes, Stacks mining, Clarity smart contracts, and more.
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

## Roadmap

Stacks improvement proposals (SIPs) are aimed at describing the implementation of the Stacks blockchain, as well as
proposing improvements. They should contain concise technical specifications of features or standards and the rationale
behind it. SIPs are intended to be the primary medium for proposing new features, for collecting community input on a
system-wide issue, and for documenting design decisions.

-> See [SIP 000](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-000-stacks-improvement-proposal-process.md) for more details about the SIPs process.

- ✅ [SIP 001:](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-001-burn-election.md) Burn Election
- ✅ [SIP 002:](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-002-smart-contract-language.md) Clarity, a language for predictable smart contracts
- ✅ [SIP 003:](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-003-peer-network.md) Peer Network
- ✅ [SIP 004:](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-004-materialized-view.md) Cryptographic Committment to Materialized Views
- ✅ [SIP 005:](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md) Blocks, Transactions, and Accounts
- [ ] SIP 006: Clarity Execution Cost Assessment _(Q2 2020)_
- [ ] SIP 007: Stacking Consensus _(Q2 2020)_

## Testnet phases

- ✅ **Helium** is a developer local setup, mono-node, assembling SIP 001, SIP 002, SIP 004 and SIP 005. With this version, developers can not only run Stacks 2.0 on their development machines, but also write, execute, and test smart contracts. See the instructions below for more details.
- [ ] **Neon** is the upcoming version of our public testnet, that we're anticipating will ship in Q2 2020. This testnet will ship with SIP 003, and will be an open-membership public network, where participants will be able to validate and participate in mining testnet blocks.
- [ ] **Mainnet** is the fully functional version, that we're intending to ship in Q3 2020.

## Features

✅ Live features&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" disabled /> Upcoming

|                                                                                                                                              | Phase 1 | **Phase 2** | Phase 3                            | Phase 4                            |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- | ---------------------------------- | ---------------------------------- |
| [Simple Proof of Transfer mining](https://github.com/blockstack/stacks-blockchain)                                                           | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Send and receive STX](https://github.com/blockstack/cli-blockstack)                                                                         | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Deploy Clarity contracts](/smart-contracts/overview)                                                             | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [New Stacks Explorer](https://testnet-explorer.blockstack.org/)                                                                              |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [stacks-transactions-js](https://github.com/blockstack/stacks-transactions-js)                                                               |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Transaction signing](https://blog.blockstack.org/build-apps-that-sign-transactions-with-clarity-smart-contracts-on-the-stacks-2-0-testnet/) |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Proof of Transfer mining                                                                                                                     |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Stacking                                                                                                                                     |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| New Stacks Wallet                                                                                                                            |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Testing upgrade to Stacks 2.0                                                                                                                |         |             |                                    | <input type="checkbox" disabled /> |
| Integration with Bitcoin testnet                                                                                                             |         |             |                                    | <input type="checkbox" disabled /> |

## Stacks 2.0 features

### Clarity Smart Contracts

A Smart Contract is code running on the Stacks Blockchain that executes autonomously. When your Smart Contract has no
room for errors, Clarity is here to help. Clarity is the safest language for writing Smart Contracts, optimized for
predictability and security.

[@page-reference | inline]
| /smart-contracts/overview

### STX Mining

Anyone can be a Stacks Miner. There are no special hardware or software requirements, all you need is Bitcoin. Instead
of spending energy, Stacks miners transfer Bitcoin to holders of Stacks Token (STX) to mine a block. This mechanism is
called Proof of Transfer (PoX).

[@page-reference | inline]
| /mining

### Proof of Transfer (PoX)

Proof of Transfer (PoX) is the consensus mechanism that leverages the security and stability of Bitcoin to create new
blockchains, without modifying the Bitcoin protocol. PoX makes it possible to reward network participants with Bitcoin.
An example of this is Stacking.

### Stacking

Stackers are Stacks (STX) Token holders who provide a valuable service to the network by locking up their STX for a certain
period of time. As a reward, Stackers receive the Bitcoin that miners transfer as part of Proof of Transfer (PoX).

-> Proof of Transfer and Stacking are in active development and are coming soon

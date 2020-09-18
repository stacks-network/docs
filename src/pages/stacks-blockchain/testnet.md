---
title: Testnet
description: Learn about testnet phases, timelines, and features
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

The Stacks 2.0 testnet is an altenrative blockchain, to be used for testing. It is intended for developer experimentation and not built for production-ready integrations. The testnet is frequently reset and Stacks tokens, used as fees for operations on the testnet, can be obtained for free using a [faucet](https://www.blockstack.org/testnet/faucet).

With the completion of the Stacks 2.0 blockchain, a production-ready, stable version will be released as "mainnet". While work for the mainnet is in progress, the testnet reflects the most recent implementation of the Stacks 2.0 blockchain.

## Release phases

The work towards mainnet is split up into four sequential phases:

- ✅ **Phase 1:** is a developer local setup, mono-node, assembling SIP 001, SIP 002, SIP 004 and SIP 005. With this version, developers can not only run Stacks 2.0 on their development machines, but also write, execute, and test smart contracts.
- ✅ **Phase 2:** is the current version of our public testnet. This testnet includes SIP 003, and will be an open-membership public network, where participants will be able to validate and participate in mining testnet blocks.
- [ ] **Phase 3:** is the upcoming version that we're anticipating to ship in Q3 2020. This version focus on the PoX basics (miner get rewards, Stackers get BTC distributions, etc).
- [ ] **Phase 4** is the fully functional version, that we're intending to ship in Q4 2020.

## Roadmap

Each phase add capabilities to the Stacks 2.0 blockchain:

|                                                                                                                                              | Phase 1 | **Phase 2** | Phase 3                            | Phase 4                            |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- | ---------------------------------- | ---------------------------------- |
| [Simple Proof of Transfer mining](https://github.com/blockstack/stacks-blockchain)                                                           | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Send and receive Stacks](https://github.com/blockstack/cli-blockstack)                                                                      | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Deploy Clarity contracts](/smart-contracts/overview)                                                                                        | ✅      | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [New Stacks Explorer](https://testnet-explorer.blockstack.org/)                                                                              |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [stacks-transactions-js](https://github.com/blockstack/stacks-transactions-js)                                                               |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| [Transaction signing](https://blog.blockstack.org/build-apps-that-sign-transactions-with-clarity-smart-contracts-on-the-stacks-2-0-testnet/) |         | ✅          | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Proof of Transfer mining                                                                                                                     |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Stacking                                                                                                                                     |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| New Stacks Wallet                                                                                                                            |         |             | <input type="checkbox" disabled /> | <input type="checkbox" disabled /> |
| Testing upgrade to Stacks 2.0                                                                                                                |         |             |                                    | <input type="checkbox" disabled /> |
| Integration with Bitcoin testnet                                                                                                             |         |             |                                    | <input type="checkbox" disabled /> |

✅ Released features&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" disabled /> Upcoming

---
title: Clarity overview
description: Overview and guides for getting started with Clarity
images:
  large: /images/contract.svg
  sm: /images/contract.svg
---

## Introduction

Clarity is a programming language for writing smart contracts on the Stacks 2.0 blockchain. It supports programmatic
control over digital assets.

## Smart contracts

Smart contracts encode and enforce rules for modifying a particular set of data that is shared among people and entities
who don't necessarily trust each other. For example, a smart contract can hold funds in escrow until multiple parties
agree to release them, create its own ledger and keep track of its own novel tokens (fungible or non-fungible), and
even help make supply chains more transparent.

Because smart contracts are programs that exist in a blockchain, anyone can query them, and anyone can submit transactions
to execute them. A smart contract execution can result in new transactions being written to the blockchain.

Apps can take advantage of smart contracts to manage a global state that is visible to the public. Anyone can audit the
blockchain to independently verify that an app's global shared state has been managed correctly according to the smart contract's rules.

There is a [Clarity Visual Studio Code plugin][] available for syntax assistance and debugging.

## Use cases

Not every decentralized application requires smart contracts, but Clarity unlocks interesting capabilities for
decentralized applications. Examples of use cases include, but are not limited to:

- Access control (for example pay to access)
- Non-fungible (for example collectibles) and fungible tokens (for example stablecoins)
- Business model templates (for example subscriptions)
- App-specific blockchains
- Decentralized Autonomous Organizations

## Language design

Clarity differs from most other smart contract languages in two essential ways:

- The language is interpreted and broadcast on the blockchain as is (not compiled)
- The language is decidable (not Turing complete)

Using an interpreted language ensures that the executed code is human-readable and auditable. A decidable language
like Clarity makes it possible to determine precisely which code is executed, for any function.

A Clarity smart contract consists of two parts, a data space and a set of functions. Only the associated
smart contract may modify its corresponding data space on the blockchain. Functions may be private and thus callable
only from within the smart contract, or public and thus callable from other contracts. Users call smart contracts'
public functions by broadcasting a transaction on the blockchain which invokes the public function. Contracts
can also call public functions from other smart contracts.

Note some of the key Clarity language rules and limitations.

- The only primitive types are booleans, integers, buffers, and principals.
- Recursion is illegal and there are no anonymous functions.
- Looping is only performed via `map`, `filter`, or `fold`.
- There is support for lists, however, the only variable length lists in the language appear as function inputs; there is no support for list operations like append or join.
- Variables are immutable.

## Explore more

For language details and references, see the following:

[@page-reference | grid]
| /write-smart-contracts/principals, /write-smart-contracts/values, /references/language-overview

[clarity visual studio code plugin]: https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp

---
title: Write smart contracts
description: Overview and guides for getting started with Clarity
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
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
blockchain in order to independently verify that an app's global shared state has been managed correctly according to the smart contract's rules.

## Use cases

Not every decentralized application requires smart contracts, but Clarity unlocks interesting capabilities for
decentralized applications. Examples of use cases include, but are not limited to:

- Access control (e.g. pay to access)
- Non-fungible (e.g. collectibles) and fungible tokens (e.g. stablecoins)
- Business model templates (e.g. subscriptions)
- App-specific blockchains
- Decentralized Autonomous Organizations

## Language design

Clarity differs from most other smart contract languages in two essential ways:

- The language is interpreted and broadcast on the blockchain as is (not compiled)
- The language is decidable (not Turing complete)

Using an interpreted language ensures that the executed code is human-readable and auditable. A decidable language
like Clarity makes it possible to determine precisely which code is going to be executed, for any function.

A Clarity smart contract is composed of two parts &mdash; a data space and a set of functions. Only the associated
smart contract may modify its corresponding data space on the blockchain. Functions may be private and thus callable
only from within the smart contract, or public and thus callable from other contracts. Users call smart contracts'
public functions by broadcasting a transaction on the blockchain which invokes the public function. Contracts
can also call public functions from other smart contracts.

Note some of the key Clarity language rules and limitations.

- The only primitive types are booleans, integers, buffers, and principals.
- Recursion is illegal and there are no anonymous functions.
- Looping may only be performed via `map`, `filter`, or `fold`.
- There is support for lists, however, the only variable length lists in the language appear as function inputs; there is no support for list operations like append or join.
- Variables are immutable.

## Learning Clarity

The tutorials are ordered from "beginner" to "advanced." Start with the [Hello World tutorial](/write-smart-contracts/hello-world-tutorial),
then learn how to construct [a counter](/write-smart-contracts/counter-tutorial), and finally, learn how to
[test your smart contracts](/write-smart-contracts/testing-contracts) using Mocha.

Once you've got the hang of the general workflow, environment, and language syntax, you should be ready to start writing
contracts, referring to the [Clarity language reference](/references/language-overview) as you go.

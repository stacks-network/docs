---
layout: smart
description: "Blockstack Clarity: Introduction"
permalink: /:collection/:path.html
---
# Introduction to Clarity
{:.no_toc}

Clarity is a smart contracting language for use with the Stacks 2.0 blockchain. It supports programmatic control over digital assets.

* TOC
{:toc}

## Smart contracts

Smart contracts encode and enforce the rules for modifying a particular set of data as shared among people and entities who don't necessarily trust each other. For example, a smart contract could allow creators to add a new tv show to a streaming service, but require that users first pay for a decryption key before viewing it. To do this, the smart contract could be written such that the movie creator had to publicly disclose the decryption key in order to receive payment. The movie creators would therefore be incentivized to work on tv show episodes that people want to watch, based on the viewers' upfront payments that are locked-in until the creator releases the episode and the decryption key.

Because smart contracts run on top of a blockchain, anyone can query them, and anyone can submit transactions to execute them. A smart contract execution can result in new transactions being written to the blockchain.

Apps use the blockchain to manage a global state that is visible to the public. To get back to the streaming service example, the global state could include a list of user that paid for a specific tv show episode. This is possible because the blockchain stores the history of all accepted transactions.

Anyone can audit the blockchain in order to independently verify that an app's global shared state has been managed correctly according to the smart contract's rules.

## Use cases

Not every decentralized application requires smart contracts, but Clarity unlocks interesting capabilities for decentralized applications. Examples of use cases include, but are not limited to:

* Access control (e.g. pay to access)
* Non-fungible (e.g. collectibles) and fungible tokens (e.g. stablecoins)
* Business model templates (e.g. subscriptions)
* App-specific blockchains
* Decentralized Autonomous Organizations

## Language design

Clarity differs from most other smart contract languages in two essential ways:

* The language is interpreted and broadcasted on the blockchain as is (not compiled)
* The language is decidable (not Turing complete)
  
Using an interpreted language ensures that the executed code is human-readable and auditable. A decidable language like Clarity makes it possible to determine precisely which code is going to be executed, for any function.

A Clarity smart contract is composed of two parts &mdash; a data space and a set of functions. Only the associated smart contract may modify its corresponding data space on the blockchain. Functions may be private and thus callable only from within the smart contract, or public and thus callable from other contracts. Users call smart contracts' public functions by broadcasting a transaction on the blockchain which invokes the public function. Contracts can also call public functions from other smart contracts.

Note some of the key Clarity language rules and limitations.

* The only atomic types are booleans, integers, fixed length buffers, and principals
* Recursion is illegal and there is no lambda function.
* Looping may only be performed via `map`, `filter`, or `fold`
* There is support for lists of the atomic types, however, the only variable length lists in the language appear as function inputs; There is no support for list operations like append or join.
* Variables are created via `let` binding and there is no support for mutating functions like `set`.

## Learning Clarity

You can try a [Hello World tutorial](tutorial.html) or jump right into the [language reference](clarityRef.html).
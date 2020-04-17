---
layout: core
description: "Blockstack Clarity: Introduction"
permalink: /:collection/:path.html
---
# Introduction to Clarity
{:.no_toc}

Clarity is a smart contracting language for use with the Stacks 2.0 blockchain. It supports programmatic control over digital assets.

* TOC
{:toc}

## Smart contracts

Smart contracts are programs that run on a blockchain. In Blockstack, the main use-case for smart contracts is to manage _global shared state_ for an app. This is data that is collectively owned and curated by all of an app's users. For example, the list of all subreddits is global shared state in Reddit. As another example, the catalog of movies is global shared state in YouTube. Every user can see and use this data when the use the app, and every user can propose changes to this data, but the data itself belongs to everyone.

Smart contracts encode and enforce the rules for curating this data, and are often used to ensure that users can exchange valuable data in an automated and secure way. For example, a smart contract could allow anyone to add a new movie to a movie catalog, but require that someone first pay for a decryption key before anyone can view it. To do this, the smart contract could be written such that the movie creator had to publicly disclose the decryption key in order to receive payment. Such a system would allow movie creators to make money by adding movies to the movie catalog that people want to watch.

Because smart contracts run on top of a blockchain, anyone can query them, and anyone can submit transactions to run their code. The blockchain stores the history of all accepted transactions, so anyone can audit the blockchain in order to independently verify that an app's global shared state has been managed correctly according to the smart contract's rules.

## Use cases

Not every decentralized application requires smart contracts, but Clarity unlocks interesting capabilities for decentralized applications. Examples of use cases include, but are not limited to:

* Access control (e.g. pay to access)
* Non-fungible and fungible tokens
* Business model templates (e.g. subscriptions)
* App-specific blockchains
* Decentralized Autonomous Organizations

## Language design

Clarity is a [list processing (LISP) language](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and differs from most other smart contract languages in two essential ways:

* The language is interpreted and broadcasted on the blockchain as is (not compiled)
* The language is decidable (not Turing complete)
  
Using an interpreted language ensures that the code that executes is human-readable, and is auditable by users. The fact that Clarity is a decidable language means that users can determine the set of reachable code from any function they want to call.

A Clarity smart contract is composed of two parts &mdash; a data-space and a set of functions. Only the associated smart contract may modify its corresponding data-space on the blockchain. Functions may be private and thus callable only from within the smart contract, or public and thus callable from other contracts. Users call smart contracts' public functions by broadcasting a transaction on the blockchain which invokes the public function. Contracts can also call public functions from other smart contracts.

Note some of the key Clarity language rules and limitations.

* The only atomic types are booleans, integers, fixed length buffers, and principals
* Recursion is illegal and there is no lambda function.
* Looping may only be performed via `map`, `filter`, or `fold`
* There is support for lists of the atomic types, however, the only variable length lists in the language appear as function inputs; There is no support for list operations like append or join.
* Variables are created via `let` binding and there is no support for mutating functions like `set`.

## Learning Clarity

You can try a [Hello World tutorial](tutorial.html) or jump right into the [language reference](clarityRef.html).
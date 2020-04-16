---
layout: core
description: "Blockstack Clarity: Introduction"
permalink: /:collection/:path.html
---
# Introduction to Clarity
{:.no_toc}

Clarity is a smart contracting language for use with the Stacks 2.0 Blockchain. It supports programmatic control over digital assets.

* TOC
{:toc}

## Smart contracts

Smart contracts allow two parties to exchange anything of value (money, property, shares), in an automated, auditable, and secure way _without the services of a middleman_. Nick Szabo introduced the canonical metaphor for smart contracts, a vending machine.

In Nick Szabo's metaphor, the vending machine is the smart contract. The buyer and machine owner are the two parties. A vending machine executes a set of hard-coded actions when the buyer engages with it. The machine displays the items and their prices. A buyer enters money into the machine which determines if the amount fails to mee, meets, or exceeds an item's price. Based on the amount, the machine asks for more money, dispenses an item, or dispenses and item and change.

If you are new to smart contracts concepts, you should read <a href="https://blockgeeks.com/guides/smart-contracts/" target="_blank">a good general explanation</a> first.

## Use cases

Not every decentralized application requires smart contracts, but Clarity unlocks interesting capabilities for decentralized applications. Examples of interesting use cases include, but are not limited to:

* Access control (e.g. pay to access)
* Non-fungible and fungible tokens
* Business model templates (e.g. subscriptions)
* App Chains
* Decentralized Autonomous Organizations

## Language design

Clarity is a list processing (LISP) language and differs from most other smart contract languages in two essential ways:

* The language is not intended to be compiled
* The language is not Turing complete
  
These differences allow for static analysis of programs to determine properties like runtime cost and data usage. Omitting compilation prevents the possibility of error or bugs introduced at the compiler level.

A Clarity smart contract is composed of two parts &mdash; a data-space and a set of functions. Only the associated smart contract may modify its corresponding data-space on the Blockchain. Functions are private unless they are defined as public functions. Users call smart contracts' public functions by broadcasting a transaction on the Blockchain which invokes the public function.

Contracts can also call public functions from other smart contracts. The ability to do a static analysis of a smart contract allows a user to determine dependency between contracts.

Note some of the key Clarity language rules and limitations:

* The only atomic types are booleans, integers, fixed length buffers, and principals
* Recursion is illegal and there is no lambda function.
* Looping may only be performed via `map`, `filter`, or `fold`
* There is support for lists of the atomic types, however, the only variable length lists in the language appear as function inputs; There is no support for list operations like append or join.
* Variables are created via `let` binding and there is no support for mutating functions like `set`.

## Learning Clarity

You can try a [Hello World tutorial](tutorial.html) or jump right into the [language reference](clarityRef.html).
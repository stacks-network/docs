---
title: Clarity Overview
description: Overview and guides for getting started with Clarity
sidebar_label: Clarity
sidebar_position: 5
---

Clarity is a **decidable** smart contract language that optimizes for predictability and security, designed for the Stacks blockchain. Smart contracts allow developers to encode essential business logic on a blockchain.

The design decisions behind Clarity were based heavily on taking lessons learned in common Solidity exploits and creating a langauge that has been purpose-built for safety and security in mind.

These docs serve primarily as a reference for the functions and keywords that you can use in Clarity.

In order to learn Clarity, we recommend diving into the [Clarity of Mind](https://book.clarity-lang.org/), an online book to teach you everything you need to know to build robust smart contracts, or joining a [Clarity Camp](https://clarity-lang.org/universe#camp), the cohort-based immersive Clarity experience.

## What makes Clarity different
The following section is an excerpt from the excellent book, [Clarity of Mind](https://book.clarity-lang.org/ch00-00-introduction.html):

The number of smart contract languages grows by the year. Choosing a first language can be challenging, especially for a beginner. The choice is largely dictated by the ecosystem you are interested in, although some languages are applicable to more than just one platform. Each language has its own upsides and downsides and it is out of the scope of this book to look at all of them. Instead, we will focus on what sets Clarity apart and why it is a prime choice if you require the utmost security and transparency.

One of the core precepts of Clarity is that it is secure by design. The design process was guided by examining common pitfalls, mistakes, and vulnerabilities in the field of smart contract engineering as a whole. There are countless real world examples of where developer failure led to the loss or theft of vast amounts of tokens. To name two big ones: an issue that has become known as the Parity bug led to the irreparable loss of millions of dollars worth of Ethereum. Second, the hacking of The DAO (a "Decentralised Autonomous Organisation") caused financial damage so great that the Ethereum Foundation decided to issue a contentious hard fork that undid the theft. These and many other mistakes could have been prevented in the design of the language itself.

### Clarity is interpreted, not compiled
Clarity code is interpreted and committed to the chain exactly as written. Solidity and other languages are compiled to byte-code before it is submitted to the chain. The danger of compiled smart contract languages is two-fold: first, a compiler adds a layer of complexity. A bug in the compiler may lead to different byte-code than was intended and thus carries the risk of introducing a vulnerability. Second, byte-code is not human-readable, which makes it very hard to verify what the smart contract is actually doing. Ask yourself, would you sign a contract you cannot read? If your answer is no, then why should it be any different for smart contracts?2 With Clarity, what you see is what you get.

### Clarity is decidable
A decidable language has the property that from the code itself, you can know with certainty what the program will do. This avoids issues like the halting problem. With Clarity you know for sure that given any input, the program will halt in a finite number of steps. In simple terms: it is guaranteed that program execution will end. Decidability also allows for complete static analysis of the call graph so you get an accurate picture of the exact cost before execution. There is no way for a Clarity call to "run out of gas" in the middle of the call. If you are unsure what this means, let it not worry you for now. The serious advantage of decidability will become more apparent over time.

### Clarity does not permit reentrancy
Reentrancy is a situation where one smart contract calls into another, which then calls back into the first contract—the call "re-enters" the same logic. It may allow an attacker to trigger multiple token withdrawals before the contract has had a chance to update its internal balance sheet. Clarity's design considers reentrancy an anti-feature and disallows it on the language level.

### Clarity guards against overflow and underflows
Overflows and underflows happen when a calculation results in a number that is either too large or too small to be stored, respectively. These events throw smart contracts into disarray and may intentionally be triggered in poorly written contracts by attackers. Usually this leads to a situation where the contract is either frozen or drained of tokens. Overflows and underflows of any kind automatically cause a transaction to be aborted in Clarity.

### Support for custom tokens is built-in
Issuance of custom fungible and non-fungible tokens is a popular use-case for smart contracts. Custom token features are built into the Clarity language. Developers do not need to worry about creating an internal balance sheet, managing supply, and emitting token events. Creating custom tokens is covered in depth in later chapters.

### On Stacks, transactions are secured by post conditions
In order to further safeguard user tokens, post conditions can be attached to transactions to assert the chain state has changed in a certain way once the transaction has completed. For example, a user calling into a smart contract may attach a post condition that states that after the call completes, exactly 500 STX should have been transferred from one address to another. If the post condition check fails, then the entire transaction is reverted. Since custom token support is built right into Clarity, post conditions can also be used to guard any other token in the same way.

### Returned responses cannot be left unchecked
Public contract calls must return a so-called response that indicates success or failure. Any contract that calls another contract is required to properly handle the response. Clarity contracts that fail to do so are invalid and cannot be deployed on the network. Other languages like Solidity permit the use of low level calls without requiring the return value to be checked. For example, a token transfer can fail silently if the developer forgets to check the result. In Clarity it is not possible to ignore errors, although that obviously does prevent buggy error handling on behalf of the developer. Responses and error handling are covered extensively in the chapters on functions and control flow.

### Composition over inheritance
Clarity adopts a composition over inheritance. It means that Clarity smart contracts do not inherit from one another like you see in languages like Solidity. Developers instead define traits which are then implemented by different smart contracts. It allows contracts to conform to different interfaces with greater flexibility. There is no need to worry about complex class trees and contracts with implicit inherited behaviour.

### Access to the base chain: Bitcoin
Clarity smart contracts can read the state of the Bitcoin base chain. It means you can use Bitcoin transactions as a trigger in your smart contracts! Clarity also features a number of built-in functions to verify secp256k1 signatures and recover keys.

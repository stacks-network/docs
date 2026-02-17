# How to Build on Bitcoin

Until recently, developers and users wanting to build decentralized applications and an open, permissionless economy had limited options beyond Ethereum and other chains like Solana, Avalanche, and NEAR.

While we can build apps that utilize Bitcoin, their functionality is largely limited to saving and payments. These are important capabilities, but they don't provide the foundation needed to build a complete decentralized economy.

## The Challenge: Bitcoin's Limited Programmability

We cannot create a comprehensive decentralized financial system using Bitcoin alone. If you want to do more with your Bitcoin than buy, hold, or pay (and even payments can be challenging), you must rely on centralized services, trusted intermediaries, or bridge to other ecosystems.

For truly decentralized money, we need the infrastructure and tools that utilize that money to also be decentralized.

## Use Cases for Bitcoin Smart Contracts

### Recreating Financial Instruments

How can we recreate existing financial instruments and develop new ones that not only utilize Bitcoin as money but also run on decentralized infrastructure?

Can we use Bitcoin to create decentralized financial products built on sound money rather than speculative assets?

### Contractual Agreements

A useful framework for understanding these use cases is to consider anything involving a contractual agreement between two parties. When you examine your daily life through this lens, you'll realize that nearly every interaction involves some form of agreement.

Many of these are informal "handshake agreements" between trusted parties, but a significant portion are formal contracts with explicit terms between parties who may or may not have personal relationships.

### Financial Products

Consider existing financial instruments like loans and investments. How can we build these on decentralized infrastructure to make them accessible to everyone?

Smart contracts excel at enabling these use cases.

#### Example: Decentralized Lending

Loans are a prime example. If you want to borrow or lend Bitcoin in exchange for interest, you currently must go through a centralized entity that custodies your Bitcoin. Making this system decentralized unlocks an entirely new category of economic activity that uses Bitcoin without requiring centralized intermediaries.

While technologies like Discreet Log Contracts (DLCs) can recreate some of this functionality, they remain relatively limited in scope.

### Preserving Bitcoin's Core Values

Bitcoin itself is designed to create permissionless, trust-minimized money. Smart contracts extend this philosophy by making the actions we take with that money equally decentralized and trust-minimized.

The critical question becomes: How can we unlock robust smart contract functionality for Bitcoin without modifying the crucial properties that make it secure and decentralized?

**That's where Bitcoin layers come in.**

This will be the main focus of the second half of this course as we explore how to build on Bitcoin using the Stacks L2 and the Clarity smart contract language.

For now, let's examine the high-level concept that we can build applications with comparable functionality to Ethereum on Bitcoin without modifying the core protocol.

## Understanding Bitcoin's Constraints

### Script: Bitcoin's Programming Language

Bitcoin has fundamental programming capability through its scripting language, Script. However, what you can accomplish with Script is inherently limited.

We'll cover this in detail in future lessons, but the key limitations include:

- You cannot trigger arbitrary actions based on Bitcoin transactions
- You cannot integrate real-world data from oracles
- You cannot create a robust state management system

Outside of very limited use cases like DLCs (Discreet Log Contracts) or HTLCs (Hash Time-Locked Contracts), you cannot write expressive smart contracts on Bitcoin.

### Scalability Constraints

Bitcoin can process only a few transactions per second, limiting scalability. This is by design—it keeps the requirements to run a full node very low, which increases decentralization.

Bitcoin layers can address both the programmability and scalability challenges. Let's briefly examine two approaches: Lightning for scaling and Stacks for smart contracts.

## Bitcoin Layer 2 Solutions

### Lightning

Lightning is a peer-to-peer scaling solution for Bitcoin that utilizes Bitcoin's native Script language and HTLCs to create a payment network capable of handling more transactions per second than the Visa network.

**How it works:**

1. Users open payment channels with each other
2. Multiple transactions occur off-chain within these channels
3. All transactions settle back to the main Bitcoin chain as a single batch transaction

Individual transactions occur off-chain on the peer-to-peer Lightning network and then settle to Bitcoin. This enables much faster transactions and higher throughput but fundamentally does not expand Bitcoin's functionality beyond payments.

**Limitations:**

While Lightning is innovative and will likely play a key role in Bitcoin's growth and adoption as usage scales, it faces challenges that need to be addressed:

- Liquidity constraints in payment channels
- Does not enable complex decentralized financial systems
- Limited to payment-related use cases

That's where solutions like Stacks become essential.

### Stacks

Where Lightning scales Bitcoin's payment capacity, Stacks expands Bitcoin's functionality by enabling smart contracts.

We'll cover Stacks in detail in the second half of this course, but here's the essential overview:

**What is Stacks?**

Stacks is a blockchain protocol connected to Bitcoin via its Proof of Transfer (PoX) consensus mechanism. It has its own token (STX) but is fundamentally anchored to Bitcoin and cannot exist independently.

**Key Features:**

- **Fully expressive smart contracts** using Clarity, a language designed for security and predictability
- **Bitcoin integration** through sBTC, allowing you to use actual Bitcoin in smart contracts
- **Trust-minimized and decentralized** architecture that preserves Bitcoin's core values

**The sBTC Advantage:**

With sBTC, Stacks enables smart contract functionality _using Bitcoin itself_ as the asset. This allows Stacks to function as a programmability layer for Bitcoin, maintaining a trust-minimized and decentralized approach.

## The Bottom Line

Stacks enables the same level of functionality available on Ethereum but for Bitcoin—without changing any of the properties that make Bitcoin resilient, secure, and decentralized.

This is how we build a complete Bitcoin economy while preserving what makes Bitcoin valuable: its security, decentralization, and trustless nature.

---

### What's Next

In the following sections, we'll dive deep into:

- How Stacks works technically
- The Clarity smart contract language
- Building your first Bitcoin application
- Best practices for Bitcoin development

Let's begin building the decentralized economy on Bitcoin.

[![License](https://img.shields.io/github/license/stacks-network/docs)](https://github.com/stacks-network/docs/blob/master/LICENSE)

# Start Here

## Stacks: The TL;DR

**Stacks is the leading Bitcoin L2, bringing smart contract functionality to Bitcoin, without modifying Bitcoin itself.**

{% hint style="info" %}
Want to get a guided introduction to everything you need to know to become a Stacks developer? The Stacks Primer is a 5-day email course designed to take you from brand new to building your first contract, and even how to get paid for building out your own project.

[Take the Course](https://stacks.org/dev)
{% endhint %}

It does so through three key components, that we'll dig into in more detail in the rest of the docs:

#### Proof of Transfer

Proof of Transfer (PoX) is the block production mechanism of the Stacks chain. Essentially, it attempts to recreate the block production patterns of PoW programmatically. Stacks miners spend BTC for a chance to mine new Stacks blocks. Under the hood, this block production mechanism anchors Stacks blocks to Bitcoin blocks, making it as hard to reverse a Stacks block as it is to reverse a Bitcoin block. That's a big claim, and we unpack it in further detail in the sections on Nakamoto block production.

#### Clarity

Clarity is the smart contract language that Stacks uses. it has been designed from the ground up to make it easier for developers to write safe, secure smart contracts. Additionally, since it has been purpose-built for Stacks and Bitcoin, there are built-in functions for reading Bitcoin state, which means you can use Bitcoin state to perform actions in Clarity. For example, you could set up a check to make sure a particular Bitcoin transaction has occurred before executing a mint function in Clarity, which just so happens to be what happens with the third component: sBTC.

#### sBTC

sBTC is the trust-minimized 2-way Bitcoin peg on the Stacks layer. sBTC is the key to making Bitcoin programmable and bringing full smart contract functionality to Bitcoin via Stacks. sBTC is not a federation, but operates as an open-network, decentralized 2-way peg solution to bring smart contract functionality to Bitcoin with as little counterparty risk as possible. There is an entire section of these docs dedicated to explaining[ sBTC](concepts/sbtc/).

### How to Use These Docs

{% embed url="https://www.youtube.com/watch?v=eMbzbR53Avo" %}

### AI-Powered Semantic Search

Looking for something specific? These docs are integrated with AI-powered semantic search, hit `Cmd/Ctrl + K` to open up the search box and ask the docs whatever you like.

### What Next?

#### Learn About Stacks

Looking to learn more about exactly how Stacks works? The "[Concepts](broken-reference/)" section in the left navigation is where you'll want to go. The "[What is Stacks](concepts/stacks-101/what-is-stacks.md)" page is the best place to start your learning journey. This is where you can dive deep into exactly how Stacks works and learn about all the different building blocks.

#### Build a Stacks Dapp

Are you a developer itching to get building? The [Quickstart tutorial](guides-and-tutorials/hello-stacks-quickstart-tutorial.md) is the best place to start. It will introduce you to the essential things you need to know to build on Stacks in just 30 minutes. After that, check the rest of the Guides & Tutorials to learn how to build things like DeFi apps, crowdfunding, and collectibles, among other use cases.

#### Run a Stacks Node

Looking to run a Stacks node? You can either run a follower node or a miner node. We have guides for how to do both on testnet and mainnet in the "[Run a Node](guides-and-tutorials/nodes-and-miners/)" section of the Guides.

#### Run a Signer

Signers are a critical component of the Stacks ecosystem and are in charge of validating and appending new Stacks blocks and sBTC transactions. We have an entire section dedicated to [running a signer](guides-and-tutorials/running-a-signer/).

#### Stack Your STX

Stacking is one of the key components behind Stacks and the Proof of Transfer consensus mechanism. There are many different ways you can stack depending on if you are stacking solo, stacking in a pool, and running a signer or not. We have a [section on stacking](guides-and-tutorials/stack-stx/) to walk you through the process no matter your situation.

#### Get More Involved

Looking to grow your career in the Stacks ecosystem? Be sure to start working on your own project and submit it to the [Code for STX](https://stacks.org/code-for-stx) program to earn STX every month just for working on your project. And, if you're feeling up to the challenge, apply to the Clarity Collective, an exclusive community of proven, committed Stacks builders all dedicated to becoming exceptional Stacks developers.

Next up, dig into exactly what Stacks is and how it works 👇🏻

---
title: Block Production
description: How blocks are produced in Nakamoto and how this unlocks fast blocks and Bitcoin finality
sidebar_label: Block Production
sidebar_position: 2
---

One of the most significant changes coming in Nakamoto is how new blocks are produced. Historically, because Stacks blocks have been anchored 1:1 to Bitcoin blocks, slow block times and transaction times have been one of the biggest pain points for Stacks users and developers.

Nakamoto brings significantly faster block times by decoupling Stacks block production from Bitcoin block production. In Nakamoto, new Stacks blocks are produced roughly every 5 seconds.

## Tenure-Based Block Production

This is achieved via the use of tenure-based block production. Each Bitcoin block introduces a new tenure, in which a single miner cryptographically selected for that tenure is responsible for producing all Stacks blocks.

But if a single miner is only cryptographically selected for their tenure, and not their produced blocks, what mechanisms exist to ensure the validity of their block production.

## Stackers

This is where Stackers come in. In pre-Nakamoto Stacks, Stackers were responsible only for locking their STX tokens to contribute to the economic security of the network.

In Nakamoto, Stackers are responsible for validating and approving each block produced during a miner's tenure.

To ensure network consistency, the Stacks protocol commits to the state of the Stacks blockchain with each new Bitcoin block by referencing the first Stacks block produced in the previous tenure. Such a design reinforces the fidelity of transaction data and the synchronization between the two chains. It also links the Stacker’s actions with the actions of miners producing a partnership between the two to create both fast and secure blocks.

As part of this tenure change, Stackers also agree on a last signed block and require the next miner to build off of this, which prevents new Stacks forks. Stacks does not fork on its own and automatically forks with Bitcoin.

This symbiotic relationship between Stackers and miners is what creates the capability for both fast blocks and 100% Bitcoin finality.

This elegant design creates a cooperative relationship between miners and stackers while achieving the best of both worlds with block production and transaction speed and security.

## Bitcoin Finality

Speaking of security, the concept of 100% Bitcoin finality is crucial to the design of Stacks. This is what turns Stacks into a true Bitcoin L2 and allows it to leverage all of the security inherent in Bitcoin.

Let's first define what we mean by 100% Bitcoin finality, then we'll dig into how Nakamoto accomplishes this.

Finality refers to the point at which transactions are irreversible. Once a blockchain reaches finality, it is nearly impossible to change the ledger's history without undertaking extraordinary measures that are often computationally and economically prohibitive.

When we talk about Stacks blocks having 100% Bitcoin finality, we mean that they are as hard to reverse as Bitcoin transactions themselves.

That's a bold claim, so how does Stacks accomplish that?

As discussed above, miners are responsible for producing Stacks blocks in their tenure, which corresponds to a single Bitcoin block. As part of their block commit transaction, which is the transaction that commits the hash of the Stacks blocks to the Bitcoin chain, miners will also be required to add an indexed block hash.

Stacks miners are required to commit the indexed block hash of the first block produced by the last Stacks miner in their block-commit transactions on Bitcoin. This is the SHA512/256 hash of both the consensus hash of all previously-accepted Bitcoin transactions that Stacks recognizes, as well as the hash of the block itself.

This will anchor the Stacks chain history to Bitcoin up to the start of the previous miner's tenure, as well as all causally-dependent Bitcoin state that Stacks has processed. This ensures Bitcoin finality, resolves miner connectivity issues by putting fork prevention on stackers, and allows nodes with up-to-date copies of the Stacks chain state to identify which Stacks blocks are affected by a Bitcoin reorg and recover the affected Stacks transactions.

---
title: Proof of Transfer
description: Understand the proof-of-transfer consensus mechanism
sidebar_position: 2
---

In the previous section, we took a look at the vision and ethos of Stacks. We talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the consensus mechanism that makes that happen, Proof of Transfer.

Consensus algorithms for blockchains require compute or financial resources to secure the blockchain. The general practice of decentralized consensus is to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of transfer (PoX) is an extension of the proof of burn mechanism. PoX uses the proof of work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

![PoX mechanism](/img/pox-mechanism.png)

This allows network participants to secure the PoX cryptocurrency network and earn a reward in the base cryptocurrency. Thus, PoX blockchains are anchored on their chosen PoW chain. Stacks uses [Bitcoin](#why-bitcoin) as its anchor chain.

![PoX participants](/img/pox-participants.png)

## Why Bitcoin?

There are a number of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It's the oldest blockchain protocol, having launched in 2009, and has become a recognized asset outside of the cryptocurrency community. BTC has held the highest market capitalization of any cryptocurrency for the past decade.

Bitcoin champions simplicity and stability, and has stood the test of time. Influencing or attacking the network is infeasible or impractical for any potential hackers. It's one of the only cryptocurrencies to capture public attention. Bitcoin is a household name, and is recognized as an asset by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

SIP-001 provides a full [list of reasons why Bitcoin was chosen to secure Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

:::note
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network, we'll look at these in a future lesson.
:::

## Blocks and microblocks

The Stacks blockchain allows for increased transaction throughput using a mechanism called microblocks. Bitcoin and Stacks progress in lockstep, and their blocks are confirmed simultaneously. On Stacks, this is referred to as an ‘anchor block’. An entire block of Stacks transactions corresponds to a single Bitcoin transaction. This significantly improves cost/byte ratio for processing Stacks transactions. Because of simultaneous block production, Bitcoin acts as a rate-limiter for creating Stacks blocks, thereby preventing denial-of-service attacks on its peer network.

However, in between Stacks anchor blocks settling on the Bitcoin blockchain, there are also a varying number of microblocks that allow rapid settlement of Stacks transactions with a high degree of confidence. This allows Stacks transaction throughput to scale independently of Bitcoin, while still periodically establishing finality with the Bitcoin chain. The Stacks blockchain adopts a block streaming model whereby each leader can adaptively select and package transactions into their block as they arrive in the mempool. Therefore when an anchor block is confirmed, all of the transactions in the parent microblock stream are packaged and processed. This is an unprecedented method for achieving scalability without creating a totally separate protocol from Bitcoin.

![stx-microblock](/img/stx-microblocks.png)

## Unlocking Bitcoin capital
In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks block is recorded to the OP_RETURN opcode of a Bitcoin transaction. If you aren't familiar, the OP_RETURN opcode allows us to store up to 40 bytes of arbitrary data in a Bitcoin transaction.

:::note
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
:::

This is how Stacks records its history to the Bitcoin chain and why it inherits some security as a result of this process. If you wanted to try and create a false Stacks fork, you would have to broadcast the entire process to the Bitcoin chain.

Similarly, if you wanted to try and change the history of the Stacks chain, you would have to somehow modify these OP_RETURN values in each corresponding Bitcoin block, meaning you would have to compromise Bitcoin in order to compromise the history of Stacks.

:::caution
Note that this is not the same thing as saying that you need to compromise Bitcoin in order compromise Stacks at all, but simply that in order to falsify the history of the Stacks chain you would have to also falsify the history of the Bitcoin chain.
:::

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks bllock.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occured. You can see this in action in [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html), with other interesting projects like [Zest](https://www.zestprotocol.com/) seeking to expand on this functionality.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

![Unlocking Bitcoin](/img/pox-unlocking-btc.png)

We also recommend [reading the full PoX whitepaper](https://community.stacks.org/pox), as it breaks down the reasoning behind creating a PoX chain and the unique benefits we get from doing so.

### Got another question
Have another question not answered here? Post in on Stack Overflow under the appropriate tag(s) and post the link to the Stack Overflow question in the Stacks Discord in the appropriate channel.
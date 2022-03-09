---
title: Proof of Transfer
description: Understand the proof-of-transfer consensus mechanism
icon: TestnetIcon
images:
  large: /images/stacking.svg
  sm: /images/stacking.svg
---

## Overview

Consensus algorithms for blockchains require compute or financial resources to secure the blockchain. The general practice of decentralized consensus is to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Popular consensus mechanisms in modern blockchains include proof-of-work, in which nodes dedicate computing resources, and proof-of-stake, in which nodes dedicate financial resources to secure the network.

Proof-of-burn is a novel consensus mechanism where miners compete by ‘burning’ (destroying) a proof-of-work cryptocurrency as a proxy for computing resources.

Proof-of-transfer (PoX) is an extension of the proof-of-burn mechanism. PoX uses the proof-of-work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof-of-burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

![PoX mechanism](/images/pox-mechanism.png)

This allows network participants to secure the PoX cryptocurrency network and earn a reward in the base cryptocurrency. Thus, proof-of-transfer blockchains are anchored on their chosen proof-of-work chain. Stacks uses [Bitcoin](#why-bitcoin) as its anchor chain.

![PoX participants](/images/pox-participants.png)

## Why Bitcoin?

There are a number of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It's the oldest blockchain protocol, having launched in 2009, and has become a recognized asset outside of the cryptocurrency community. BTC has held the highest market capitalization of any cryptocurrency for the past decade.

Bitcoin champions simplicity and stability, and has stood the test of time. Influencing or attacking the network is infeasible or impractical for any potential hackers. It's one of the only cryptocurrencies to capture public attention. Bitcoin is a household name, and is recognized as an asset by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the proof-of-transfer consensus mechanism.

SIP-001 provides a full [list of reasons why Bitcoin was chosen to secure Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

![btc-stacks](/images/pox-why-bitcoin.png)

## Blocks and microblocks

The Stacks blockchain allows for increased transaction throughput using a mechanism called microblocks. Bitcoin and Stacks progress in lockstep, and their blocks are confirmed simultaneously. On Stacks, this is referred to as an ‘anchor block’. An entire block of Stacks transactions corresponds to a single Bitcoin transaction. This significantly improves cost/byte ratio for processing Stacks transactions. Because of simultaneous block production, Bitcoin acts as a rate-limiter for creating Stacks blocks, thereby preventing denial-of-service attacks on its peer network.

However, in between Stacks anchor blocks settling on the Bitcoin blockchain, there are also a varying number of microblocks that allow rapid settlement of Stacks transactions with a high degree of confidence. This allows Stacks transaction throughput to scale independently of Bitcoin, while still periodically establishing finality with the Bitcoin chain. The Stacks blockchain adopts a block streaming model whereby each leader can adaptively select and package transactions into their block as they arrive in the mempool. Therefore when an anchor block is confirmed, all of the transactions in the parent microblock stream are packaged and processed. This is an unprecedented method for achieving scalability without creating a totally separate protocol from Bitcoin.

![stx-microblock](/images/stx-microblocks.png)

## Unlocking Bitcoin capital

Stacks also unlocks the hundreds of billions in capital in Bitcoin, and gives Bitcoiners new opportunities to use and earn BTC. Stacks is a accompaniment to the Bitcoin ecosystem, and the two networks working in tandem enables totally novel ways of using BTC. The Stacks ecosystem makes interactive cryptocurrency applications available to Bitcoin holders. Additionally, By stacking STX tokens and participating in the PoX consensus mechanism, users have the opportunity to earn BTC while securing the Stacks chain.

![Unlocking Bitcoin](/images/pox-unlocking-btc.png)

## Clarity and the Bitcoin state

Clarity smart contracts also have unique visibility into the state of the Bitcoin blockchain. This means that contract logic in a Clarity file has the ability to trigger when specific Bitcoin transactions are confirmed. Clarity smart contracts have a built in Simple Payment Verification (SPV) proofs for Bitcoin that make interacting with Bitcoin’s state much simpler for developers. Additionally, Clarity contracts can fork with the original Bitcoin chain. Therefore, in an edge case where Bitcoin forks, developers wouldn’t have to worry about adjusting the deployment of their smart contracts.

## See also

- [Read the full PoX whitepaper](https://community.stacks.org/pox)
- [Watch CEO Muneeb Ali and Evangelist Joe Bender give an overview of Stack's breakthrough PoX mining mechanism](https://www.youtube.com/watch?v=NY_eUrIcWOY)

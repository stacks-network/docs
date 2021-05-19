---
title: Proof of Transfer
description: Understand the proof-of-transfer consensus mechanism
icon: TestnetIcon
images:
  large: /images/stacking.svg
  sm: /images/stacking.svg
---

## Overview

Consensus algorithms for public blockchains require computing or financial resources to secure the blockchain. The idea being to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Mining mechanisms used by these algorithms are broadly divided into proof-of-work, in which nodes dedicate computing resources, and proof-of-stake, in which nodes dedicate financial resources to participate in the [consensus algorithm](/understand-stacks/stacking#stacking-consensus-algorithm).

A variant of proof-of-work is proof-of-burn where miners compete by ‘burning’ (destroying) a proof-of-work cryptocurrency as a proxy for computing resources.

Proof-of-transfer (PoX) is a new mining mechanism, that generalizes the concept of proof-of-burn. PoX uses the proof-of-work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof-of-burn rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

This allows network participants who are adding value to the new cryptocurrency network to earn a reward in a base cryptocurrency by actively participating in the consensus algorithm, PoX encourages a model where there is one extremely secure proof-of-work blockchain, say Bitcoin.

Other new blockchains can be anchored on the secure proof-of-work blockchain instead of introducing new proof-of-work chains. PoX has an interesting property where participants can earn payouts in a separate, potentially more stable, base cryptocurrency while participating in the new blockchain network. This can help solve a bootstrapping problem for new blockchains by providing incentives for early participants. Further, PoX has a potential use case for funding ecosystem developer funds.
![proof-of-transfer](/images/proof-of-transfer.png)

## Why Bitcoin?

There are a multitude of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It is one of the oldest blockchain protocols having launched in 2009, and has benefited from all the industry learnings that have occurred since that time. It is far and away the most valuable blockchain network, and BTC has held the highest market cap of any cryptocurrency for the past decade.

Bitcoin champions immutability, and has stood the test of time. It has been proven that influencing or attacking the network would be infeasible or impractical for any potential hackers. It is one of the only cryptocurrencies to bridge the mainstream chasm and gain immense public attention. Bitcoin is now a household name, and is being recognized by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin has been cemented as a reliable store of value, and is the perfect infrastructure to plug into the proof-of-transfer consensus mechanism.

<img width="629" alt="Screen Shot 2021-05-17 at 3 00 20 PM" src="https://user-images.githubusercontent.com/10453432/118653476-90215800-b7b5-11eb-805a-cd76f213a84d.png">

## Blocks and Microblocks

The Stacks blockchain allows for increased transaction throughput using a mechanism called microblocks. Bitcoin and Stacks progress in lockstep, and their blocks are confirmed simultaneously. On Stacks, this is referred to as an ‘anchor block’. An entire block of Stack transactions corresponds to a single Bitcoin transaction. This significantly improves cost/byte ratio for processing Stacks transactions. In doing so, the burn chain acts as a decentralized rate-limiter for creating Stacks blocks, thereby preventing denial-of-service attacks on its peer network.

However, in between Stacks anchor blocks settling on the Bitcoin blockchain, there are also a varying number of microblocks that enable drastically more transactions to be processed by orders of magnitude. This allows Stacks transaction throughput to scale independently of Bitcoin, while still periodically establishing finality with the Bitcoin chain. The Stacks blockchain adopts a block streaming model whereby each leader can adaptively select and package transactions into their block as they arrive in the mempool. Therefore when an anchor block is confirmed, all of the transactions in the parent microblock stream are packaged and processed. This is an unprecedented method for achieving scalability without creating a totally separate protocol from Bitcoin.

<img width="719" alt="Screen Shot 2021-05-17 at 3 00 34 PM" src="https://user-images.githubusercontent.com/10453432/118653666-c65ed780-b7b5-11eb-847f-66278121b5e5.png">

## Unlocking Bitcoin Capital

Stacks also unlocks the over $1+ Trillion in capital that exists in the Bitcoin ecosystem, and gives Bitcoiners new opportunities to use and earn BTC. Bitcoin invented the art of the “HODL”, and Bitcoiners are watching and waiting for interesting applications to be built that expand BTC’s usability. Stacks made the deliberate design decision to not create a totally independent network, and instead take advantage of the preexisting network effect of Bitcoin.

In this way, Stacks is an accessible accompaniment to the Bitcoin ecosystem, and the two networks working in tandem enables totally novel ways of using BTC. The dApp and DeFi ecosystem burgeoning on Stacks will encourage less active BTC addresses to begin experimenting with interactive applications of cryptocurrency. By locking up STX on the network and participating in the Stacking mechanism, users have the opportunity to earn a familiar, native currency like BTC while also enriching the Stacks protocol.

## Clarity and the Bitcoin State

Clarity smart contracts also have unique visibility into the state of the Bitcoin blockchain. This means that contract logic in a Clarity file has the ability to trigger when specific Bitcoin transactions have been confirmed. Clarity smart contracts have a built in Simple Payment Verification (SPV) proofs for Bitcoin that make interacting with Bitcoin’s state much simpler for developers. Additionally, Clarity contracts will potentially fork with the original Bitcoin chain. Therefore, in an edge case where Bitcoin forks, developers wouldn’t have to worry about adjusting the deployment of their smart contracts.

## See also

- [Read the full PoX whitepaper](https://community.blockstack.org/pox)
- [Watch CEO Muneeb Ali and Evangelist Joe Bender give an overview of Stack's breakthrough PoX mining mechanism](https://www.youtube.com/watch?v=NY_eUrIcWOY)

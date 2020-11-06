---
title: Proof of Transfer
description: Understand the proof-of-transfer consensus mechanism
icon: TestnetIcon
---

## Overview

Consensus algorithms for public blockchains require computing or financial resources to secure the blockchain. The idea being to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Mining mechanisms used by these algorithms are broadly divided into proof-of-work, in which nodes dedicate computing resources, and proof-of-stake, in which nodes dedicate financial resources to participate in the [consensus algorithm](/understand-stacks/stacking#stacking-consensus-algorithm).

A variant of proof-of-work is proof-of-burn where miners compete by ‘burning’ (destroying) a proof-of-work cryptocurrency as a proxy for computing resources.

Proof-of-transfer (PoX) is a new mining mechanism, that generalizes the concept of proof-of-burn. PoX uses the proof-of-work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof-of-burn rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participant(s) in the network.

This allows network participants who are adding value to the new cryptocurrency network to earn a reward in a base cryptocurrency by actively participating in the consensus algorithm, PoX encourages a model where there is one extremely secure proof-of-work blockchain, say Bitcoin.

Other new blockchains can be anchored on the secure proof-of-work blockchain instead of introducing new proof-of-work chains. PoX has an interesting property where participants can earn payouts in a separate, potentially more stable, base cryptocurrency while participating in the new blockchain network. This can help solve a bootstrapping problem for new blockchains by providing incentives for early participants. Further, PoX has a potential use case for funding ecosystem developer funds.
![proof-of-transfer](/images/proof-of-transfer.png)

## See also

- [Read the full PoX whitepaper](https://community.blockstack.org/pox)
- [Watch CEO Muneeb Ali and Evangelist Joe Bender give an overview of Stack's breakthrough PoX mining mechanism](https://www.youtube.com/watch?v=NY_eUrIcWOY)

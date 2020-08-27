---
title: Understand Stacking
description: Introduction to the rewarding mechanism of Proof-of-Transfer
images:
  sm: /images/pages/stacking-rounded.svg
---

## Introduction

Stacking rewards Stacks token holders with bitcoins for providing a valuable service to the network by locking up their tokens for a certain period of time.

Stacking is a built-in action, required by the "proof-of-transfer" (PoX) mechanism. The PoX mechanism is executed by every miner on the Stacks 2.0 network.

## PoX mining

For a miner to receive newly-minted Stacks tokens, they have to transfer bitcoins to eligible owners of Stacks tokens. The PoX mechanism ensures proper handling and incentives through four key phases:

- Registration: Miners register for a future election by transfering bitcoins and sending consensus data to the network
- Election: A verifiable random function chooses one registered miner to write a new block on the Stacks blockchain
- Operation: The elected miner writes the new block and collects rewards in form of new Stacks tokens
- Distribution: Collected bitcoins from the registration process are sent to a set eligible Stacks tokens holders

Miners have to run software on their machines to participate in the PoX mechanism.

[@page-reference | inline]
| /mining

## Token holder eligibility

Stacks token holders do not automatically receive Stacking rewards. Instead, they must:

- Commit to participation before a reward cycle begins
- Hold ~94.000 Stacks tokens
- Lock up Stacks tokens for a specified period
- Set a Bitcoin address to receive rewards

Token holders will have to use a wallet or exchange that supports participation in Stacking.

[@page-reference | inline]
| /stacks-blockchain/integrate-stacking

## Stacking consensus algorithm

Stacking is a built-in capability of PoX and is realized through a set of actions on the Stacks 2.0 network. The full implementation details can be found in [SIP-007](https://github.com/blockstack/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md). Below is a summary of the most relevant actions of the algorithm.

-> Fun fact: The Stacking consensus algorithm is implemented as a smart contract, using [Clarity](/smart-contracts/overview).

- Progression in Stacking consensus happens over reward cycles (with a fixed length). In each reward cycle, a set of Bitcoin addresses are iterated over
- A reward cycle consists of two phases: prepare and reward
- During the prepare phase, miners decide on an anchor block and a reward set. Mining any descendant forks of the anchor block requires transferring mining funds to the appropriate reward addresses. The reward set is the set of Bitcoin addresses which will receive funds in the reward cycle
- Miners register as leader candidates for a future election by sending a key transaction that both burns cryptocurrency (proof-of-burn) and spends energy (proof-of-work). The transaction also registers the leader's preferred chain tip (must be a descendant of the anchor block) and commitment of funds to 5 addresses from the reward set
- Token holders register for the next rewards cycle by broadcasting a signed message that locks up associated Stacks tokens for a protocol-specified lockup period, specifies a Bitcoin address to receive the funds, and votes on a Stacks chain tip
- The leader that commits to the winning chain tip and the peers who also burn for that leader collectively share the reward, proportional to how much each one burned
- Token holders' locked up tokens automatically unlock as soon as the lockup period is completed

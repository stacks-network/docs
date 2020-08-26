---
title: Understand Stacking
description: Introduction to the consensus algorithm of the Stacks 2.0 blockchain
images:
  large: /images/pages/mining.svg
  sm: /images/pages/mining-sm.svg
---

## Introduction

The Stacking consensus algorithm uses a new type of mining mechanism called "proof-of-transfer" (PoX). With PoX, miners are not converting electricity and computing power to newly minted tokens, nor are they staking their cryptocurrency. Rather, they use Bitcoin to secure the Stacks 2.0 network. By anchoring onto the Bitcoin network, it is practically infeasible for malicious actors to have enough computational power or ownership stake to attack the Stacks 2.0 network.

## Mining mechanism: Proof of Transfer

In proof-of-transfer, in order to receive newly-minted Stacks tokens, miners have to transfer bitcoins to owners of Stacks tokens. On a protocol-level, the mechanism consists of three key steps:

- Election: A verifiable random function (VRF) chooses a registered miner to write a new block on the Stacks blockchain
- Operation: The leader writes the new block and collects rewards in form of new Stacks tokens
- Distribution: Bitcoins are sent to a set of specific addresses corresponding to Stacks (STX) tokens holders

### Stacks token holder requirements

In order to qualify for Stacking rewards, an STX holder must:

- Hold ~94.000 Stacks tokens
- Commit to participation before a reward cycle begins
- Lock Stacks tokens for a lockup period
- Specify a Bitcoin address to receive rewards
- Vote on a Stacks chain tip

## Consensus algorithm: Stacking

- each leader candidate registers itself for a future election by sending a key transaction
- transaction both burns the leader's cryptocurrency (proof-of-burn) and spends the leader's energy (proof-of-work), and registers the leader's preferred chain tip and new VRF seed for selection in the cryptographic sortition
- one election across all candidate leaders (across all chain tips)
- each correct leader candidate first selects the transactions they will commit to include their blocks as a batch, constructs a Merkle tree from them, and then commits the Merkle tree root of the batch and their preferred chain tip (encoded as the hash of the last leader's microblock header) within the commitment transaction in the election protocol.
- leader that commits to the winning chain tip and the peers who also burn for that leader collectively share in the block's reward, proportional to how much each one burned
- New Stacks tokens come into existence on a fork in an epoch where a leader is selected, and are granted to the leader if the leader produces a valid block
- However, the Stacks blockchain pools all tokens created and all transaction fees received and does not distribute them until a large number of epochs (a lockup period) has passed. The tokens cannot be spent until the period passes.

- must determine the set of addresses that miners may validly transfer funds to. Consensus of this requires a "rewarding prepare" phase in which an anchor block and reward set are decided on
- Progression in Stacking consensus happens over reward cycles (with a fixed length). In each reward cycle, a set of Bitcoin addresses are iterated over, such that each Bitcoin address in the set of reward addresses has exactly one Bitcoin block in which miners will transfer funds to the reward address.
- If a miner is building off a descendant of the anchor block, the miner must send commitment funds to 5 addresses from the reward set

### Integrating stacking

Ready to integrate stacking in your wallet or exchange?

[@page-reference | inline]
| /stacks-blockchain/integrate-stacking

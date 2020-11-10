---
title: Understand Mining
description: A guide to mining on Stacks 2.0
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

This guide highlights some technical details related to minig on the Stacks 2.0 network.

## Mining frequency

A new Stacks block may be mined once per Bitcoin block. To be considered for mining a block, a miner must have a block commit included in a Bitcoin block. If a miner wishes to update their commitment after submission, they may use Bitcoin Replace-By-Fee.

## Coinbase Rewards

Miners receive coinbase rewards for blocks they mine. These rewards are shared (proportional to the amount committed to) with an user burn support operations that support the block.

The reward amounts are:

- 1000 STX per block are released in the first 4 years of mining
- 500 STX per block are released during the following 4 years
- 250 Stacks tokens per block are released during the following 4 years
- 125 STX per block are released from then on indefinitely.

These "halvings" are synchronized with Bitcoin halvings.

![coinbase rewards](/images/pages/coinbase-rewards.png)

## Transaction fees

Miners receives Stacks fees for transactions mined in any block they produce.

For transactions mined in microblocks, the miner that produces the microblock receives 40% of the fees, while the miner that confirms the microblock receives 60% of the fees.

## Reward maturity

Miner rewards take 100 blocks to mature.

## Mining with Proof-of-Transfer

Miners commit Bitcoin to **two** addresses in every leader block commit. The amount committed to each address must be the same. The addresses are chosen from the current reward set of Stacking participants. The choice of addresses is done using a verifiable-random-function, and determining the correct two addresses for a given block requires monitoring the stacks chain.

![mining with pox](/images/pages/mining-with-pox.png)

100,000 Bitcoin blocks **after** mining begins, the PoX sunset phase begins. During this phase, an increasing proportion of the block commit must be burnt. To burn this sunset fee, the miner must send the sunset fee amount to the first output of their block commit transaction (i.e., the OPRETURN output).

400,000 Bitcoin blocks after the sunset phase begins, the sunset phase ends. After this point, PoX is no longer active, and miners must burn all of their leader block commits. They do so by sending Bitcoin to the canonical burn address `1111111111111111111114oLvT2`.

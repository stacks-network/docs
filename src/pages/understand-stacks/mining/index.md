---
title: Mining
description: A guide to mining on Stacks 2.0
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

This guide highlights some technical details related to mining on the Stacks 2.0 network.

## Mining frequency

A new Stacks block may be mined once per Bitcoin block. To be considered for mining a block, a miner must have a block commit included in a Bitcoin block. If a miner wishes to update their commitment after submission, they may use Bitcoin Replace-By-Fee.

## Coinbase rewards

Miners receive coinbase rewards for blocks they win.

The reward amounts are:

- 1000 STX per block are released in the first 4 years of mining
- 500 STX per block are released during the following 4 years
- 250 STX per block are released during the following 4 years
- 125 STX per block are released from then on indefinitely.

These "halvings" are synchronized with Bitcoin halvings.

![coinbase rewards](/images/pages/coinbase-rewards.png)

## Transaction fees

Miners receive Stacks fees for transactions mined in any block they produce.

For transactions mined in microblocks, the miner that produces the microblock receives 40% of the fees, while the miner that confirms the microblock receives 60% of the fees.

## Reward maturity

Block rewards and transaction fees take 100 blocks on the Bitcoin blockchain to mature. After successfully mining a block your rewards appear in your Stacks account after ~24 hours.

## Mining with proof-of-transfer

Miners commit Bitcoin to **two** addresses in every leader block commit. The amount committed to each address must be the same. The addresses are chosen from the current reward set of stacking participants. Addresses are chosen using a verifiable-random-function, and determining the correct two addresses for a given block requires monitoring the Stacks chain.

![mining with pox](/images/pages/mining-with-pox.png)

100,000 Bitcoin blocks **after** mining begins, the PoX sunset phase begins. During this phase, an increasing proportion of the block commit must be burnt. To burn this sunset fee, the miner must send the sunset fee amount to the first output of their block commit transaction (that is, the OPRETURN output).

400,000 Bitcoin blocks after the sunset phase begins, the sunset phase ends. After this point, PoX is no longer active, and miners must burn all of their leader block commits. They do so by sending Bitcoin to the canonical burn address `1111111111111111111114oLvT2`.

## Probability to mine next block

The miner who is selected to mine the next block is chosen depending on the amount of BTC the miners sent, that is, transferred or burnt.

The probability for a miner to mine the next block equals the BTC the miner sent divided by the total BTC all miners sent.

While there is no minimum BTC commitment enforced by the protocol, in practice, there's a floor constrained by [dust](https://unchained-capital.com/blog/dust-thermodynamics/)": basically, if the fees for a transaction exceed the value of the spent output, it's considered dust. How dust is [calculated](https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp#L14) depends on a number of factors, we've found 5,500 satoshis to be good lower bound per [output](https://learnmeabitcoin.com/technical/output). Bitcoin transactions from Stacks miners contain two outputs (for Proof-of-Transfer), so a commitment of at least 11,000 satoshis / block is recommended.

To calculate the amount of BTC to send miners should:

- Guess the price BTC/STX for the next day (100 blocks later)
- Guess the total amount of BTCs committed by all miners

## Microblocks

The Stacks blockchain produces blocks at the same rate as the Bitcoin blockchain. In order to provide lower latency
transactions, miners can opt to enable microblocks. Microblocks allow the current block leader to stream transactions
and include their state transitions in the current epoch.

If a block leader opts to produce microblocks, the next leader builds the chain tip off the last microblock that the
current leader produces.

The block streaming model is described in [SIP-001][].

[sip-001]: https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#operation-as-a-leader

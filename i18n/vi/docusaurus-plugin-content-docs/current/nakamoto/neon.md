---
title: Neon
description: How to get started with the Neon Nakamoto testnet
sidebar_label: Neon
sidebar_position: 6
---

Neon is the first controlled testnet release for Nakamoto and ships with two separate testnets, one with the previous Clarity VM and one with the upcoming Clarity WASM.

The primary purpose of these testnets is is performance benchmarking with the new consensus rules.

Both testnets allow users and developers to view and interact with Nakamoto block production, meaning each testnet has Nakamoto coinbase transactions, testable VRF, tenure change transactions, and multiple Stacks blocks per Bitcoin block.

Both testnets utilize Bitcoin Regtest and utilize a single miner, this is what is meant by "controlled" testnet. These testnets are producing blocks roughly every 5 seconds, which you can see reflected in the explorer.

If non of that makes any sense, be sure to check out the previous pages of this Nakamoto section.

Both testnets ship with functioning APIs and explorers to experiment with

## Controlled Testnet 1 (Clarity VM)

- [API](https://api.nakamoto-1.hiro.so/extended/v1/status)
- [Explorer](https://explorer.hiro.so/blocks?chain=testnet\&api=https://api.nakamoto-1.hiro.so)

## Controlled Testnet 2 (Clarity WASM)

- [API](https://api.nakamoto-2.hiro.so/extended/v1/status)
- [Explorer](https://explorer.hiro.so/blocks?chain=testnet\&api=https://api.nakamoto-2.hiro.so)

You can also use this [preview version of Clarinet](https://github.com/hirosystems/clarinet/releases/tag/nakamoto-preview-1) in order to test Clarity WASM in your local Devnet.

Further documentation on API endpoints and Stacks.js functions is forthcoming.

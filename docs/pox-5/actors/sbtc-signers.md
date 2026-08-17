---
description: >-
  Signers that provide and update the BTC address miners pay into for PoX-5
  rewards.
---

# sBTC Signers

[sBTC signers](../glossary.md#sbtc-signer-set) provide the BTC address that Stacks miners pay into for [PoX-5](../glossary.md#pox-pox-4-pox-5-pox-6) reward collection. That address is initialized at the [hard fork](../glossary.md#hard-fork-activation) and can later be updated by the sBTC signers without another hard fork, for example if the sBTC signing set changes.

They also matter because PoX-5 rewards default to [sBTC](../glossary.md#sbtc): miner BTC bids are routed into a smart contract, [auto-bridged](../glossary.md#auto-bridge-sbtc) to sBTC, and distributed [weekly](../glossary.md#weekly-rewards). Participants can opt out to receive L1 BTC, and the launch scope says that opt-out path routes through the sBTC signer set.

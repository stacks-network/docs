---
title: Microblocks
description: Guide to Stacks Microblocks
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

Microblocks represent a protocol-level feature that focuses on solving one technical difficulty: latency of transaction confirmations.

The [Proof-of-Transfer consensus mechanism](/understand-stacks/proof-of-transfer) anchors on Bitcoin blocks and is bound by the block production time (~ one block every 10 minutes). with microblocks, the Stack blockchain can continue to build up the chain in between Bitcoin blocks.

## Transaction states

![microblocks states](/images/microblock-states.png)

TODO: Describe the flow diagram

## Tradeoffs

Just like regular blocks, microblocks can be subject to re-organization. The processing order of transactions in microblocks can change based on how they were ultimately added to an anchor block.

> If your transaction relies on a state that could be altered by a previous transactions with serious implications, you should carefully evalute if microblocks should be used.

## Enabling microblocks

Transactions include an option to determin if they should be added to microblocks or regular anchor blocks: the [Anchor Mode](/understand-stacks/transactions#anchor-mode).

> Stacks miners have to enable microblock mining. Lern more on the [Mining overview])(/understand-stacks/mining#microblocks).

## Tooling support

### Stacks.js libraries

TODO: Setting the anchor mode

https://stacks-js-git-master-blockstack.vercel.app/enums/transactions.anchormode.html

### API

!> API support for microblocks is current being worked on. The details are subject to changes.

The Stacks Blockchain API exposes microblock details through several endpoints. Please review the [Stacks Blockchain API guide](/understand-stacks/stacks-blockchain-api#microblocks-support) for more details.

## Best practices

### Handling nonces

Nonce handling is more difficult with microblocks because the next nonce to be used relies on transactions included in microblocks, but potentially not yet mined. The Stacks Blockchain API [provides an endpoint](/stacks-blockchain-api#nonce-handling) to retrieve the possible next nonce.

### Dapps design guidelines

Microblock states should be cerfully communicated to end users. We are working on dapp design guidelines for developers. Stay tuned!

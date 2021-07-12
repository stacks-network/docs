---
title: Microblocks
description: Guide to Stacks Microblocks
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Introduction

Microblocks are a protocol-level feature of the Stacks blockchain that solve the technical challenge of transaction
latency. Because each Stacks block is anchored to a Bitcoin block through the [Proof-of-Transfer consensus mechanism][],
Stacks is necessarily limited to the same block times as the Bitcoin network. Microblocks allow the Stacks blockchain to
perform state transitions with a high degree of confidence between final settlements against Bitcoin.

Microblocks are a powerful mechanism for developers to create performant, high quality applications on Stacks, while
still inheriting the security of Bitcoin.

## Transaction states

The [Stacks block production model][] is described in SIP-001. The standard outlines the mechanism by which elected
block leaders can produce blocks on the Stacks blockchain either by batching transactions or by streaming them.
Microblocks are the product of the streaming model.

If a block leader has elected to mine microblocks, the leader selects transactions from the mempool and package them
into microblocks during the current epoch. Transactions included in microblocks don't achieve finality until they've
been confirmed by an anchor block, but can be assumed to be highly likely to achieve finality in the order in which the leader
packaged them.

In most blockchains, transactions can be re-ordered and chain history can be re-written with support from enough miners.
This allows a blockchain to recover from certain types of attacks, as miners can collectively agree to rewrite history
and omit malicious blocks. As more blocks are added on top of a block that includes a transaction, the likelihood of a
transaction being reordered decreases. For example, many exchanges wait until at least 3 Bitcoin blocks have been added
to report a transaction as fully confirmed (3 block confirmation). Microblocks provide between 0 block and 1 block
confirmation.

-> If a transaction is dependent on a chain state that could by altered by previous transactions with serious
implications, you should carefully consider whether it should be performed using microblocks.

## Enabling microblocks

Miners can choose to enable or disable microblocks in their mining configuration. As a best practice, miners should enable
microblock mining. When an application or user submits a transaction, the transaction can include an argument that
requires the transaction to be in a microblock, an anchor block, or in either.

### Transactions

Transactions include an option that controls if a miner should include them in microblocks or in anchor blocks. The
[anchor mode][] transaction option is an optional argument that controls whether a transaction must be included in
an anchor block or a microblock, or is eligible for either.

### Mining

Stacks miners must enable microblocks in their miner configuration to implement the block streaming model. For more
information, see [mining microblocks][].

## Developing with microblocks

Stacks allows you to choose how any transaction should be included on the blockchain by the miners. This flexibility
means you can submit transactions that require low latency processing for inclusion in microblocks, and require that
highly order-dependent transactions wait for anchor block finality.

### Stacks.js libraries

Stacks.js provides the [AnchorMode][] argument on transaction objects so that your application can set the microblocks
preference for transactions.

### API

!> API support for microblocks is a work-in-progress. Review the [API documentation][microblocks_api] carefully to
ensure that you are up-to-date on the latest implementation details for microblocks.

The Stacks Blockchain API exposes microblocks through several endpoints. Please review the
[Stacks Blockchain API guide][] for more details.

## Best practices

Working with microblocks is a design decision that you must make for your own application. When working with
microblocks, the following best practices are recommended.

### Handling nonce

Nonce handling with microblocks is challenging because the next account nonce must take into account any nonce values
included in microblocks, which may not yet be included in an anchor block. The Stacks Blockchain API
[provides an endpoint][] to retrieve the next nonce for a given principal.

### Application design

The state of microblock transactions should be carefully communicated to users. No transaction is final until it's
included in an anchor block, and your application design should reflect this.

[proof-of-transfer consensus mechanism]: /understand-stacks/proof-of-transfer
[stacks block production model]: https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#operation-as-a-leader
[mining microblocks]: /understand-stacks/mining#microblocks
[anchor mode]: /understand-stacks/transactions#anchor-mode
[anchormode]: https://stacks-js-git-master-blockstack.vercel.app/enums/transactions.anchormode.html
[stacks blockchain api guide]: /understand-stacks/stacks-blockchain-api#microblocks-support
[provides an endpoint]: /stacks-blockchain-api#nonce-handling
[microblocks_api]: https://stacks-blockchain-api-git-feat-microblocks-blockstack.vercel.app/#tag/Microblocks

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
perform state transitions between anchor blocks.

Microblocks are a powerful mechanism for developers to create performant, high quality applications on Stacks, while
still inheriting the security of Bitcoin.

## Transaction states

The [Stacks block production model][] is described in SIP-001. The standard outlines the mechanism by which elected
block leaders can produce blocks on the Stacks blockchain either by batching transactions or by streaming them.
Microblocks are the product of the streaming model.

If a block leader has elected to mine microblocks, the leader selects transactions from the mempool and package them
into microblocks during the current epoch. Microblocks are blocks of transactions included by a miner after the previous
anchor block has been mined, but before the next block is selected. Transactions included in microblocks are processed by
the network: their results are known.

Consider a transaction from the perspective of the number of block confirmations it has. A transaction included in a
microblock might have the following example lifecycle:

```
Transaction 1 is broadcast to the mempool. It has 0 confirmations.
Transaction 1 is included in a microblock. It still has 0 confirmations, but the results of the transaction are known
Transaction 1 is included in the next anchor block. It has 1 confirmation.
The next Stacks block confirms the previous block. Transaction 1 has 2 confirmations.
The next Stacks block confirms the previous block. Transaction 1 has 3 confirmations.
...
```

Consider a similar transaction that is not included in a microblock:

```
Transaction 2 is broadcast to the mempool. It has 0 confirmations.
Transaction 2 is included in the next anchor block. It has 1 confirmation.
The next Stacks block confirms the previous block. Transaction 2 has 2 confirmations.
The next Stacks block confirms the previous block. Transaction 2 has 3 confirmations.
```

The lifecycles of the two transactions are similar, but the difference is pending state. Many Bitcoin wallets display
0-confirmation balances: your wallet balance with any mempool transactions already applied. This is useful because it
tells you when you've sent a transaction or received one. With smart contracts, displaying pending state is not as
straightforward, because smart contracts do not just transfer inputs to outputs, they may call other contracts, emit
events, or perform other computations. A transaction processed in a microblock generates all that information.

-> If a transaction is dependent on a chain state that could by altered by previous transactions with serious
implications, you should carefully consider whether it should be performed using microblocks.

## Enabling microblocks

Miners can choose to enable or disable microblocks in their mining configuration. As a best practice, miners should enable
microblock mining. When an application or user submits a transaction, the transaction can include an argument that
requires the transaction to be in a microblock, an anchor block, or in either.

### Transactions

Transactions include an option that controls if a miner should include them in microblocks or in anchor blocks. The
anchor mode transaction option is an optional argument that controls whether a transaction must be included in
an anchor block or a microblock, or is eligible for either.

### Mining

Stacks miners must enable microblocks in their miner configuration to implement the block streaming model. For more
information, see [mining microblocks][].

## Developing with microblocks

In most cases, information from transactions included in microblocks should be treated like information from any other
block. Wallets and explorers should display the consequences of microblock transactions as the current state of the
network. This state should be acknowledged as tentative.

A microblock transaction can end up being reorganized in the next block rather than just being confirmed as-is. Because
of this, your UI should communicate to users if the outputs of a transaction changed, or if the transaction's associated
block changed. This is the same outcome as if a 1-block fork occurred.

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

The following guidelines are provided as an initial set of best practices for UI design when incorporating microblocks
into your application.

#### Explorers

Display pending state, but warn that a transaction is still pending. Indicate visually that displayed balances depend
on pending state.

#### Wallets

Display pending state, but warn that a transaction is still pending. Indicate visually that displayed balances depend
on pending state.

#### Exchanges

Continue to count confirmations, microblocks should be considered pending.

#### Applications

Microblock communication is highly app-dependent. For some applications, displaying a pending or 0-confirmation
transaction as confirmed may be fine. For example, storing data on the chain, or querying the BNS contract. For other
applications, such as the transfer of real value, waiting for 3-confirmations would be prudent before displaying the
state as confirmed.

[proof-of-transfer consensus mechanism]: /understand-stacks/proof-of-transfer
[stacks block production model]: https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#operation-as-a-leader
[mining microblocks]: /understand-stacks/mining#microblocks
[anchormode]: https://stacks-js-git-master-blockstack.vercel.app/enums/transactions.anchormode.html
[stacks blockchain api guide]: https://docs.hiro.so/get-started/stacks-blockchain-api#microblocks-support
[provides an endpoint]: https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling
[microblocks_api]: https://docs.hiro.so/api#tag/Microblocks

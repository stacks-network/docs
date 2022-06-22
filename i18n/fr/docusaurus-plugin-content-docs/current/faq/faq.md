---
title: General FAQs
description: Frequently Asked Questions
sidebar_label: "FAQ"
sidebar_position: 8
---

![](/img/glasses.png)

## Why is my transfer still pending?

Commonly it's because your fee is too low or your [nonce](#what-is-nonce) is incorrect.

More information can be found [here](https://www.hiro.so/wallet-faq/why-is-my-stacks-transaction-pending). There are also [best practices and known issues](https://forum.stacks.org/t/transactions-in-mempool-best-practices-and-known-issues/11659) and [diagnosing pending transactions](https://forum.stacks.org/t/diagnosing-pending-transactions/11908).

There is also this [script](https://github.com/citycoins/scripts/blob/main/getnetworkstatus.js) to look at either the first 200 transactions or all the transactions in the mempool, to then return the maximum adn average fee values. We've noticed that using 1.5-2x the average fee in the mempool will generally get things processed within 6-10 blocks even during high congestion.

There is also this [script](https://github.com/citycoins/scripts/blob/main/gettxstatus.js) to track a pending transaction until it reaches a final status.

## What is Nonce?

A nonce is used to make sure that every transaction goes in right order. Nonce starts at 0, so the very first transaction from an address should set to nonce=0. You can find the nonce of your wallet address by searching the address in any [Stacks blockchain explorer](https://explorer.stacks.co/). You can also user `$ stx balance <address>`.

If you have a transaction nonce that is less than your account nonce, the transaction is unmineable and will (should) disappear after 256 blocks. This does not affect future transactions and therefore can be just ignored, they are in the past.

If you have a transaction nonce that is equal to your account nonce, then that transaction is valid and should be the next in line to be processed next.

If you have a transaction nonce that is higher than your account nonce, then there needs to be a chain of transactions starting with your account nonce in order for it to be processed. E.g. Your account nonce is 10 but the pending transaction has a nonce of 12. It will not be mineable until a transaction with nonces 10 and 11 are processed.

## Whats a Replace-by-fee (RBF)?

A replace-by-fee (RBF) transaction tells the blockchain that you would like to replace one transaction with another, while specifying a fee that is higher than the original transaction fee. A transaction can be replaced with **any other transaction**, and is not limited to the same operation.

This can be used to effectively **cancel a transaction** by replacing it with something else, like a small STX transfer to another owned address.

This can be used to **raise the fee for a pending transaction** so it is considered by miners during periods of high congestion. This can also be used to _resubmit_ a transaction, in the sense that the RBF transaction gets a new txid and gets considered again (or faster) by miners. E.g. I submit my transaction with 1 STX fee at block 54,123. By block 54,133 I see my tx hasn’t been picked up, so I RBF with 1.1 STX. Then wait 10 blocks again, and RBF again if not received. There’s a balance between doing this too often and keeping a consistent pace, but it has been seen to help get transactions through, especially when new ones are constantly flooding in.

The replacement transaction needs to use the same nonce as the original transaction with a fee increase of at least 0.000001 STX. E.g. Your original transaction has a fee of 0.03 STX, the new RBF transaction must have a fee of 0.030001 STX or above.

RBF transactions process in one of two ways:

- If miners pick up the original transaction before the RBF transaction is received, then the original transaction is processed and the replacement transaction goes into an unmineable state. It will eventually disappear and doesn’t affect future transactions.
- If miners pick up the replaced transaction then the new transaction is processed instead of the original, and the status of the original transaction is set to “droppped_replaced_by_fee”. This status is not shown on the explorer but can be seen when querying the txid.

Submitting multiple transactions for the same action can slow things down in a few ways.

- If the total spent in 2 or 3 transactions is more than can be spent in a single transaction, the transactions appear unmineable.
- If the fees for multiple transactions exceed the STX balance, the transactions will be unmineable.

## What are .btc domains?

[This forum post](https://forum.stacks.org/t/btc-domains-are-live/12065) explains all the benefits of .btc domains. They can currently be purchased in [btc.us](https://btc.us/)

## What is the blockchain trilemma?

## Stacks vs. Solana vs. Polygon: How Do They Compare From a Developer Perspective?

[This blog post answers the question](https://www.hiro.so/blog/stacks-vs-solana-vs-polygon-how-do-they-compare-from-a-developer-perspective).

## What Does Lightning’s Taro Proposal Mean for Stacks?

[This blog post answers the question](https://www.hiro.so/blog/what-does-lightnings-taro-proposal-mean-for-stacks).


## Is Stacks a [PoS chain](https://en.wikipedia.org/wiki/Proof_of_stake)?[¹][]

No.

The act of block production requires an extrinsic expenditure — it is not tied to owning the native token, as would be required in PoS. The only way to produce blocks in the Stacks chain is to transfer Bitcoin to a predetermined randomized list of Bitcoin addresses. Moreover, the Stacks blockchain can fork, and there exists a protocol to rank forks by quality independent of the set of miners and the tokens they hold. These two properties further distinguish it from PoS chains, which cannot fork due to the inability to identify a canonical fork without trusting a 3rd party to decree a particular fork as valid. The ability to fork allows the Stacks blockchain to survive failure modes that would crash a PoS chain.

## Is Stacks a [sidechain](https://en.bitcoin.it/wiki/Sidechain)?[¹][]

No.

For two key reasons.

First, the history of all Stacks blocks produced is recorded to Bitcoin. This means that the act of producing a private Stacks fork is at least as hard as reorging the Bitcoin chain. This in turn makes it so attacks on the chain that rely on creating private forks (such as selfish mining and double-spending) are much harder to carry out profitably, since all honest participants can see the attack coming before it happens and have a chance to apply countermeasures. Sidechains offer no such security benefit.

Second, the Stacks blockchain has its own token; it does not represent pegged Bitcoin. This means that the safety of the canonical fork of the Stacks blockchain is underpinned by its entire token economy’s value, whereas the safety of a sidechain’s canonical fork is underpinned only by whatever system-specific measures incentivize its validators to produce blocks honestly, or the Bitcoin miners’ willingness to process peg-in requests (whichever is the weaker guarantee).


## Is Stacks a [layer-2 system](https://academy.binance.com/en/glossary/layer-2) for Bitcoin?[¹][]

No.

Stacks blockchain is a layer-1 blockchain, which uses a novel and unique mining protocol called proof-of-transfer (PoX). A PoX blockchain runs in parallel to another blockchain (Bitcoin in Stacks’ case), which it uses as a reliable broadcast medium for its block headers. It's a sovereign system in its own right. The Stacks blockchain state is distinct from Bitcoin, and is wholly maintained by and for Stacks nodes. Stacks transactions are separate from Bitcoin transactions. Layer-2 systems like Lightning are designed to help scale Bitcoin payment transactions, whereas Stacks is designed to bring new use-cases to Bitcoin through smart contracts. Stacks is not designed as a Bitcoin layer-2 scalability solution.


## Is Stacks a [merged-mined chain](https://en.bitcoin.it/wiki/Merged_mining_specification)?[¹][]

No.

The only block producers on the Stacks chain are Stacks miners. Bitcoin miners do not participate in Stacks block validation, and do not claim Stacks block rewards. Moreover, Stacks is not a [blind merged-mined chain](https://github.com/bitcoin/bips/blob/master/bip-0301.mediawiki), because STX block winners are public and randomly chosen (instead of highest-bid-wins), and its tokens are minted according to a schedule that is independent of the degree of miner commitment or Bitcoin transferred (instead of minted only by one-way pegs from Bitcoin). This ensures that Stacks is able to make forward progress without opt-in from Bitcoin miners, and it ensures that Stacks miners are adequately compensated for keeping the system alive regardless of transaction volume.

## Whats the difference between Stacks and Ethereum?[²][]
**Computation and Storage** Stacks does all computation and storage outside of the blockchain, and uses the blockchain only as a “shared source of truth” between clients. By contrast, Ethereum does all computation and most application storage in the blockchain itself. Like Ethereum, if two Stacks nodes see the same underlying blockchain, they will independently run the same computations and produce the same state. Unlike Ethereum, there is no Stacks-specific blockchain.

**Programming Language and Tooling** Stacks’s programming model is based on running off-chain programs. These programs can be written and debugged in any language you want. By contrast, Ethereum’s programming model is based on running on-chain “smart contracts.” These are written and debugged with a whole new set of tools, like Solidity and Serpent. These are written and debugged with a whole new set of tools, like Solidity and Serpent.

**Scalability of On-chain Computation** Stacks is designed around a “virtual chain” concept, where nodes only need to reach consensus on the shared “virtual chain” they’re interested in. Virtual chains do not interact with one another, and a single blockchain can host many virtual chains. Although Stacks’s specific virtual chain is not Turing-complete (i.e. it’s a list of instructions to build the name database), it is possible to create Turing-complete virtual chains like Ethereum. These virtual chains can live in any blockchain for which there exists a driver, and virtual chain clients only need to execute their virtual chain transactions (i.e. Stacks only processes Stacks virtual chain transactions).

By contrast, because smart contracts run on-chain and can call one another, all Ethereum nodes need to process all smart contracts’ computations in order to reach consensus. This can get expensive as the number of running smart contracts grow, which takes the form of gas fee increases.

**Scalability of Off-chain Computation** Stacks applications are very similar to Web applications today and almost never need to interact with the blockchain. For most Stacks applications, the blockchain is only used to authenticate the application’s code and data before the user runs it. By contrast, Ethereum applications usually require an application-specific smart contract, and must interact with the blockchain to carry out its operations.


[¹]: https://stacks.org/stacks-blockchain
[²]: https://forum.stacks.org/t/what-is-the-difference-between-blockstack-and-ethereum/781

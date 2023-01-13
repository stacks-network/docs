---
title: Bitcoin Connection
description: How Stacks is connected to Bitcoin
sidebar_position: 3
---

At the very beginning of these docs, we described Stacks as bringing smart contract functionality to Bitcoin, without modifying Bitcoin itself.

That's a big promise, but how does Stacks actually deliver on it? And what makes Stacks unique among other Bitcoin layers and other blockchains like Ethereum?

Before we get into the technical details of how Stacks works, it's important to get a high-level overview of the problem its solving and how it actually does that. We'll dive deeper into some of these topics as we go through Stacks Academy, but it's good to get a high-level picture to bring everything together.

This topic is a bit of a rabbit hole, and this section of Stacks Academy is pretty long, but it will give you an in-depth understanding of exactly the problem Stacks is looking to solve, and how it solves it.

Let's get into it.

## Stacks Among Other Bitcoin Layers

In the [last section](./what-is-stacks.md) we covered what Stacks actually is and what problem it is solving, but this is not a new problem. The Bitcoin write problem has been a bit of a holy grail problem in the crypto world for a while now.

Bitcoin is the OG cryptocurrency and has the largest market cap, but it also some of the least functionality, which means if we want to make it a productive asset and use it to build a decentralized economy, we need to take a layered approach and let Bitcoin do what it does best, while creating additional layers on top of it to add functionality.

So how does Stacks compare to some of the other approaches to layering on top of Bitcoin?

### Lightning

Lightning is probably the most well-known Bitcoin layer, and is primarily designed to address scalability issues. Lightning functions as a separate P2P network from Bitcoin, allowing participants to conduct move their BTC from the main chain to Lightning, conduct multiple transactions on Lightning, and then send the final result to the BTC chain where it is finalized.

This is actually a completely separate problem from what Stacks is trying to address. Where Lightning takes the existing functionality of Bitcoin and makes it much more scalable, Stacks is seeking to expand Bitcoin's functionality to do things you can't do now.

Crucially, Lightning is ephemeral, meaning it has no state management. There is no continuous record of what has happened on the Lightning network, only current channels. Once users close their channel and their transactions are written back to the Bitcoin chain, they are gone.

A key component of full-expressive smart contracts is that they maintain a permanent historical record of all transactions that have happened on the chain.

Bitcoin does this now, but its scripting language is very limited. So where Lightning seeks to make existing Bitcoin functionality happen faster, Stacks seeks to add new functionality.

### RSK

Like Stacks, [RSK](https://www.rsk.co/) seeks to add additional functionality to Bitcoin, but it goes about that process differently than Stacks.

RSK is a merge-mined chain, meaning that it is mined concurrently with Bitcoin. Stacks has its own miners and mining process, and its own economic value and security that is a function of that token value, more on this below.

There are multiple perspectives to look at this from. Because RSK is merge-mined, Bitcoin miners are also the ones mining RSK blocks, and RSK does not have its own token.

RSK can only exist with opt-in from Bitcoin miners and mining rewards are highly dependent on transaction volume.

This also opens up a wider discussion on the costs and benefits of having a separate token, which we'll get into below.

RSK is also EVM-compatible, where Stacks uses Clarity and the Clarity VM.

### Liquid

[Liquid](https://liquid.net/) is a federated network focused on unlocking more advanced financial capabilities with Bitcoin. Being federated, Liquid is not an open network, and thus not decentralized.

The Liquid consensus mechanism is managed by 15 functionaries, who handle the transaction processing and validating. Liquid also does not support general-purpose applications, but is solely focused on financial applications.

This was a brief overview of these other Bitcoin projects, for another perspective, Hiro wrote an [excellent post](https://www.hiro.so/blog/building-on-bitcoin-project-comparison) comparing Stacks with other Bitcoin projects.

## Why Does Stacks Need a Token?

This brings us to a central philosophical conversation in the world of crypto and Bitcoin, whether or not blockchains need tokens.

Let's start by looking at the fundamental reason why tokens exist: to fund the maintenance and forward progress of a blockchain.

Bitcoin is a token. It is a cryptocurrency that is used to incentivize miners to add new blocks to the chain. In Bitcoin's case, mining rewards are set on a predefined schedule, and once those mining rewards run out, the chain will need to survive on transaction fees alone.

The purpose of a blockchain is to have a permanent historical record of every transaction that has ever occurred on the chain. Blockchains are basically ledgers. The token aspect is used as an incentive mechanism to secure the chain.

This is why networks like Lightning and other P2P networks don't need tokens, they don't need to maintain a historical record. When we are talking about a system that is supposed to maintain a global financial system, it is important for the maintenance of that system to be incentivized correctly.

Let's look at this concept in the context of Stacks and its goals. Stacks seeks to provide smart contract functionality to Bitcoin, to serve as the programming rails for building a decentralized economy on top of Bitcoin.

But because it has its own execution environment and smart contract state to maintain, it needs a token to incentivize maintenance of the network.

But it goes further than that. It is possible to build a system like this without a token using something like merge-mining or a sidechain, but then we lose out on the additional benefit of having the chain state's safety underpinned by its entire token economy's value.

In the case of Stacks, the safety and liveness of the chain are underpinned by this value, and the stacking mechanism incentivizes network members to increase this value.

From Jude Nelson, Stacks core developer:

"How hard is it to cause a safety failure (i.e. a double-spend via a reorg) on just the canonical Stacks chain fork? Anyone can become a miner by spending BTC, so without loss of generality, reverting the last block on the canonical chain is at least as hard in expectation as spending more BTC than the rest of the miners combined for that block. Because each Bitcoin block selects at most one Stacks block, the act of reorging the canonical Stacks chain back N blocks is the act of winning at least N + 1 blocks built off of a common ancestor that is N blocks deep. This is a lower bound on the number of Bitcoin blocks mined during which a reorg needs to take place — in practice, honest miners will keep working on the canonical chain, and will win some Stacks blocks of their own, which in turn increases the number of Stacks blocks the reorging miners must win.

How costly is it to carry out a reorg of N blocks? It’s a function of how valuable STX is relative to BTC — the more valuable STX are, the more BTC honest miners are committing to mining (this has borne out in practice), and thus the more BTC a reorging miner must commit. Therefore, the cost of a reorg is a function of the value of STX.

This is similar to the economic security of a PoW blockchain. Like in PoW, each fork of the Stacks chain has its own independent “security budget” — an attacker must out-spend the security budget to carry out a reorg, and the security budget is a function of the block rewards. In PoX, the only difference is that the miners spend another blockchain’s tokens (BTC in Stacks’ case) instead of energy. Therefore, Stacks can’t be a sidechain, a drivechain, or a merge-mined chain, because none of these other systems’ security budgets are a function of their tokens’ worth. Sidechains, drivechains, and merged-mined chains all rely on external miners for their safety, since their safety is guaranteed in part by external miners validating their blocks. The onus on these systems is to get external miners to care enough to do so, and in the case of sidechains, drivechains, and blind merged-mined chains, there is an additional onus to encourage their nodes to mine blocks at all (since there is no on-chain reward for them to earn by doing so). By contrast, disinterested Bitcoin miners neither assist nor prevent a reorg in PoX — they only record the history of all Stacks forks.

PoX offers two additional, unique security properties on top of PoW. First, no matter how much BTC a reorging miner can commit, the act of executing a reorg is going to be time-consuming. Unless the attacker can attack the Bitcoin chain itself by quickly producing a better Bitcoin fork, a reorging miner must sustain the attack for at least N + 1 Bitcoin blocks. This gives honest miners and users ample time to notice and react to the reorg attempt.

Second, the history of block production in all Stacks forks is embedded within Bitcoin. This allows the system to leverage Bitcoin’s security budget in order to ensure that all forks are public. This is because the act of producing a hidden Stacks fork, where the fork’s block hashes are not known to the honest miners, is the act of producing a hidden canonical Bitcoin fork. Therefore, the act of producing a hidden Stacks fork is at least as hard as reorging the Bitcoin chain. A PoX chain leverages this property not to prevent reorgs, but to make reorgs unprofitable.

By anchoring blocks to an existing blockchain, a PoX chain forces reorgs to happen out in the open, thereby giving advance warning to all honest network participants when they happen. Honest miners, users, and exchanges will see the PoX transactions for reorg attempts on the existing blockchain, and adapt their behaviors accordingly: honest miners will increase their commitments, and users and exchanges will require more confirmations for transactions. This makes the act of carrying out a reorg while also making a profit much more challenging, since malicious reorgs — like selfish mining and double-spending — rely on secrecy to work effectively. Specific to Stacks, miners are additionally required to mine for a “warm-up” period of two blocks, during which they must spend BTC at their target commit levels but will not win any Stacks blocks. So, a high-budget reorg attempt will not only be costly, but will also alert the rest of the network before the damage is done."

- [What Kind of Blockchain is Stacks?](https://stacks.org/stacks-blockchain)

## The Symbiotic Relationship Between Stacks and Bitcoin

Stacks and Bitcoin complement each other. Stacks leverages the extreme decentralization of Bitcoin, its PoW consensus mechanism, and its value as a cryptocurrency.

But Stacks also complements Bitcoin by unlocking additional use cases, thereby increasing its value over time. This also helps to solve the additional problem of the future maintainability of Bitcoin after the coinbase rewards are gone and Bitcoin has to function on transaction fees alone.

If Bitcoin is seen as only a store of value, the economic density, meaning how much value is being exchanged, of each transaction will be minimal. But if Bitcoin is the underlying foundation for an entire decentralized economy, those [transactions become much more valuable](https://twitter.com/muneeb/status/1506976317618728963), increasing transaction fees. This is a crucial incentive for miners to continue securing the network as coinbase rewards drop.

<!-- ## Stacks and Bitcoin Finality

Write this section after going through the new whitepapers.

Right now, Stacks is connected through Bitcoin only by Stacks recording the history of its blocks to the Bitcoin chain. While this does come with major security benefits, the coupling of Stacks with Bitcoin should be closer to be truly considered a Bitcoin smart contract layer.

We cover [Proof of Transfer](https://twitter.com/muneeb/status/1506976317618728963) in an upcoming section, but let's take a look at the proposed Nakamoto Release of Stacks, which increases the connection between Stacks and Bitcoin. -->

## Reading from and Writing to Bitcoin

One of the things that gives the Stacks chain its superpowers in connecting with Bitcoin is not only how it connects to Bitcoin at a protocol level, discussed above, but also how we can utilize that Bitcoin at a programmatic level.

That's where [Clarity](../clarity/) comes in. Clarity is the smart contract language for Stacks, and is how we actually build out a lot of the functionality we are talking about here.

### How Does Clarity Read BTC State?

One of the often-touted features of Clarity is that it has access to the state of the Bitcoin chain built in, but how does it actually do that? Because of Stacks' [PoX mechanism](../stacks-academy/proof-of-transfer.md), every Stacks block is connected to a Bitcoin block, and can query Bitcoin block header hashes with the [`get-burn-block-info?` function](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#new-method-get-burn-block-info).

This function allows us to pass in a Bitcoin block height and get back the header hash. The [`burn-block-height` Clarity keyword](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-keywords#burn-block-height) will give us the current block height of the Bitcoin chain.

However, `get-burn-block-info?` only returns data of the Bitcoin block at that height if it has already been processed and was created after the launch of the Stacks chain. So if we want to evaluate whether or not something happened on Bitcoin, we have to wait at least one block later to do so.

This is step 1 of Clarity contracts being able to serve as the programming layer for Bitcoin, when a BTC transaction is initiated, the first thing that needs to happen is that a Clarity contract needs to become aware of it. This can happen manually by utilizing Clarity functions discussed above with the [BTC library](https://explorer.stacks.co/txid/0x8b112f2b50c1fa864997b7496aaad1e3940700309a3fdcc6c07f1c6f8b9cfb7b?chain=mainnet), as [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html) do.

:::tip
Note that this process is made easier by the additional Clarity functions added in 2.1, like the `get-burn-block-info?` function we looked at above.
:::

Or we can automate (albeit at a cost of some centralization in our dapp) using an event-based architecture using something like Hiro's [chainhooks](https://www.hiro.so/blog/meet-4-new-features-in-clarinet#setting-up-trigger-actions-with-chainhooks), which will allow us to automatically trigger a Clarity contract call when a certain BTC transaction is initiated.

This is the first component of using Stacks to build Bitcoin dapps, the read access to Bitcoin chain.

### Can Clarity Write to BTC?

But how can Stacks actually write to the Bitcoin chain? This has been somewhat of a holy grail problem in the Bitcoin and crypto world for years now, as it solves a difficult dilemma.

On one hand, Bitcoin write functionality from more expressive smart contract chains allows for us to take the latent capital of Bitcoin and utilize it to build a Bitcoin-based economy.

Bitcoin has a market cap of more than double that of Ethereum's, but has an almost non-existent app ecosystem because of this write problem. There is a massive market opportunity here for both developers and entrepreneurs if we are able to build decentralized applications that have a rival programming capacity to other chains like Ethereum.

But the tradeoff here is that allowing this on the Bitcoin chain opens up a lot of new attack vectors and undermines a core tenet of Bitcoin: the fact that it is very simple and very good at doing what it does.

Vitalik originally wanted to add functionality to Bitcoin, and created Ethereum when that didn't work. There's good reason for this. Allowing additional functionality like this exposes Bitcoin to more risk and attack vectors, this conundrum is what Stacks seeks to solve with sBTC. How can we achieve the same functionality as Ethereum but keep the security of Bitcoin?

One possible route is by separating the programming and money layers, as Stacks and a few other chains do. While Stacks is a good chunk of the way towards this goal right now, due to the [PoX mechanism](../stacks-academy/proof-of-transfer.md), there is still some work to be done before it can be considered a Bitcoin programming layer.

Specifically, it needs a tighter connection to the Bitcoin chain than PoX currently provides, and needs to share complete finality with Bitcoin.

Second, it needs a completely trustless, decentralized two-way peg between the Stacks chain and Bitcoin, so that end users only have to send Bitcoin to an address, have things happen on the Stacks side, and have Bitcoin returned to them.

These issues are currently being addressed with sBTC and the Stacks Nakamoto Release, both of which you can [read about on Stacks' website](https://www.stacks.co/learn/sbtc).

## Bitcoin-First Applications in the Wild

Putting all of this information together we can begin to see how we might build applications that are Bitcoin-first. The ultimate goal of Stacks is to serve as an invisible programming layer for Bitcoin, where STX operates primarily as a gas token to operate the Stacks network, but users only ever have to interact with it using their Bitcoin wallet.

One of the most interesting projects currently taking advantage of this functionality is Zest, which uses a protocol called Magic under the hood to trustlessly swap BTC on the Bitcoin chain for xBTC on the Stacks chain. Zest is a protocol for decentralized borrowing and lending with Bitcoin.

Here are the basics of how it works:

1. First, Zest generates a unique [HTLC](https://en.bitcoin.it/wiki/Hash_Time_Locked_Contracts) Bitcoin address for liquidity providers to deposit their BTC to, this uses [Magic Protocol](https://www.magic.fun/) under the hood, which allows users to trustlessly swap BTC for xBTC.

2. After LP (liquidity provider) sends funds to the HTLC address and the block is confirmed, the payment is considered in escrow.

3. Now Stacks comes in by reading the Bitcoin state and verifying that deposit actually occurred on the BTC chain, and escrows the corresponding amount of xBTC if it did. If for some reason that were to fail, the LP is still in control of their BTC funds

4. Once that escrow is confirmed, LP signs a Stacks transaction that transfers control of the BTC over to Magic, at which point Magic controls the BTC and xBTC is transferred to the Zest liquidity pool. Zest tokens are then minted on the Stacks chain, representing a claim token for the LP's BTC funds

The cool thing is that this all happens in a single Stacks block, because Stacks and Bitcoin blocks are completed in lockstep. For more details on how Magic handles this process we highly recommend [checking out their docs](https://magicstx.gitbook.io/magic-protocol/guides/technical-overview).

To dive deeper into the details of how Zest is building a Bitcoin-first application, [check out their docs](https://zestprotocol.gitbook.io/zest/what-is-zest-protocol/the-technology-under-the-hood), and if you are interested in building something like this out for yourself, check out their smart contracts.

## How to Build Bitcoin-First Dapps with Stacks

We are currently working on a Stacks Cookbook, which will provide numerous examples for how to build Bitcoin-first apps using both Clarity and frontend Stacks and Bitcoin libraries.

Until then, you can take a look at Magic and Zest, the protocols mentioned above, to see how they are going about facilitating this process using xBTC and model your applications after them.

We are in the very early stages of being able to unlock and use BTC in decentralized applications, and much more content and tools will be created in the coming year to make this process easier for developers.

## What's Next?

As mentioned earlier on this page, xBTC is not an ideal solution. xBTC is a custodial solution run by [Wrapped](https://wrapped.com/). It does however, give us the building blocks we need to begin building Bitcoin-first applications with Stacks. And updates from Stacks 2.1 make it easier to perform these actions.

With sBTC on its way, we'll begin to see a new batch of innovative projects that are able to build truly trustless, decentralized dapps with Bitcoin.

Here are some resources to dive into to learn more about improvements coming to Stacks via the 2.1 upgrade, Nakamoto release, and sBTC.

- [List of New Clarity Functions for 2.1](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#clarity)
- [How the Stacks 2.1 Transition Impacts Stacking](https://www.hiro.so/blog/how-the-stacks-2-1-transition-impacts-stacking)
- [Developer's Guide to Stacks 2.1](https://www.hiro.so/blog/a-developers-guide-to-stacks-2-1)
- [Learn About sBTC](https://www.stacks.co/learn/sbtc)
- [Stacks Nakamoto Release](https://stx.is/nakamoto)

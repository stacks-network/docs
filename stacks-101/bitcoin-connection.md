# Bitcoin Connection

At the very beginning of these docs, we described Stacks as bringing smart contract functionality to Bitcoin, without modifying Bitcoin itself.

That's a big promise, but how does Stacks actually deliver on it? And what makes Stacks unique among other Bitcoin layers and other blockchains like Ethereum?

Before we get into the technical details of how Stacks works, it's important to get a high-level overview of the problem its solving and how it actually does that. We'll dive deeper into some of these topics as we go through Stacks Academy, but it's good to get a high-level picture to bring everything together.

This topic is a bit of a rabbit hole, and this section of Stacks Academy is pretty long, but it will give you an in-depth understanding of exactly the problem Stacks is looking to solve, and how it solves it.

Let's get into it.

### Is Stacks a Bitcoin L2?

Stacks is a Bitcoin layer for smart contracts. The classification as a layer-1 (L1) or layer-2 (L2) or sidechain really depends on the definition used. With that said, generally speaking L1 chains are sovereign meaning that (a) they have their own security budget, and (b) they can survive without the need for any other L1 chain. L2 chains typically do not have their own security budget and share the security of the underlying L1 chain, and they cannot live without the underlying L1 chain.

The initial release of Stacks in early 2021 had a separate security budget from Bitcoin L1. Even though the Stacks layer could not function without Bitcoin L1, the developers working on the project described it as a different system that does not fit neatly into existing classifications, sometimes using the term layer 1.5 (see [this Decrypt article](https://decrypt.co/82019/bitcoin-defi-thing-says-stacks-founder-muneeb-ali) for example).

The upcoming planned release of Stacks, called the Nakamoto release (convention to use names of famous Computer Scientists for major releases), will no longer have a separate security budget from Bitcoin. Instead, a 100% of Bitcoin hashpower will determine finality on Stacks layer. After the next upgrade, to reorg Stacks blocks/transactions the attacker will need to reorg Bitcoin L1 itself (which is very hard to do and therefore a great security property for a Bitcoin layer to have). More details in the [Stacks paper](https://stacks.co/stacks.pdf).

The definition of [L2 used in Ethereum](https://ethereum.org/en/layer-2/) and other newer ecosystems is different and focuses on the ability to withdraw assets using only L1 security and L1 miners. According to that definition Stacks layer is not a clear L2, given the set of peg-out signers determine if users can withdraw sBTC. Bitcoin cannot support such verification without changes to Bitcoin L1 (which may happen in the future). The Ethereum L2 definition also does not apply that cleanly to Bitcoin L2s, given new assets are issued on L2s when it comes to Bitcoin and not issued on L1 (only BTC is the L1 asset). Therefore, using the definition of security of withdrawing assets is not directly applicable given assets are defined and used on L2s and not withdrawn out to Bitcoin L1 anyway (with the exception of BTC itself). Rather, what becomes more important is "settlement on Bitcoin" i.e., is contract data and state secured by 100% of Bitcoin's hashpower or not.

Users and developers organically call Stacks a Bitcoin L2, since it is a simpler concept to understand. There are certain properties of Stacks layer that also help the concept of Stacks as a Bitcoin L2:

1. Bitcoin finality, as discussed above, where 100% of the Bitcoin hashpower decides block ordering and transaction finality.
2. Stacks consensus runs on Bitcoin L1, and Stacks L2 cannot operate or survive without Bitcoin L1.
3. With the upcoming decentralized Bitcoin peg, called sBTC (see [sBTC paper](https://stacks.co/sbtc.pdf)), most of economy on Stacks layer will likely use BTC as the unit of economy. It is expected that most users will simply use Bitcoin in wallets and apps and then peg out their BTC to Bitcoin L1.
4. All data and transactions on Stacks are automatically hashed and permanently stored on Bitcoin L1 on every Bitcoin block. Anyone can verify that some data on Stacks is valid by checking the corresponding hash on Bitcoin L1. This compact storage of hashes on L1 is somewhat similar to rollups (although there are other differences).
5. Contracts on Stacks layer can read Bitcoin L1 transactions and respond to them. Assets on Stacks layer can be moved simply through Bitcoin L1 transactions.

Given all the details above, why would some people think that Stacks is not a Bitcoin L2? There are a couple of reasons why this question comes up often:

1. The initial version of Stacks (released early 2021) had a separate security budget which changed to following 100% Bitcoin hashpower with the Nakamoto release. There is old material and blog posts floating around that still talk about the initial Stacks version. The old materials will likely get updated with time.
2. According to the Ethereum definition of L2s a user should be able to withdraw their base-layer assets purely by doing a L1 transaction and relying only on L1 security (this is true for Lightning for example). This definition does not apply cleanly to Bitcoin L2s because assets are not defined at Bitcoin L1 but are defined in L2s instead. The only asset where this matters is the pegged BTC asset from Bitcoin L1, given all other assets are native to L2s anyway. In the upcoming Stacks release, users can withdraw their BTC by sending just a Bitcoin L1 transaction but Bitcoin L1 cannot validate that complex transaction and a majority of peg-out signers will need to sign on the peg-out request. In an ideal world Bitcoin miners can validate such transactions but that would require a change to Bitcoin L1. Therefore, Stacks design optimizes for a method that is decentralized and can be deployed without any changes to Bitcoin L1. If in the future it is possible to make changes to Bitcoin L1 then Stacks layer security can benefit from that as well.
3. Bitcoin community members are generally skeptical of claims and on a look out for people making any false marketing claims. This is generally a healthy thing for the Bitcoin ecosystem and builds up the immune system. Some such community members might be skeptical about Stacks as a Bitcoin layer or L2 until they fully read the technical details and reasoning. There is a good [Twitter thread](https://twitter.com/lopp/status/1623756872976158722?s=20) about his topic as well.

Why don't we use the term 'sidechain' for Stacks then? Sidechains in Bitcoin typically have a different security budget from Bitcoin L1, typically as a subset of Bitcoin miners who participate in the sidechain (they don't follow 100% Bitcoin finality), their consensus runs on the sidechain (vs running on Bitcoin L1), and they don't publish their data/hashes on Bitcoin L1. The Stacks layer does not fit that definition cleanly given the consensus runs on Bitcoin L1, it follows Bitcoin finality, and publishes data/hashes on L1.

The TLDR is that it is better to refer to Stacks as a Bitcoin layer (the more generic term). However, the Bitcoin L2 term is more organic and simpler for users and we'll likely keep seeing the use of it. If the Bitcoin L2 term comes up then it's important to understand the technical differences and that unlike Ethereum L2s withdrawing BTC from Stacks requires signatures from peg-out signers.

### Stacks Among Other Bitcoin Layers

Let's take a look at how Stacks compares to some of the other Bitcoin layering solutions. This is a fresh and rapidly evolving ecosystem, so there are quite a few interesting approaches in the works.

#### Lightning

Lightning is probably the most well-known Bitcoin layer, and is primarily designed to address scalability issues. Lightning functions as a separate P2P network from Bitcoin, allowing participants to conduct move their BTC from the main chain to Lightning, conduct multiple transactions on Lightning, and then send the final result to the BTC chain where it is finalized.

This is actually a completely separate problem from what Stacks is trying to address. Where Lightning takes the existing functionality of Bitcoin and makes it much more scalable, Stacks is seeking to expand Bitcoin's functionality to do things you can't do now.

Crucially, Lightning is ephemeral, meaning it has no state management. There is no continuous record of what has happened on the Lightning network, only current channels. Once users close their channel and their transactions are written back to the Bitcoin chain, they are gone.

A key component of full-expressive smart contracts is that they maintain a permanent historical record of all transactions that have happened on the chain.

Bitcoin does this now, but its scripting language is very limited. So where Lightning seeks to make existing Bitcoin functionality happen faster, Stacks seeks to add new functionality.

#### RSK

Like Stacks, [RSK](https://www.rsk.co/) seeks to add additional functionality to Bitcoin, but it goes about that process differently than Stacks.

RSK is a merge-mined chain, meaning that it is mined concurrently with Bitcoin. Stacks has its own miners and mining process, and its own economic value and security that is a function of that token value, more on this below.

There are multiple perspectives to look at this from. Because RSK is merge-mined, Bitcoin miners are also the ones mining RSK blocks, and RSK does not have its own token.

RSK can only exist with opt-in from Bitcoin miners and mining rewards are highly dependent on transaction volume.

This also opens up a wider discussion on the costs and benefits of having a separate token, which we'll get into below.

RSK is also EVM-compatible, where Stacks uses Clarity and the Clarity VM.

#### Liquid

[Liquid](https://liquid.net/) is a federated network focused on unlocking more advanced financial capabilities with Bitcoin. Being federated, Liquid is not an open network, and thus not decentralized.

The Liquid consensus mechanism is managed by 15 functionaries, who handle the transaction processing and validating. Liquid also does not support general-purpose applications, but is solely focused on financial applications.

This was a brief overview of these other Bitcoin projects, for another perspective, Hiro wrote an [excellent post](https://www.hiro.so/blog/building-on-bitcoin-project-comparison) comparing Stacks with other Bitcoin projects.

#### Bitcoin Rollups

Rollups are an exciting development for scaling decentralized applications. There are many different types of rollups; they're broadly divided into ZK rollups and Optimistic rollups, although other classifications are also there (see [this overview](https://era.zksync.io/docs/dev/fundamentals/rollups.html#what-are-rollups)).

Rollups are generally considered layer-2 (L2) technology that runs on top of a layer-1 blockchain like Bitcoin or Ethereum. A critical aspect of rollups is the trustless nature where logic running on the L1 chain can determine whether something that happened on the rollup was valid. This is not true for all types of rollups, and there is some fuzziness around exact definitions. [Sovereign rollups](https://blog.celestia.org/sovereign-rollup-chains/), for example, only use the underlying L1 for data availability (DA) and not for consensus.

Most of the rollups work on Ethereum uses Ethereum L1 both as a data availability layer, and for consensus, i.e., the validity of rollup transactions is determined by logic running on Ethereum L1. Newer systems, [like Celestia](https://celestia.org/), are taking a more modular approach and are separating DA from consensus. One interesting aspect of separating DA is that more established and durable chains like Bitcoin can be used for DA as well. Below is an interesting comparison of sidechains and two types of rollups possible on Bitcoin (John Light posted this [on Twitter](https://twitter.com/lightcoin/status/1630301411962388481?s=20)):

<figure><img src="../.gitbook/assets/image (15).png" alt=""><figcaption></figcaption></figure>

This image broadly means developers can build sovereign rollups on Bitcoin today, but you'll need a "trusted" setup for moving BTC in and out of the rollup. In fact, people are already doing this -- see the recent [Rollkit announcement](https://rollkit.dev/blog/sovereign-rollups-on-bitcoin/). To build validity rollups, meaning Bitcoin L1 enforces BTC withdrawals from the rollup, you'll need modifications to Bitcoin L1. See [this overview](https://bitcoinrollups.org/) for more details.

**How does the Stacks layer compare?**

Stacks is not really a sidechain, given the Nakamoto release (see [latest Stacks paper](https://stacks.co/stacks.pdf)), Stacks layer will follow Bitcoin finality with 100% Bitcoin hashpower. Also, the Stacks layer has various other direct connections to Bitcoin L1 that sidechains typically do not have -- see the above section for details if Stacks is a Bitcoin L2 or not; the short answer is it depends on the definition you use.

Stacks with the Nakamoto release will have Bitcoin-grade reorg resistance. The designers of the Nakamoto release have decided to wait for 150 blocks before Bitcoin finality kicks in; this is mostly done to allow short-term forks to be resolved at the Stacks level. This design also means that most Maximal Extractable Value (MEV) action happens on the Stacks layer side and not on the Bitcoin side. There is always a fear of MEV incentives messing with Bitcoin mining, and the Stacks layer explicitly attracts most MEV activity to happen on the Stacks layer vs. Bitcoin L1 (the assumption here is that most MEV activity will occur within 150 blocks). Changing the variable from 150 to 6 blocks is trivial technically and can be configured as needed. Sovereign rollups effectively use a variable of 0 blocks and work similarly to the Stacks layer for reorg resistance.

For data availability, Stacks publishes only hashes of data to Bitcoin every Bitcoin block instead of posting all the data to Bitcoin. The designers separate data validation from data availability. Bitcoin is used for data validation, which is important. Bitcoin L1 and only Bitcoin L1 can confirm whether a presented Stacks layer history is valid. The block data itself is kept outside of Bitcoin L1 for scalability. As long as STX has any market cap, there is an incentive for Stacks miners to keep copies of the Stacks layer ledger around. Even if a single copy of the Stacks ledger exists, it can be independently verified against Bitcoin L1. Sovereign rollups publish all data to Bitcoin L1, giving both Bitcoin-grade data validity and data availability. The potential downside is scalability at Bitcoin L1, but the hope is that rollup data will not become very large.

**Can Stacks layer work with rollups?**

Yes! There is already an active R\&D effort to integrate rollups with the Stacks layer. Both with the Stacks layer and sovereign rollups the technically challenging part is how to get BTC in and out of the Stacks layer or the sovereign rollup. The decentralized BTC peg, see [the sBTC paper](https://stacks.co/sbtc.pdf), applies to both the Stacks layer and sovereign rollups. Without modifying Bitcoin L1, an sBTC-like design with a decentralized open-membership group of signers is the most trust-minimized way to move BTC in and out of Bitcoin layers. Once the necessary upgrades to Bitcoin L1 can be made to enable validity rollups i.e., Bitcoin L1 can enforce BTC withdrawal from a layer, then the Stacks layer can also upgrade to benefit from it.

Given a trust-minimized asset like sBTC is needed for sovereign rollups, with the launch of sBTC such sovereign rollups become even more interesting to deploy. The Stacks layer can potentially provide the decentralized group of signers for a trust-minimized BTC asset that can be used in a sovereign rollup, and DA comes directly from Bitcoin L1 e.g., with Ordinals. If you want to learn more, please join the [sBTC working group](https://github.com/stacks-network/stacks/discussions/469). There might be a dedicated rollups working group in the Stacks project soon as well.

### Why Does Stacks Need a Token?

This brings us to a central philosophical conversation in the world of crypto and Bitcoin, whether or not blockchains need tokens.

Let's start by looking at the fundamental reason why tokens exist: to fund the maintenance and forward progress of a blockchain.

Bitcoin is a token. It is a cryptocurrency that is used to incentivize miners to add new blocks to the chain. In Bitcoin's case, mining rewards are set on a predefined schedule, and once those mining rewards run out, the chain will need to survive on transaction fees alone.

The purpose of a blockchain is to have a permanent historical record of every transaction that has ever occurred on the chain. Blockchains are basically ledgers. The token aspect is used as an incentive mechanism to secure the chain.

This is why networks like Lightning and other P2P networks don't need tokens, they don't need to maintain a historical record. When we are talking about a system that is supposed to maintain a global financial system, it is important for the maintenance of that system to be incentivized correctly.

Let's look at this concept in the context of Stacks and its goals. Stacks seeks to provide smart contract functionality to Bitcoin, to serve as the programming rails for building a decentralized economy on top of Bitcoin.

Many Bitcoin community members are skeptical of new tokens and rightly so. There are countless projects out there that force the use of a token on their project and in many cases a token is actually not needed. Stacks project was started by Bitcoin builders who have a long history of building apps & protocols on Bitcoin L1 without any token (e.g., BNS launched in 2015 on Bitcoin L1 which was one of the largest protocols using OP\_RETURN on Bitcoin L1). So why did a bunch of Bitcoin builders decided to have a separate token for Stacks L2? Great question! Let's dig into the details.

The Stacks token (STX) is primarily meant to be used for two things (details in Stacks paper):

1. Incentives for Stacks L2 miners
2. Incentives for peg-out signers

The only way to remove the token is to build Stacks as a federated network like Liquid. In a federation the pre-selected group of companies control the mining and block production and a pre-selected group of companies need to be trusted for peg-out transactions. Stacks developers wanted to design an open and permissionsless system. The only way to have a decentralized mining process is through incentives. As mentioned above, his is how Bitcoin works as well, where newly minted BTC are used as incentives to mine new blocks and anyone in the world can decide to become a miner. Anyone with BTC can mine the Stacks L2 chain, it is open and permissionless.

Similarly, the way the decentralized BTC peg, called sBTC (see the sBTC paper), is designed is that the group of signer is open and permissionless (unlike a federation). These signers have economic incentives to correctly follow the protocol for peg-out requests. In a federation, users need to blindly trust the pre-set federation members to get their BTC out of the federation and back on Bitcoin L1. Stacks developers wanted to have an open, permissionless, and decentralized way to move BTC from Bitcoin L1 to Stacks L2 and back. This is made possible through economic incentives i.e., need for a token.

Other than these two reasons, STX is also used to pay gas fees for transactions. However, once the upcoming sBTC peg is live most of the economy of Stacks L2 is expected to follow a Bitcoin standard and work using BTC as the economic unit. It is expected that users will mostly interact just with Bitcoin and use BTC in wallets and apps (gas fees can be paid with BTC using atomic swaps in the background). It is important to note that BTC cannot be used for mining incentives on Stacks L2 because the only way to incentivize decentralized block production is through newly minted assets by the protocol (similar to how Bitcoin works itself) i.e., need for a token.

### The Symbiotic Relationship Between Stacks and Bitcoin

Stacks and Bitcoin complement each other. Stacks leverages the extreme decentralization of Bitcoin, its PoW consensus mechanism, and its value as a cryptocurrency.

But Stacks also complements Bitcoin by unlocking additional use cases, thereby increasing its value over time. This also helps to solve the additional problem of the future maintainability of Bitcoin after the coinbase rewards are gone and Bitcoin has to function on transaction fees alone.

If Bitcoin is seen as only a store of value, the economic density, meaning how much value is being exchanged, of each transaction will be minimal. But if Bitcoin is the underlying foundation for an entire decentralized economy, those [transactions become much more valuable](https://twitter.com/muneeb/status/1506976317618728963), increasing transaction fees. This is a crucial incentive for miners to continue securing the network as coinbase rewards drop.

### Reading from and Writing to Bitcoin

One of the things that gives the Stacks chain its superpowers in connecting with Bitcoin is not only how it connects to Bitcoin at a protocol level, discussed above, but also how we can utilize that Bitcoin at a programmatic level.

That's where Clarity comes in. Clarity is the smart contract language for Stacks, and is how we actually build out a lot of the functionality we are talking about here.

#### How Does Clarity Read BTC State?

One of the often-touted features of Clarity is that it has access to the state of the Bitcoin chain built in, but how does it actually do that? Because of Stacks' PoX mechanism, every Stacks block is connected to a Bitcoin block, and can query Bitcoin block header hashes with the [`get-burn-block-info?` function](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#new-method-get-burn-block-info).

This function allows us to pass in a Bitcoin block height and get back the header hash. The [`burn-block-height` Clarity keyword](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-keywords#burn-block-height) will give us the current block height of the Bitcoin chain.

However, `get-burn-block-info?` only returns data of the Bitcoin block at that height if it has already been processed and was created after the launch of the Stacks chain. So if we want to evaluate whether or not something happened on Bitcoin, we have to wait at least one block later to do so.

This is step 1 of Clarity contracts being able to serve as the programming layer for Bitcoin, when a BTC transaction is initiated, the first thing that needs to happen is that a Clarity contract needs to become aware of it. This can happen manually by utilizing Clarity functions discussed above with the [BTC library](https://explorer.stacks.co/txid/0x8b112f2b50c1fa864997b7496aaad1e3940700309a3fdcc6c07f1c6f8b9cfb7b?chain=mainnet), as [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html) do.

{% hint style="info" %}
Note that this process is made easier by the additional Clarity functions added in 2.1, like the `get-burn-block-info?` function we looked at above.
{% endhint %}

Or we can automate (albeit at a cost of some centralization in our dapp) using an event-based architecture using something like Hiro's [chainhooks](https://www.hiro.so/blog/meet-4-new-features-in-clarinet#setting-up-trigger-actions-with-chainhooks), which will allow us to automatically trigger a Clarity contract call when a certain BTC transaction is initiated.

This is the first component of using Stacks to build Bitcoin dapps, the read access to Bitcoin chain.

#### Can Clarity Write to BTC?

But how can Stacks actually write to the Bitcoin chain? This has been somewhat of a holy grail problem in the Bitcoin and crypto world for years now, as it solves a difficult dilemma.

On one hand, Bitcoin write functionality from more expressive smart contract chains allows for us to take the latent capital of Bitcoin and utilize it to build a Bitcoin-based economy.

Bitcoin has a market cap of more than double that of Ethereum's, but has an almost non-existent app ecosystem because of this write problem. There is a massive market opportunity here for both developers and entrepreneurs if we are able to build decentralized applications that have a rival programming capacity to other chains like Ethereum.

But the tradeoff here is that allowing this on the Bitcoin chain opens up a lot of new attack vectors and undermines a core tenet of Bitcoin: the fact that it is very simple and very good at doing what it does.

Vitalik originally wanted to add functionality to Bitcoin, and created Ethereum when that didn't work. There's good reason for this. Allowing additional functionality like this exposes Bitcoin to more risk and attack vectors, this conundrum is what Stacks seeks to solve with sBTC. How can we achieve the same functionality as Ethereum but keep the security of Bitcoin?

One possible route is by separating the programming and money layers, as Stacks and a few other chains do. While Stacks is a good chunk of the way towards this goal right now, due to the PoX mechanism, there is still some work to be done before it can be considered a Bitcoin programming layer.

Specifically, it needs a tighter connection to the Bitcoin chain than PoX currently provides, and needs to share complete finality with Bitcoin.

Second, it needs a completely trustless, decentralized two-way peg between the Stacks chain and Bitcoin, so that end users only have to send Bitcoin to an address, have things happen on the Stacks side, and have Bitcoin returned to them.

These issues are currently being addressed with sBTC and the Stacks Nakamoto Release, both of which you can [read about on Stacks' website](https://www.stacks.co/learn/sbtc).

### Bitcoin-First Applications in the Wild

Putting all of this information together we can begin to see how we might build applications that are Bitcoin-first. The ultimate goal of Stacks is to serve as an invisible programming layer for Bitcoin, where STX operates primarily as a gas token to operate the Stacks network, but users only ever have to interact with it using their Bitcoin wallet.

One of the most interesting projects currently taking advantage of this functionality is Zest, which uses a protocol called Magic under the hood to trustlessly swap BTC on the Bitcoin chain for xBTC on the Stacks chain. Zest is a protocol for decentralized borrowing and lending with Bitcoin.

Here are the basics of how it works:

1. First, Zest generates a unique [HTLC](https://en.bitcoin.it/wiki/Hash\_Time\_Locked\_Contracts) Bitcoin address for liquidity providers to deposit their BTC to, this uses [Magic Protocol](https://www.magic.fun/) under the hood, which allows users to trustlessly swap BTC for xBTC.
2. After LP (liquidity provider) sends funds to the HTLC address and the block is confirmed, the payment is considered in escrow.
3. Now Stacks comes in by reading the Bitcoin state and verifying that deposit actually occurred on the BTC chain, and escrows the corresponding amount of xBTC if it did. If for some reason that were to fail, the LP is still in control of their BTC funds.
4. Once that escrow is confirmed, LP signs a Stacks transaction that transfers control of the BTC over to Magic, at which point Magic controls the BTC and xBTC is transferred to the Zest liquidity pool. Zest tokens are then minted on the Stacks chain, representing a claim token for the LP's BTC funds

The cool thing is that this all happens in a single Stacks block, because Stacks and Bitcoin blocks are completed in lockstep. For more details on how Magic handles this process we highly recommend [checking out their docs](https://magicstx.gitbook.io/magic-protocol/guides/technical-overview).

To dive deeper into the details of how Zest is building a Bitcoin-first application, [check out their docs](https://zestprotocol.gitbook.io/zest/what-is-zest-protocol/the-technology-under-the-hood), and if you are interested in building something like this out for yourself, check out their smart contracts.

### How to Build Bitcoin-First Dapps with Stacks

We are currently working on a Stacks Cookbook, which will provide numerous examples for how to build Bitcoin-first apps using both Clarity and frontend Stacks and Bitcoin libraries.

Until then, you can take a look at Magic and Zest, the protocols mentioned above, to see how they are going about facilitating this process using xBTC and model your applications after them.

We are in the very early stages of being able to unlock and use BTC in decentralized applications, and much more content and tools will be created in the coming year to make this process easier for developers.

### What's Next?

As mentioned earlier on this page, xBTC is not an ideal solution. xBTC is a custodial solution run by [Wrapped](https://wrapped.com/). It does however, give us the building blocks we need to begin building Bitcoin-first applications with Stacks. And updates from Stacks 2.1 make it easier to perform these actions.

With sBTC on its way, we'll begin to see a new batch of innovative projects that are able to build truly trustless, decentralized dapps with Bitcoin.

Here are some resources to dive into to learn more about improvements coming to Stacks via the 2.1 upgrade, Nakamoto release, and sBTC.

* [List of New Clarity Functions for 2.1](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#clarity)
* [How the Stacks 2.1 Transition Impacts Stacking](https://www.hiro.so/blog/how-the-stacks-2-1-transition-impacts-stacking)
* [Developer's Guide to Stacks 2.1](https://www.hiro.so/blog/a-developers-guide-to-stacks-2-1)
* [Learn About sBTC](https://www.stacks.co/learn/sbtc)
* [Stacks Nakamoto Release](https://stx.is/nakamoto)

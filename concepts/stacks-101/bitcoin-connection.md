# Bitcoin Connection

In the previous section, we described Stacks as bringing smart contract functionality to Bitcoin, without modifying Bitcoin itself, and explained a bit about how the chain works.

That's a big promise, but how does Stacks actually deliver on it? And what makes Stacks unique among other Bitcoin layers and other blockchains like Ethereum?

Before we get into the technical details of how Stacks works, it's important to get a high-level overview of the problem its solving and how it actually does that. We'll dive deeper into some of these topics as we go through the docs, but it's good to get a high-level picture to bring everything together.

This topic is a bit of a rabbit hole, and this section is pretty long, but it will give you an in-depth understanding of exactly the problem Stacks is looking to solve, and how it solves it.

Let's get into it.

### Is Stacks a Bitcoin L2?

Stacks is a Bitcoin layer for smart contracts. The classification as a layer-1 (L1) or layer-2 (L2) or sidechain really depends on the definition used. With that said, generally speaking L1 chains are sovereign meaning that (a) they have their own security budget, and (b) they can survive without the need for any other L1 chain. L2 chains typically do not have their own security budget and share the security of the underlying L1 chain, and they cannot live without the underlying L1 chain. There are many different design mechanisms that L2s can use, and we cover several of them and how Stacks compares in the [Stacks Among Other Bitcoin Layers](stacks-among-other-layers.md) section.

The initial release of Stacks in early 2021 had a separate security budget from Bitcoin L1. Even though the Stacks layer could not function without Bitcoin L1, the developers working on the project described it as a different system that does not fit neatly into existing classifications, sometimes using the term layer 1.5 (see [this Decrypt article](https://decrypt.co/82019/bitcoin-defi-thing-says-stacks-founder-muneeb-ali) for example).

The upcoming planned release of Stacks, called the Nakamoto release, will no longer have a separate security budget from Bitcoin. Instead, a 100% of Bitcoin hashpower will determine finality on Stacks layer. After the next upgrade, to reorg Stacks blocks/transactions the attacker will need to reorg Bitcoin L1 itself (which is very hard to do and therefore a great security property for a Bitcoin layer to have). More details in the [Stacks paper](https://stacks.co/stacks.pdf).

The definition of [L2 used in Ethereum](https://ethereum.org/en/layer-2/) and other newer ecosystems is different and focuses on the ability to withdraw assets using only L1 security and L1 miners. According to that definition Stacks layer is not a clear L2, given the set of peg-out signers determine if users can withdraw sBTC. Bitcoin cannot support such verification without changes to Bitcoin L1 (which may happen in the future). The Ethereum L2 definition also does not apply that cleanly to Bitcoin L2s, given new assets are issued on L2s when it comes to Bitcoin and not issued on L1 (only BTC is the L1 asset). Therefore, using the definition of security of withdrawing assets is not directly applicable given assets are defined and used on L2s and not withdrawn out to Bitcoin L1 anyway (with the exception of BTC itself). Rather, what becomes more important is "settlement on Bitcoin" i.e., is contract data and state secured by 100% of Bitcoin's hashpower or not.

Remember that L2s on Bitcoin also have to serve the additional purpose of expanding both functionality and scalability, which means L2s accomplish fundamentally different goals depending on the functionality of the L1.

Users and developers organically call Stacks a Bitcoin L2, since it is a simpler concept to understand. There are certain properties of Stacks layer that also help the concept of Stacks as a Bitcoin L2:

1. Bitcoin finality, as discussed above, where 100% of the Bitcoin hashpower decides block ordering and transaction finality.
2. Stacks consensus runs on Bitcoin L1, and Stacks L2 cannot operate or survive without Bitcoin L1.
3. With the upcoming decentralized Bitcoin peg, called sBTC, most of economy on Stacks layer will likely use BTC as the unit of economy. It is expected that most users will simply use Bitcoin in wallets and apps and then peg out their BTC to Bitcoin L1.
4. All data and transactions on Stacks are automatically hashed and permanently stored on Bitcoin L1 on every Bitcoin block. Anyone can verify that some data on Stacks is valid by checking the corresponding hash on Bitcoin L1. This compact storage of hashes on L1 is somewhat similar to rollups (although there are other differences). You can read more about this process in the [Block Production](../block-production/) section.
5. Contracts on Stacks layer can read Bitcoin L1 transactions and respond to them. Assets on Stacks layer can be moved simply through Bitcoin L1 transactions.

Given all the details above, why would some people think that Stacks is not a Bitcoin L2? There are a couple of reasons why this question comes up often:

1. The initial version of Stacks (released early 2021) had a separate security budget which changed to following 100% Bitcoin hashpower with the Nakamoto release. There is old material and blog posts floating around that still talk about the initial Stacks version. The old materials will likely get updated with time.
2. According to the Ethereum definition of L2s a user should be able to withdraw their base-layer assets purely by doing a L1 transaction and relying only on L1 security (this is true for Lightning for example). This definition does not apply cleanly to Bitcoin L2s because assets are not defined at Bitcoin L1 but are defined in L2s instead. The only asset where this matters is the pegged BTC asset from Bitcoin L1, given all other assets are native to L2s anyway. In the upcoming Stacks release, users can withdraw their BTC by sending just a Bitcoin L1 transaction but Bitcoin L1 cannot validate that complex transaction and a majority of peg-out signers will need to sign on the peg-out request. In an ideal world Bitcoin miners can validate such transactions but that would require a change to Bitcoin L1. Therefore, Stacks design optimizes for a method that is decentralized and can be deployed without any changes to Bitcoin L1. If in the future it is possible to make changes to Bitcoin L1 then Stacks layer security can benefit from that as well.
3. Bitcoin community members are generally skeptical of claims and on a look out for people making any false marketing claims. This is generally a healthy thing for the Bitcoin ecosystem and builds up the immune system. Some such community members might be skeptical about Stacks as a Bitcoin layer or L2 until they fully read the technical details and reasoning. There is a good [Twitter thread](https://twitter.com/lopp/status/1623756872976158722?s=20) about his topic as well.

Why don't we use the term 'sidechain' for Stacks then? Sidechains in Bitcoin typically have a different security budget from Bitcoin L1, typically as a subset of Bitcoin miners who participate in the sidechain (they don't follow 100% Bitcoin finality), their consensus runs on the sidechain (vs running on Bitcoin L1), and they don't publish their data/hashes on Bitcoin L1. The Stacks layer does not fit that definition cleanly given the consensus runs on Bitcoin L1, it follows Bitcoin finality, and publishes data/hashes on L1.

**Can Stacks layer work with rollups?**

Yes! There is already an active R\&D effort to integrate rollups with the Stacks layer. Both with the Stacks layer and sovereign rollups the technically challenging part is how to get BTC in and out of the Stacks layer or the sovereign rollup. The decentralized BTC peg, [sBTC](../sbtc/), applies to both the Stacks layer and sovereign rollups. Without modifying Bitcoin L1, an sBTC-like design with a decentralized open-membership group of signers is the most trust-minimized way to move BTC in and out of Bitcoin layers. Once the necessary upgrades to Bitcoin L1 can be made to enable validity rollups i.e., Bitcoin L1 can enforce BTC withdrawal from a layer, then the Stacks layer can also upgrade to benefit from it.

Given a trust-minimized asset like sBTC is needed for sovereign rollups, with the launch of sBTC such sovereign rollups become even more interesting to deploy. The Stacks layer can potentially provide the decentralized group of signers for a trust-minimized BTC asset that can be used in a sovereign rollup, and DA comes directly from Bitcoin L1 e.g., with Ordinals.

### Why Does Stacks Need a Token?

This brings us to a central philosophical conversation in the world of crypto and Bitcoin, whether or not blockchains need tokens.

Let's start by looking at the fundamental reason why tokens exist: to fund the maintenance and forward progress of a blockchain.

Bitcoin is a token. It is a cryptocurrency that is used to incentivize miners to add new blocks to the chain. In Bitcoin's case, mining rewards are set on a predefined schedule, and once those mining rewards run out, the chain will need to survive on transaction fees alone.

The purpose of a blockchain is to have a permanent historical record of every transaction that has ever occurred on the chain. Blockchains are basically ledgers. The token aspect is used as an incentive mechanism to secure and maintain the chain.

This is why networks like Lightning and other P2P networks don't need tokens, they don't need to maintain a historical record. Channel-based solutions like Lightning rely on users opening 2-of-2 multisigs with each other. Once those channels are closed, the state disappears. When we are talking about a system that is supposed to maintain a global financial system, it is important for the maintenance of that system to be incentivized correctly.

Let's look at this concept in the context of Stacks and its goals. Stacks seeks to provide smart contract functionality to Bitcoin, to serve as the programming rails for building a decentralized economy on top of Bitcoin.

Many Bitcoin community members are skeptical of new tokens and rightly so. There are countless projects out there that force the use of a token on their project and in many cases a token is actually not needed. The Stacks project was started by Bitcoin builders who have a long history of building apps & protocols on Bitcoin L1 without any token (e.g., BNS launched in 2015 on Bitcoin L1 which was one of the largest protocols using OP\_RETURN on Bitcoin L1). So why did a bunch of Bitcoin builders decide to have a separate token for Stacks L2? Great question! Let's dig into the details.

The Stacks token (STX) is primarily meant to be used for two things (details in [Stacks paper](https://stacks-network.github.io/stacks/stacks.pdf)):

1. Incentives for Stacks L2 miners
2. Incentives for peg-out signers

The only way to remove the token is to build Stacks as a federated network like Liquid. In a federation the pre-selected group of companies control the mining and block production and a pre-selected group of companies need to be trusted for peg-out transactions.&#x20;

Stacks developers wanted to design an open and permissionless system. The only way to have a decentralized mining process is through incentives. As mentioned above, his is how Bitcoin works as well, where newly minted BTC are used as incentives to mine new blocks and anyone in the world can decide to become a miner. Anyone with BTC can mine the Stacks L2 chain, it is open and permissionless.

Similarly, the way sBTC is designed is that the group of signers is open and permissionless (unlike a federation). These signers have economic incentives to correctly follow the protocol for peg-out requests. In a federation, users need to blindly trust the pre-set federation members to get their BTC out of the federation and back on Bitcoin L1. Stacks developers wanted to have an open, permissionless, and decentralized way to move BTC from Bitcoin L1 to Stacks L2 and back. This is made possible through economic incentives i.e., need for a token.

{% hint style="info" %}
With more and more Bitcoin layers emerging, there is some nuance in this federated vs open network design. Some protocols like Botanix's Spiderchain offer an open network but have different incentive mechanisms. We dig into these in detail in the [Stacks Among Other Layers](stacks-among-other-layers.md) section.
{% endhint %}

Other than these two reasons, STX is also used to pay gas fees for transactions. However, once the upcoming sBTC peg is live most of the economy of Stacks L2 is expected to follow a Bitcoin standard and work using BTC as the economic unit. It is expected that users will mostly interact just with Bitcoin and use BTC in wallets and apps (gas fees can be paid with BTC using atomic swaps in the background). It is important to note that BTC cannot be used for mining incentives on Stacks L2 because the only way to incentivize decentralized block production is through newly minted assets by the protocol (similar to how Bitcoin works itself) i.e., need for a token.

### The Symbiotic Relationship Between Stacks and Bitcoin

Stacks and Bitcoin complement each other. Stacks leverages the extreme decentralization of Bitcoin, its PoW consensus mechanism, and its value as a cryptocurrency.

But Stacks also complements Bitcoin by unlocking additional use cases, thereby increasing its value over time. This also helps to solve the additional problem of the future maintainability of Bitcoin after the coinbase rewards are gone and Bitcoin has to function on transaction fees alone.

If Bitcoin is seen as only a store of value, the economic density, meaning how much value is being exchanged, of each transaction will be minimal. But if Bitcoin is the underlying foundation for an entire decentralized economy, those [transactions become much more valuable](https://twitter.com/muneeb/status/1506976317618728963), increasing transaction fees. This is a crucial incentive for miners to continue securing the network as coinbase rewards drop.

### Reading from Bitcoin State

One of the things that gives the Stacks chain its superpowers in connecting with Bitcoin is not only how it connects to Bitcoin at a protocol level, discussed above, but also how we can utilize that Bitcoin at a programmatic level.

That's where Clarity comes in. Clarity is the smart contract language for Stacks, and is how we actually build out a lot of the functionality we are talking about here.

One of the often-touted features of Clarity is that it has access to the state of the Bitcoin chain built in, but how does it actually do that? Because of Stacks' PoX mechanism, every Stacks block is connected to a Bitcoin block, and can query Bitcoin block header hashes with the [`get-burn-block-info?` function](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#new-method-get-burn-block-info).

This function allows us to pass in a Bitcoin block height and get back the header hash. The [`burn-block-height` Clarity keyword](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-keywords#burn-block-height) will give us the current block height of the Bitcoin chain.

However, `get-burn-block-info?` only returns data of the Bitcoin block at that height if it has already been processed and was created after the launch of the Stacks chain. So if we want to evaluate whether or not something happened on Bitcoin, we have to wait at least one block later to do so.

This is step 1 of Clarity contracts being able to serve as the programming layer for Bitcoin, when a BTC transaction is initiated, the first thing that needs to happen is that a Clarity contract needs to become aware of it. This can happen manually by utilizing Clarity functions discussed above with the [BTC library](https://explorer.stacks.co/txid/0x8b112f2b50c1fa864997b7496aaad1e3940700309a3fdcc6c07f1c6f8b9cfb7b?chain=mainnet), as [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html) do.

{% hint style="info" %}
Note that this process is made easier by the additional Clarity functions added in 2.1, like the `get-burn-block-info?` function we looked at above.
{% endhint %}

Or we can automate (albeit at a cost of some centralization in our dapp) using an event-based architecture using something like Hiro's [chainhooks](https://www.hiro.so/blog/meet-4-new-features-in-clarinet#setting-up-trigger-actions-with-chainhooks), which will allow us to automatically trigger a Clarity contract call when a certain BTC transaction is initiated.

This is the first component of using Stacks to build Bitcoin dapps, the read access to Bitcoin chain.

Next up, let's dig a bit deeper into how exactly Stacks is "built on Bitcoin" by taking a look at Stacks' block production mechanism, Proof of Transfer.

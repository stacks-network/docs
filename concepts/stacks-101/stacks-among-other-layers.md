# Stacks Among Other Layers

Recently, we have seen a flurry of new "Bitcoin layers" popping up across the ecosystem as the market has finally woken up to the idea.

However, not all Bitcoin layers are made equal. While a large chunk of these projects are vaporware riding the hype train, there are several projects that are making a good faith effort to grow the Bitcoin economy and build on top of Bitcooin using various approaches.

The [Bitcoin Layers project](https://www.bitcoinlayers.org/) is an excellent place to begin learning about these different layers. In addition, here we've broken down how Stacks compares to some of the most promising Bitcoin L2 solutions so you can begin to learn about them all and make an educated decision on which to use.

### What is a Bitcoin Layer?

It's important to define terms, especially in a new and evolving ecosystem like web3, and an even newer and more rapidly evolving subecosystem like Bitcoin layers.

For the purpose of this document and comparison, we can use the following definition of a Bitcoin layer: A Bitcoin layer is a separate distributed computing system built either alongside or on top of Bitcoin for the purpose of enhancing its scalability, functionality, or both.

That definition is intentionally general, and encompasses many different projects like L2s, sidechains, federated, open network, etc.

#### Technical vs Economic Considerations

It's important to understand that when designing blockchains, especially layer 2 systems, we have to consider both technical and economic factors. Since a core component of a blockchain system is money, we need to make sure that our systems are both technically robust and economically efficient. And we need to accomplish both of these things while maintaining decentralization.

While it is trivial to create a trusted bridge to bridge BTC from the L1 to a L2, that defeats the purpose of blockchain technology in general, since the goal should be to create permissionless, trust-minimized systems.

At the same time, a great technical solution that doesn't consider the economic incentives of the decentralized actors running the network will not have a sustainable path to long-term adoption and viability.

This balance is why Stacks has chosen the design it has, to balance both achieving the technical features of a Bitcoin L2 like security inheritance and a trust-minimized BTC peg with the economic incentives for the participants in the ecosystem to maintain it in the long term.

As an example of this, Galaxy recently [conducted research](https://www.galaxy.com/insights/research/exploring-bitcoin-for-data-availability/) on this topic and found that a Bitcoin rollup "will need to generate approximately between $1.9m and $9.63m in revenue from L2 transaction fees per month." That is a significant number and again highlights the need to consider both technical and economic factors when designing Bitcoin layers.

### Popular Bitcoin Layers Compared

#### Lightning

Lightning is probably the most well-known Bitcoin layer, and is primarily designed to address scalability issues. Lightning functions as a separate P2P network from Bitcoin, allowing participants to move their BTC from the main chain to Lightning, conduct multiple transactions on Lightning, and then send the final result to the BTC chain where it is finalized.

This is actually a completely separate problem from what Stacks is trying to address. Where Lightning takes the existing functionality of Bitcoin and makes it much more scalable, Stacks is seeking to expand Bitcoin's functionality to do things you can't do now.

Crucially, Lightning is ephemeral, meaning it has no state management. There is no continuous record of what has happened on the Lightning network, only current channels. Once users close their channel and their transactions are written back to the Bitcoin chain, they are gone.

A key component of fully-expressive smart contracts is that they maintain a permanent historical record of all transactions that have happened on the chain.

Bitcoin does this now, but its scripting language is very limited. So where Lightning seeks to make existing Bitcoin functionality happen faster, Stacks seeks to add new functionality.

#### RSK

Like Stacks, [RSK](https://www.rsk.co/) seeks to add additional functionality to Bitcoin, but it goes about that process differently than Stacks.

RSK is a merge-mined chain, meaning that it is mined concurrently with Bitcoin. Stacks has its own miners and mining process, and its own economic value and security that is a function of that token value, more on this below.

There are multiple perspectives to look at this from. Because RSK is merge-mined, Bitcoin miners are also the ones mining RSK blocks, and RSK does not have its own token.

RSK can only exist with opt-in from Bitcoin miners and mining rewards are highly dependent on transaction volume.

This also opens up a wider discussion on the costs and benefits of having a separate token, which we'll get into below a bit when we discuss rollups.

RSK is also EVM-compatible, where Stacks uses Clarity and the Clarity VM.

#### Liquid

[Liquid](https://liquid.net/) is a federated network focused on unlocking more advanced financial capabilities with Bitcoin. Being federated, Liquid is not an open network, and thus not decentralized.

The Liquid consensus mechanism is managed by 15 functionaries, who handle the transaction processing and validating. Liquid also does not support general-purpose applications, but is solely focused on financial applications.

For another perspective, Hiro wrote an [excellent post](https://www.hiro.so/blog/building-on-bitcoin-project-comparison) comparing Stacks with other Bitcoin projects.

#### Bitcoin Rollups

Rollups are an exciting development for scaling decentralized applications. There are many different types of rollups; they're broadly divided into ZK rollups and Optimistic rollups, although other classifications are also there (see [this overview](https://era.zksync.io/docs/dev/fundamentals/rollups.html#what-are-rollups)).

Rollups are generally considered layer-2 (L2) technology that runs on top of a layer-1 blockchain like Bitcoin or Ethereum. A critical aspect of rollups is the trustless nature where logic running on the L1 chain can determine whether something that happened on the rollup was valid. This is not true for all types of rollups, and there is some fuzziness around exact definitions. [Sovereign rollups](https://blog.celestia.org/sovereign-rollup-chains/), for example, only use the underlying L1 for data availability (DA) and not for consensus.

Most of the rollups work on Ethereum uses Ethereum L1 both as a data availability layer, and for consensus, i.e., the validity of rollup transactions is determined by logic running on Ethereum L1. Newer systems, [like Celestia](https://celestia.org/), are taking a more modular approach and are separating DA from consensus. One interesting aspect of separating DA is that more established and durable chains like Bitcoin can be used for DA as well. Below is an interesting comparison of sidechains and two types of rollups possible on Bitcoin (John Light posted this [on Twitter](https://twitter.com/lightcoin/status/1630301411962388481?s=20)):

<figure><img src="../../.gitbook/assets/image (15).png" alt=""><figcaption></figcaption></figure>

This image broadly means developers can build sovereign rollups on Bitcoin today, but you'll need a "trusted" setup for moving BTC in and out of the rollup. In fact, people are already doing this -- see the recent [Rollkit announcement](https://rollkit.dev/blog/sovereign-rollups-on-bitcoin/). To build validity rollups, meaning Bitcoin L1 enforces BTC withdrawals from the rollup, you'll need modifications to Bitcoin L1. See [this overview](https://bitcoinrollups.org/) for more details.

One important nuance here is the cost required to effectively run a rollup on Bitcoin as discussed in the Galaxy research report linked in the first section.

Now we have a solid grasp of how Stacks works and how it fits in among other layers. Let's begin to dig into some of the technical implementation details and see how Stacks actually works.

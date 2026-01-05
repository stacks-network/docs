# Technology & Economic Incentives

Blockchain technology is inherently tied to economic incentives. The technology itself is built to be a financial asset, and we can create tools and software that utilize it, but the economic structures and incentives are a key piece of how a particular chain functions.

With blockchains, the economic incentives and technological structure are closely linked, so we'll look at them together.

Proof of stake is not a good economic model on which to build a global reserve currency, for several reasons:

* No connection to real-world resources
* No unforgeable costliness
* Centralization risks
* Increased cost of running a node

Let's go through these.

If you aren't familiar with how these consensus mechanisms work, here's a decent very quick, [high-level overview](https://www.coindesk.com/learn/proof-of-work-vs-proof-of-stake-what-is-the-difference) or you can take a look at [Lyn Alden's article](https://www.lynalden.com/proof-of-stake/) on proof of stake for a more detailed comparison.

### No connection to real-world resources

One of the crucial components of Bitcoin is that it is connected to a real-world resource: energy. Mining new Bitcoin costs something tangible in the physical world.

With proof of stake, there is no such connection to real-world resources. New ether are created as a result of validators staking their ether.

Why does this matter?

In proof of work, miners are not directly punished by the network for attempting to write invalid data, the punishment is simply that they waste the resources that they spent to attempt the invalid data write.

In a proof of stake system, it needs to be more complex. Validators need to have some sort of incentive system and be punished for attempting to manipulate data, that is why they stake their existing resources.

If they attempt to produce invalid data, they are slashed, meaning they lose their staked resources.

At first glance, that doesn't sound like much of a problem. Why waste the energy on needing to solve complex cryptographic puzzles when we can just utilize staked resources to accomplish the same goal?

A proof of work protocol's connection to the real world keeps the incentive structure simple. With proof of stake, the system needs to get exponentially more complex to invent incentive structures that solve the same problems that are solved by proof of work inherently.

This complexity creates too many attack vectors and is too experimental to serve as a global decentralized currency.

I understand that there are very smart people working on solutions to these problems, but the technology is too experimental and too complex for building things that are supposed to run a global economy.

Complexity always introduces potential attack vectors or even just possible avenues for error. Ethereum is a behemoth with hundreds of thousands of lines of code.

Every new piece of complexity comes with new possibilities for error that need to be corrected with more code and more complexity.

### No Unforgeable Costliness

Another aspect of proof of work is that it is not possible to forge a copy of a chain. The literal proof of work of the chain prohibits that from happening. Since Bitcoin is programmed to adjust the difficulty of the algorithm automatically to produce blocks on average every 10 minutes, the number of Bitcoin blocks is proof of time passed.

It's not possible to write a block without solving that puzzle, so it's not possible to recreate a Bitcoin chain without doing that work all over again.

Proof of stake does not have this benefit, so you can spin up a copy of a proof of stake chain that looks just as valid as the original.

So again, we have added complexity in figuring out how to determine how the protocol punishes bad actors who are attempting to vote on multiple chains.

Before proof of stake went live, Ben Edginton, an Ethereum developer, spoke about some of the drawbacks and potential complexity implications of a proof of stake system on the [Compass Mining Podcast](https://compassmining.io/education/heres-how-ethereum-developers-are-thinking-about-mev-and-eth2).

Here's what he said:

> "The reason it has taken a while, you know we’ve relied on proof-of-work in Ethereum for five plus years, is that proof-of-stake is complicated. Proof-of-work is fundamentally very simple, is easy to analyze, is easy to implement and deploy, and proof-of-stake has a lot of moving parts. You can code up a proof-of-work algorithm in a hundred lines \[of code] or so. Our current clients are a hundred thousand lines or so for proof-of-stake.
>
> And I think the theoretical foundations for proof-of-stake have taken time to mature. It’s not obvious how to make it robust, there are attacks like long-range attacks and things that just don’t exist in proof-of-work, that we’ve had to think through and come up with solutions to, so that’s just taken time. So we’ve relied on the tried and tested proof-of-work algorithm and it served Ethereum well."

### Centralization Risks

In addition to the technical risks, proof of stake systems come with serious centralization risks as well.

There is no cost to staking in a proof of stake network. Whoever has the most coins has the most influence over which transactions get processed, and since they are earning the most rewards from an absolute standpoint, they can keep staking more and more and earn more and more influence over the network.

It's a "rich get richer" system from the ground up.

They can exponentially grow their stake, rewards, and influence over the network forever, and have no incentive to pull their stake and allow new entrants to overtake them.

Imagine this analogy [laid out by Lyn Alden](https://www.lynalden.com/proof-of-stake/).

> It would be like a political system where you get a vote for every hundred dollars you have, and then also get paid a dollar by the government for casting each vote. Mary the high school science teacher with $20,000 in net worth gets 200 votes, and earns $200 from the government for voting. Jeff Bezos, with $200 billion in net worth, gets 2 billion votes, and earns $2 billion from the government for voting. He’s a more valuable citizen than Mary, by a factor of a million, and also gets paid more by the government for already being wealthy.
>
> That’s not a system many folks would like to live in. Eventually it would likely consolidate into an oligopoly (if it wasn’t already), with a handful of multi-billionaires controlling most of the votes and ruling everything. If it gets too centralized, that kind of defeats the purpose of a decentralized blockchain.

Contrast this to the fact that Bitcoin miners need to constantly be keeping up with and investing in new technology to keep up with new market entrants, it's much more difficult to develop an entrenched set of miners.

On top of this, there are popular mining protocols in the works, like Stratum, that make it so that rather than pool operators dictating what transactions get included, it is the individual pool contributor that does.

This is big benefit to decentralization, and prevents pool operators from forming an oligopoly. In staking pools, we do not get this benefit.

In addition, it costs physical resources to mine, which need to be continually spent, whereas staking is a one-time action that compounds over time.

This is great for stakers, but arguably not so great for the network as a whole.

A common misconception is that stakers can control a proof of stake system at a protocol level. That is not true. Just like Bitcoin miners don't have much control over the protocol, that's more in the hands of the users.

But what validators and stakers do have control over is which transactions are included in the chain, which gives them power over what transactions can be added, a serious detriment to the censorship-resistance property of blockchains.

In addition to centralization risks posed by single entities influencing what transactions get added to the chain, we need to remember that a proof of stake chain's liveness is also determined by stakers.

The liveness of the Ethereum chain is also affected by the proof of stake process, meaning that over 33% of staked eth would be required to negatively affect the liveness of the chain.

Sounds great, except when you think about the fact that the 33% is very nearly achieved through a single entity, Lido. The issue here is that the liveness of the chain now rests not on the entirety of the Ethereum network, but rests on organizations like Lido functioning correctly, regardless of their intent.

If we extrapolate this out to a global, decentralized currency and economy, it means that the stability of that system can potentially rest on the intent and functionality of a few entities.

Even if these entities do become completely decentralized they are still largely responsible for maintaining the liveness of the Ethereum chain.

This is fine for a blockchain that is meant to function more like a development platform or company, but far from ideal for something that is designed to serve as a global decentralized money and economy.

But isn't Bitcoin primarily mined by pools as well? Yes, the primary difference again comes back to this issue of mining being connected to real-world resources, along with decentralization-focused protocols like Stratum.

Remember that staking means that the more money you have staked and the longer amount of time you have it staked, the more influence you have over the network.

This makes it extremely difficult for new actors to come in and disrupt the big validators. They are economically incentivized to just continue letting their stake grow perpetually.

The fact that your ability to become a validator is connected to the internal token makes it somewhat of a zero-sum game. Once the big players have been established, other actors can't collect enough tokens to catch up with how much they will be exponentially gaining as a result of their staking reward.

With proof of work, someone's ability to disrupt a large player's mining control is dependent on external factors. A mining pool that begins to act maliciously cannot simply coast because it has the most hash power. Its hash power does not continue to compound without having to spend anything as in proof of stake.

This effect is somewhat mitigated by staking pools, but only if they are able to maintain decentralization and avoid an oligopoly, which is again made more difficult due to the nature of proof of stake.

We recommend reading Scott Sullivan's [guide to proof of stake](https://scottmsul.substack.com/p/a-bitcoiners-guide-to-proof-of-stake) for a detailed breakdown of these and other issues.

One final note: there are many answers and proposed solutions to these issues, and we're not discounting those or saying that any of these things will happen with 100% certainty, but the tradeoff of all this experimental technology and relying on so many of these inter-related ifs to all go according to plan is not a bet many are willing to make when building a system so foundational to society.

This topic is a rabbit hole, and there are many responses and nuanced arguments to the points raised here. Every developer needs to do their research and decide which tradeoffs are worth it for their values and what they are trying to build.

With that in mind, if you are interested in learning how to build on Bitcoin but wondering how, we're going to cover that next.

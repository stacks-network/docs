# What Is Stacks?

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Frame 316126258.jpg" alt=""><figcaption></figcaption></figure></div>

We can get an idea of the goal and ethos behind Stacks by looking at how Satoshi envisioned generalizing Bitcoin back in 2010:

> "...to be a completely separate network and separate block chain, yet share CPU power with Bitcoin...all networks in the world would share combined CPU power, increasing the total strength."

This is a major theme in the design decisions for Stacks. A bit of a contradiction in the Bitcoin world, the Stacks network is a Bitcoin L2, but it does have its own token. This is an intentional and critical design decision primarily for the purpose of maintaining decentralization, rather than needing to rely on a federation.

If that's confusing or you are skeptical, that's understandable — we'll be diving deeper into these ideas as we go through the docs.

### Stacks and the Purpose of Blockchain Technology

When evaluating new blockchain technologies, it's important to keep the original intent and purpose of them intact. If we go back to Bitcoin, it was originally designed to be:

* Decentralized
* Immutable
* Secure

You've likely heard of the blockchain trilemma — the problem of trying to balance decentralization, scalability, and security of a blockchain network. Stacks takes the approach of solving this trilemma by separating out chains into layers.

So at the bottom, you have the foundational layer: **Bitcoin**.

Bitcoin is the most decentralized, most secure, and most immutable blockchain network. However, that comes with a few tradeoffs.

* Bitcoin is very slow compared to other networks. Bitcoin only has a new block written once every \~10 minutes, making its throughput negligible compared to networks designed for speed like Solana.
* Bitcoin is also "boring". Ethereum came along after Bitcoin and sought to do the same thing for software that Bitcoin did for money. Ethereum's goal is to be a decentralized supercomputer of sorts, serving as a global compute environment for smart contracts (code that is written to a blockchain).
* Bitcoin is not scalable. Because every new block must propagate to every node on the network, Bitcoin can only run as fast as the slowest node in the network.

Now we are seeing the rise of modular blockchain networks like Cosmos that are designed to make it easy for people to spin up their own blockchain networks. While most new blockchain protocols popping up these days see these properties as negatives and seek to eliminate them, the Stacks community sees things differently.

## The Stacks Way

Stacks takes a layered approach: the foundational settlement layer is Bitcoin, and scalability and functionality are added on top of that using layers. There are many different types of L2s and different ways they can be built. They all come with different tradeoffs and have their own way of accomplishing the goals of scalability or functionality.

By taking this layered approach, we are able to have all of the same functionality as chains like Ethereum, but built on Bitcoin.

So Stacks is a Bitcoin layer 2 with some unique properties, like having its own token, that acts as an incentive mechanism to maintain a historical ledger of all of its transactions and operate with its own security budget (in addition to Bitcoin's security budget — more on this in the next section).

This is one of the things that separates Stacks from other Bitcoin layers like Lightning.

* Lightning doesn't add any additional functionality to Bitcoin; it simply helps to scale functionality Bitcoin already has and helps it operate faster. Lightning is also ephemeral — it has no permanent state — and so is unsuitable for things like smart contracts that need to keep track of data and maintain state.
* Contrast this to Stacks, which adds additional functionality to Bitcoin but still ultimately settles to Bitcoin (we'll cover this in the next section as well).

The benefit is that we can maintain a separation of concerns and keep Bitcoin simple and sturdy, chugging along producing blocks, while adding additional layers for functionality and speed. If those other layers were compromised, the foundational layer would remain unaffected.

This is important when building systems intended to be a global decentralized money (Bitcoin) and a decentralized economy built on top of that money (Stacks).

## Why does Stacks have its own token?

The STX token is a separate token used to incentivize honest block production. It does not represent pegged Bitcoin (there is a separate Bitcoin peg called [sBTC](../sbtc/) for that purpose). While this may ruffle some feathers among parts of the Bitcoin community, it has several advantages.

By implementing a token into the Stacks chain, we provide additional economic incentive for miners to produce Stacks blocks honestly.

This token provides additional incentive as a way to grow the chain. Rather than relying on altruism to produce blocks and grow the chain, we can incentivize builders, token-holders, and investors all at the same time by having a token.

The ICO scams of 2017 put a bad taste in many people's mouths, which has justifiably made a lot of people skeptical of every new blockchain project that pops up with a new token. But the problem with many of those projects was they had no actual value, weren't anchored to anything else of value, and provided no real utility.

With a project like Stacks, we have real utility in the sense of serving as a way to utilize Bitcoin and make it a productive asset in a decentralized way. This is a key point: currently the only common ways to make Bitcoin productive are to give it to a custodial service or transfer it off the Bitcoin chain via something like wBTC on Ethereum.

Stacks allows us to do this while ultimately still settling to the Bitcoin chain.

In addition, Stacks allows us to build decentralized and censorship-resistant software utilizing Bitcoin as the foundational settlement layer. Eventually, the goal is to build a network of financial systems and decentralized software products that all utilize Bitcoin as their money.

With that context, let's dive into exactly how Stacks is connected to Bitcoin.

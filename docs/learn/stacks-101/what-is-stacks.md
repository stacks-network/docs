# What Is Stacks?

<figure><img src="../.gitbook/assets/Frame 316126258.jpg" alt=""><figcaption></figcaption></figure>

We can get an idea of the goal and ethos behind Stacks by looking at [how Satoshi envisioned generalizing Bitcoin](https://satoshi.nakamotoinstitute.org/posts/bitcointalk/threads/244/#222) back in 2010:

> "...to be a completely separate network and separate block chain, yet share CPU power with Bitcoin...all networks in the world would share combined CPU power, increasing the total strength."

This is a major theme in the design decisions for Stacks. The Stacks network is a Bitcoin L2, but it has its own token—a bit of a contradiction in the Bitcoin world.

This is an intentional design decision to maintain decentralization without relying on a federation.

If that's confusing or you are skeptical, that's understandable — we'll be diving deeper into these ideas as we go through the docs.

### Stacks and the Purpose of Blockchain Technology

When evaluating new blockchain technologies, it's important to keep the original intent and purpose of them intact. If we go back to Bitcoin, it was originally designed to be:

- Decentralized
- Immutable
- Secure

You've likely heard of the blockchain trilemma — the problem of trying to balance decentralization, scalability, and security of a blockchain network.

Stacks takes the approach of solving this trilemma by separating out chains into layers.

So at the bottom, you have the foundational layer: Bitcoin.

Bitcoin is the most decentralized, most secure, and most immutable blockchain network. However, that comes with a few tradeoffs.

- Bitcoin is very slow compared to other networks. Bitcoin only has a new block written once every \~10 minutes, making its throughput negligible compared to networks designed for speed like Solana.
- Bitcoin is also "boring". Ethereum aimed to do for software what Bitcoin did for money—a decentralized supercomputer for smart contracts.
- Bitcoin is not scalable. Because every new block must propagate to every node on the network, Bitcoin can only run as fast as the slowest node in the network.

Now we are seeing the rise of modular blockchain networks like Cosmos that are designed to make it easy for people to spin up their own blockchain networks.

While most new blockchain protocols popping up these days see these properties as negatives and seek to eliminate them, the Stacks community sees things differently.

### The Stacks Way

Stacks uses a layered approach: Bitcoin as the base settlement layer, with added scalability and functionality on top.

There are many different types of L2s and different ways they can be built. They all come with [different tradeoffs](stacks-among-other-layers.md) and have their own way of accomplishing the goals of scalability or functionality.

By taking this layered approach, we are able to have all of the same functionality as chains like Ethereum, but built on Bitcoin.

Stacks is a Bitcoin L2 with unique properties, including its own token. This token incentivizes maintaining a historical ledger of transactions and provides an additional security budget alongside Bitcoin's.

This is one of the things that separates Stacks from other Bitcoin layers like Lightning.

- Lightning scales Bitcoin's existing functionality and speeds it up but doesn't add new features. It's ephemeral with no permanent state, making it unsuitable for smart contracts that need to track data.
- Contrast this to Stacks, which adds additional functionality to Bitcoin but still ultimately settles to Bitcoin (we'll cover this in the next section as well).

The benefit is separation of concerns: Bitcoin stays simple and secure, producing blocks, while additional layers add functionality and speed. If those layers are compromised, the base remains unaffected.

This is important when building systems intended to be a global decentralized money (Bitcoin) and a decentralized economy built on top of that money (Stacks).

The STX token incentivizes honest block production. It doesn't represent pegged Bitcoin—[sBTC](../sbtc/) does that. This may upset some in the Bitcoin community, but it has advantages.

By implementing a token into the Stacks chain, we provide additional economic incentive for miners to produce Stacks blocks honestly.

The token incentivizes growing the chain, rewarding builders, holders, and investors instead of relying on altruism.

The ICO scams of 2017 put a bad taste in many people's mouths, which has justifiably made a lot of people skeptical of every new blockchain project that pops up with a new token.

Many projects lacked real value, weren't anchored to valuable assets, and offered no utility.

Stacks provides real utility by making Bitcoin productive in a decentralized way. Currently, making Bitcoin productive usually means using custodial services or moving it to chains like Ethereum via wBTC.

Stacks allows us to do this while ultimately still settling to the Bitcoin chain.

Stacks enables building decentralized, censorship-resistant software on Bitcoin. The goal is a network of financial systems and dApps all using Bitcoin as money.

With that context, let's dive into exactly how Stacks is connected to Bitcoin.

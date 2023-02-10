---
title: What is Stacks?
description: An introduction to Stacks
sidebar_position: 1
---

# What is Stacks?

We can get an idea of the goal and ethos behind Stacks by looking at [how Satoshi envisioned generalizing Bitcoin](https://satoshi.nakamotoinstitute.org/posts/bitcointalk/threads/244/#222) back in 2010:

> "...to be a completely separate network and separate block chain, yet share CPU power with Bitcoin...all networks in the world would share combined CPU power, increasing the total strength."

This is major theme in the design decisions for Stacks.

There's a lot of jargon, possible assumptions, controversy, and cool technology wrapped up in those statements. So let's get started by getting a 30,000 foot view of what exactly Stacks is.

## Stacks Explained in (Slightly Less Than) 10 Minutes

<div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
  <iframe
    src="https://www.loom.com/embed/158047e5036b434aa484ae26a1ba6de1"
    frameborder="0"
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}
  ></iframe>
</div>

## Stacks and the Purpose of Blockchain Technology

When evaluating new blockchain technologies, it's important to keep the original intent and purpose of them intact. If we go back to Bitcoin, it was originally designed to be:

- Decentralized
- Immutable
- Secure

You've likely heard of the blockchain trilemma, the problem of trying to balance the decentralization, scalability, and security of a blockchain network.

Stacks takes the approach of solving this trilemma by separating out chains into layers.

So at the bottom, you have the foundational layer: Bitcoin.

Bitcoin is the most decentralized, most secure, and most immutable blockchain network. However, that comes with a few tradeoffs.

Bitcoin is very slow compared to other networks. Bitcoin only has a new block written once every 10 minutes or so, making its throughput negligible compared to networks designed for speed like Solana.

Bitcoin is also boring. Ethereum came along after Bitcoin and sought to do the same thing for software that Bitcoin did for money. Ethereum's goal is to be a decentralized supercomputer of sorts, serving as a global compute environment for smart contracts (code that is written to a blockchain).

Bitcoin is also not scalable. Because every new block must propagate to every node on the network, Bitcoin can only run as fast as the slowest node in the network. Now we are seeing the rise of modular blockchain networks like Cosmos that are designed to make it easy for people to spin up their own blockchain networks.

While most new blockchain protocols popping up these days see these properties as negatives and seek to eliminate them, Stacks takes a different approach.

## The Stacks Way

Stacks takes a pyramid approach, where you have the foundational settlement layer at the bottom (Bitcoin), and then a layer on top of that to add smart contracts and programmability (Stacks), and then layers on top of that for scalability and speed (Hiro's Subnets).

By taking this approach, we are able to have all of the same functionality as chains like Ethereum without all of the drawbacks of having a massively complex chain.

So Stacks is a Bitcoin layer with some unique properties, like having its own token, that allow it to maintain a historical ledger of all of its transactions and operate with its own security budget.

This is one of the things that separates Stacks from other Bitcoin layers like Lightning.

Lightning doesn't add any additional functionality to Bitcoin, it simply helps to scale functionality Bitcoin already has and help it operate faster. Lightning is also ephemeral, it has no permanent state that it keeps track of, and so is unsuitable for things like smart contracts that need to keep track of data and maintain state.

Contrast this to Stacks, which adds additional functionality to Bitcoin but still ultimately settles down to Bitcoin (we'll cover this next in the section on Proof of Transfer).

This is also what separates Stacks from L2 scaling solutions on Ethereum like Polygon or Arbitrum. The benefit we get here is that we can maintain a separation of concerns and keep Bitcoin simple and sturdy, chugging along producing blocks, and add additional layers for functionality and speed. But if those other layers were to be compromised, that would not affect the foundational layer at all.

This is an important property when we are talking about building blockchains that are designed to be a global decentralized money (Bitcoin) and a decentralized economy built on top of that money (Stacks).

![btc-stacks](/img/pox-why-bitcoin.png)

_Sounds like a sidechain_.

Nope. We'll get into the technical details of how this works in the next section, but because Stacks records its entire history to Bitcoin, it is at least as hard to re-org the Stacks chain as it is Bitcoin. This is a key differentiator from side chains, which do not have their history recorded to their primary chain.

Second, Stacks has its own token, it does not represent pegged Bitcoin. While this may ruffle some feathers among some people in the Bitcoin community, it has several advantages.

First, rather than the security of the Stacks chain relying exclusively on system-specific measures the sidechain has implemented to incentivize validators to produce blocks honestly.

What does that actually mean? By implementing a token into the Stacks chain, we provide additional economic incentive for miners to produce Stacks blocks honestly.

This token provides additional incentive in the form of serving as a way to grow the chain. Rather than relying on altruism in order to produce blocks and grow the chain, we can incentivize builders, token-holders, and investors all at the same time by having a token.

The ICO scams of 2017 put a bad taste in a lot of peoples' mouths, which has justifiably made a lot of people skeptical of every new blockchain project that pops up with a new token.

But the problem with all of these projects is that they had no actual value, they weren't anchored to anything else of value and provided no real utility.

With a project like Stacks, we have real utility in the sense of serving as a way to utilize Bitcoin and make it a productive asset **in a decentralized way.** This is a key point, Currently the only way to make Bitcoin productive (meaning use it to make more money) is by giving it to a custodial service or transferring it off the Bitcoin chain by way of something like wBTC on Ethereum.

Stacks allows us to do this while ultimately still settling to the Bitcoin chain.

In addition, Stacks allows us to build decentralized and censorship-resistant software utilizing Bitcoin as the foundational settlement layer. Eventually, the goal is to build a network of financial systems and decentralized software products that all utilize Bitcoin as their money.

A caveat here, a lot of the functionality we've talked about here is still in the early stages, and the highest priority for the ecosystem at the moment is more tightly integrating Stacks with Bitcoin in order to easily use it with Stacks dapps.

With that context, let's dive into some of the technical details of how Stacks operates, starting with Proof of Transfer.

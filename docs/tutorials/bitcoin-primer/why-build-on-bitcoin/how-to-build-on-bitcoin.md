# How to Build on Bitcoin

Until now, developers and users who wanted to build decentralized tools and to build an open, permissionless, decentralized economy didn't have much choice other than Ethereum or other chains like Solana, Avalanche, NEAR, etc.

Sure, we can build apps that utilize Bitcoin, but not at much more than the saving and payment level. I'm not discounting the importance of these things, but they aren't of much interest to developers and they aren't enough on which to build an economy.

We can't create a decentralized financial system using only Bitcoin. If you want to do things with your Bitcoin other than buy, hold, or pay (and even that is tough), you need to use centralized services and trusted intermediaries, or bridge over to other ecosystems.

If we want decentralized money, we also need the infrastructure and tools utilizing that money to be decentralized as well.

What are some examples of this? Many DeFi tools tend to function much like ponzis, but how we can recreate existing financial instruments and come up with new ones that not only utilize Bitcoin as the money but also run on rails that are decentralized as well?

Can we use Bitcoin in order to create decentralized financial products that are built on real money instead of thin air?

A decent framework for understanding the use cases here is to think of anything that utilizes a contractual agreement between two parties. Once you start to think about this, you realize that almost every interaction you have in your daily life involves something like this.

The majority of these are "handshake agreements" between two trusted parties, but a significant chunk of them are more official agreements with paperwork and terms laid out between two parties that may or may not have a personal relationship.

Or look at any existing financial instrument like loans and investments. How can we build these on decentralized rails so that they are accessible to everyone?

These are good examples of where smart contracts can help.

Loans are a prime example. If you want to borrow or lend Bitcoin in exchange for interest, you currently have to go through a centralized entity and custody your Bitcoin. If we can make that system decentralized as well, we unlock a whole new category of activity, utilizing Bitcoin, but without having to go through centralized entities.

We can use things like DLCs to recreate some of this functionality, but DLCs are still relatively limited in what they can accomplish.

Remember that Bitcoin itself is designed to create a form of money that is permissionless and trust-minimized. Smart contracts are a way for us to take the actions that we actually take with that money and make them decentralized and trust-minimized as well.

So how can we unlock robust smart contract functionality for Bitcoin without modifying the crucial properties that make it so secure and decentralized?

That's where Bitcoin layers come in.

This will be the main focus of the second half of this course, as we go in-depth into how to build things on Bitcoin using the Stacks L2 and the Clarity smart contract language.

For now, let's get a high-level overview of the earlier claim that we can build apps with comparable functionality to Ethereum on Bitcoin without modifying the core protocol.

### Bitcoin's Limited Functionality

The first thing we need to understand is that Bitcoin does have some fundamental programming ability utilizing its programming language, Script.

However, what you can do with it is limited. We'll be covering this in great detail in future lessons, but you can't fundamentally trigger certain actions to happen based on Bitcoin transactions, you can't utilize any real-world data from oracles, and you can't create a robust state management system.

Outside of very limited use cases like DLCs or HTLCs, you can't write expressive smart contracts on Bitcoin.

Similarly, Bitcoin can handle only a few transactions per second, so the transactions don't scale well. Again, this is by design as it helps to keep the requirements to run a full node very low, increasing decentralization.

Bitcoin layers can solve both of these problems. For now, we'll take a brief look at two of them: Lightning for scaling and Stacks for smart contracts.

### Bitcoin Layer 2 Solutions

#### Lightning <a href="#heading-lightning" id="heading-lightning"></a>

Lightning is a P2P scaling solution for Bitcoin that utilizes Bitcoin's native script language and HTLCs to create a payment solution that can handle more transactions per second than the Visa network.

It allows users to open channels with each other, make a series of transactions, and then write them all back to the main chain as a single batch transaction.

Individual transactions occur off-chain on the P2P Lightning network and then settle back to Bitcoin. This allows for much faster transactions and a high capacity but fundamentally does not expand the functionality of Bitcoin.

That's where things like Stacks come in.

Lightning is very interesting and will likely play a key role in the growth, evolution, and adoption of Bitcoin as usage grows, but it suffers from some key shortcomings that need to be overcome (things like liquidity issues) and doesn't enable us to build decentralized financial systems or more complex programming systems.

#### Stacks <a href="#heading-stacks" id="heading-stacks"></a>

Where Lightning allows the Bitcoin network to scale as far as the capacity for payments, Stacks is what expands the functionality and allows us to write smart contracts.

We'll cover Stacks in detail in the second half of this course, but the short version is that Stacks is a blockchain protocol that is connected to Bitcoin via its proof of transfer consensus mechanism.

It has its own token but is anchored to Bitcoin and can't exist without Bitcoin.

It allows for fully expressive smart contract functionality using a language called Clarity, which is designed for security and safety.

The takeaway is that Stacks allows us to write smart contracts for Bitcoin, and with sBTC, allows us to do this _using_ Bitcoin itself, so Stacks can function more like an invisible programming layer, all done in a trust-minimized and decentralized manner.

The key takeaway is that it allows us to create the same level of functionality on Ethereum but on Bitcoin, without changing any of the things that make Bitcoin resilient.

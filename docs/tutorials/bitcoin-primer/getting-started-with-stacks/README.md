---
icon: rocket-launch
---

# Getting Started with Stacks

Up until now, we've lived mainly inside of Bitcoin itself, learning about the internals of how it works.

During that, we've also been exposed to some of the main drawbacks of attempting to build fully decentralized applications on Bitcoin.

First, it is difficult. The existing tooling for Bitcoin is not great for building apps like you would with Ethereum. It's confusing, clunky, and difficult to build robust apps, especially for someone used to making things on the web.

There isn't actually much programming. We have mainly worked directly with Bitcoin transactions in the command line.

If you paid attention to the last tutorial, you might be wondering how we would actually go about creating a real app with a web interface.

For example, we talked about how the main functionality of Bitfund is to operate as a decentralized crowdfunding mechanism. But how would we use Bitcoin script to maintain an escrow system or implement safeguards where backers could get their funds back if certain milestones were not met?

There are ways we could do these things, but they would involve trusting a custodian to handle the Bitcoin and do what is necessary with it, which is exactly what we are trying to avoid.

Or on the flip side, it would require backers to completely trust the person requesting the funding, another problem we want to avoid.

And how would the user interact with the web app like they would using something like Metamask for Ethereum?

What we would likely have to do is use that JS library to create something like a QR code with a pre-formatted transaction, we could then scan that with a mobile wallet and send a Bitcoin transaction.

That's a terrible UX for what should be as simple as interacting with a web app to make a basic payment transfer.

What if we wanted to create an app where someone could lend that Bitcoin out in a decentralized way? Or mint an NFT for some record of ownership? There's no way to do those things with Bitcoin transactions alone.

With a Stacks and Clarity based smart contract approach, all of the verification is happening in a Clarity smart contract on the Stacks chain, which works in lockstep with Bitcoin.

We don't need to completely trust someone else with our Bitcoin in order to actually use it.

Instead, we can leverage the power of Clarity to programmatically verify certain conditions that will allow the BTC to be either released to the project creator or sent back to the backers.

This process is what we'll be covering in the remainder of the course and will serve as the foundation for how we build decentralized financial tools and a decentralized economy on top of Bitcoin.

sBTC is the linchpin that makes all this possible and we'll be covering it in detail as we go through.

For now, let's get set up for Stacks development.

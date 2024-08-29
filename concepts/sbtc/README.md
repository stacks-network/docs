# sBTC

To understand sBTC, we first need to understand the current limitations of Bitcoin (BTC).

Bitcoin is to date the most secure and decentralized blockchain. While Bitcoin is the largest cryptocurrency by market cap, comparatively few applications exist within the Bitcoin ecosystem. Developers interested in building applications for the Bitcoin community often find it difficult or impossible to implement their logic directly on the Bitcoin chain. Although Bitcoin has a simple scripting system built in, it lacks the expressiveness of many other smart contract languages.

sBTC is for:

* Bitcoin holders who want to participate in smart contracts.
* Developers who want to build applications on Bitcoin.

sBTC empowers developers to build applications on Bitcoin by bridging Bitcoin and [Stacks](https://www.stacks.co/). We achieve this by introducing a fungible token (sBTC) on the Stacks blockchain. The token has the following properties:

* **1:1 redeemability**. sBTC can always be exchanged 1:1 for BTC on the Bitcoin chain, as long as the Stacks blockchain is operational.
* **Open membership**. Anyone can participate in the sBTC protocol. No centralized entity maintains custody over any BTC in the protocol.

Other tokens which try to achieve the same end as sBTC are

* [xBTC](https://www.stacks.co/blog/tokensoft-wrapped-fundamental-bitcoin-defi-building-blocks-xbtc)

While these tokens all achieve the same value as BTC, they maintain BTC reserves through trusted entities. sBTC is the only truly decentralized Bitcoin backed asset on Stacks.

## How does sBTC work?

Bitcoin holders can do two things to interact with sBTC, deposit and withdraw. Both of these operations are controlled through special Bitcoin transactions.

To deposit BTC into sBTC, a Bitcoin holder would create a deposit transaction on the Bitcoin chain. This deposit transaction informs the protocol how much BTC the holder has deposited, and to which Stacks address the holder wishes to receive the sBTC. The sBTC system responds to the deposit transaction by minting sBTC to the given Stacks address.

To withdraw BTC, a Bitcoin holder creates a withdrawal transaction on the Bitcoin chain. This withdrawal transaction informs the protocol how much sBTC the holder wishes to withdraw, from which stacks address the sBTC should be withdrawn and which Bitcoin address should receive the withdrawn BTC. In response to this transaction, the sBTC system burns the requested amount of sBTC from the given Stacks address and fulfills the withdrawal by issuing a BTC payment to the given BTC address with the same amount.

The following diagram illustrates the deposit and withdrawal flows.

<figure><img src="../../.gitbook/assets/Diagram Feb 2 2024.png" alt=""><figcaption></figcaption></figure>

Next let's take a deeper look at the design of sBTC.

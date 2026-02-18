# What Is Stacks?

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Frame 316126258.jpg" alt=""><figcaption></figcaption></figure></div>

Stacks is a Bitcoin layer for smart contracts; it enables smart contracts and decentralized\
applications to use Bitcoin as an asset in a trust-minimized way and settle transactions on the\
Bitcoin blockchain.

Stacks is a different type of Bitcoin layer for smart contracts than sidechains, with a deeper,\
ongoing connection to Bitcoin. Stacks enables applications and smart contracts to use\
BTC as their asset or money and to settle their transactions on the Bitcoin main chain. **The goal**\
**of Stacks is to grow the Bitcoin economy, by turning BTC into a productive rather**\
**than passive asset, and by enabling various decentralized applications.**&#x20;

The Stacks layer has its own global ledger and execution environment, to support smart contracts and to not overwhelm the Bitcoin blockchain with additional transactions. However, the Stacks layer is unique as it has most of the ideal properties that native Bitcoin smart contracts would have, but it does this without needing to add additional functionality or complexity to Bitcoin. It also provides mechanisms for higher performance and additional functionality, such as fast block times and the decentralized peg.

As a Bitcoin layer, Stacks has the following innovations that make it unique:

<details>

<summary><strong>Secured by Bitcoin</strong></summary>

Secured by Bitcoin: enables Bitcoin finalization for Stacks transactions; transactions that\
happen on the Stacks layer are secured by the entire hash power of Bitcoin. Meaning that to\
reverse these transactions, an attacker will need to reorg Bitcoin. Such transactions settle on\
Bitcoin and have Bitcoin finality. Further, the Stacks layer forks with Bitcoin, so any state\
on Stacks automatically follows the Bitcoin forks.

</details>

<details>

<summary><strong>Trust-minimized Bitcoin peg</strong></summary>

Trust-minimized Bitcoin peg: lays the foundation for a novel decentralized, noncustodial, Bitcoin-pegged asset, sBTC, so smart contracts can run much faster and more\
cheaply using the Bitcoin-pegged asset with minimal counterparty risk. This also enables\
contracts on the Stacks layer to write to Bitcoin through the peg-out transactions without\
needing to rely on a centralized, closed set of entities. Atomic swaps and assets: Stacks\
already has atomic BTC swaps and enables Bitcoin addresses to own and move assets\
defined on the Stacks layer. Magic swaps and Catamaran swaps are examples of\
decentralized atomic swaps between BTC on Bitcoin L1 and assets on the Stacks layer that\
are already live. Further, users can own Stacks layer assets like STX, stablecoins, and NFTs\
on Bitcoin addresses and transfer them using Bitcoin L1 transactions if they prefer.

</details>

<details>

<summary><strong>Clarity language</strong></summary>

Clarity language: supports Clarity, a safe, decidable language for provable smart\
contracts. With Clarity, developers can know with mathematical certainty what a contract\
can and cannot do, even before executing it. The decentralized peg contract will benefit\
from the safety properties of the Clarity language. Of particular note, Clarity WASM is a\
change being made to the Clarity VM that provides significantly faster execution times,\
along with creating a potential path to Rust and Solidity developers being able to write\
smart contracts on Stacks, although this work is not part of the Nakamoto release.

</details>

<details>

<summary><strong>Knowledge of Bitcoin state</strong></summary>

Knowledge of Bitcoin state: has knowledge of the full Bitcoin state; it can trustlessly read\
Bitcoin transactions and state changes and execute smart contracts triggered by Bitcoin\
transactions. The Bitcoin read functionality helps to keep the decentralized peg state\
consistent with BTC locked on Bitcoin L1, amongst other things.

</details>

<details>

<summary><strong>Scalable, fast transactions</strong></summary>

Scalable, fast transactions: will provide high performance and scalability through several\
mechanisms, including faster Stacks layer blocks. Further, scalability layers like subnets\
can make different tradeoffs between performance and decentralization than the main\
Stacks layer.

</details>

We can get an idea of the goal and ethos behind Stacks by looking at how Satoshi envisioned generalizing Bitcoin back in 2010:

> _"...to be a completely separate network and separate block chain, yet share CPU power with Bitcoin...all networks in the world would share combined CPU power, increasing the total strength."_

This is a major theme in the design decisions for Stacks. A bit of a contradiction in the Bitcoin world, the Stacks network is a Bitcoin L2, but it does have its own token. This is an intentional and critical design decision primarily for the purpose of maintaining decentralization, rather than needing to rely on a federation. If that's confusing or you are skeptical, that's understandable — we'll be diving deeper into these ideas as we go through the docs.

### Core technical components of Stacks

{% stepper %}
{% step %}
#### Proof of Transfer

Proof of Transfer (PoX) is the block production mechanism of the Stacks chain. Essentially, it attempts to recreate the block production patterns of PoW programmatically. Stacks miners spend BTC for a chance to mine new Stacks blocks. Under the hood, this block production mechanism anchors Stacks blocks to Bitcoin blocks, making it as hard to reverse a Stacks block as it is to reverse a Bitcoin block. That's a big claim, and we unpack it in further detail in the sections on Nakamoto block production.

[Learn more about PoX](proof-of-transfer.md)
{% endstep %}

{% step %}
#### Stacks' Native Token: STX

The Stacks layer’s native token (STX) is essential to PoX consensus: STX is needed for (a) incentivizing Stacks miners to maintain the Stacks layer global ledger outside the Bitcoin L1, and (b) incentives for threshold signers that participate in the peg mechanism. Existing approaches to Bitcoin pegs, which lack a native token, cannot support a permissionless, open system and fallback to using custodians or trusting known federation members.
{% endstep %}

{% step %}
#### Clarity

Clarity is the smart contract language that Stacks uses. It has been designed from the ground up to make it easier for developers to write safe, secure smart contracts. Additionally, since it has been purpose-built for Stacks and Bitcoin, there are built-in functions for reading Bitcoin state, which means you can use Bitcoin state to perform actions in Clarity. For example, you could set up a check to make sure a particular Bitcoin transaction has occurred before executing a mint function in Clarity, which just so happens to be what happens with the third component: sBTC.

[Learn more about Clarity](../clarity/)
{% endstep %}

{% step %}
#### sBTC

sBTC is the trust-minimized 2-way Bitcoin peg on the Stacks layer. sBTC is the key to making Bitcoin programmable and bringing full smart contract functionality to Bitcoin via Stacks. sBTC is not a federation, but operates as an open-network, decentralized 2-way peg solution to bring smart contract functionality to Bitcoin with as little counterparty risk as possible.

[Learn more about sBTC](../sbtc/)
{% endstep %}
{% endstepper %}

<details>

<summary><strong>Stacks and the Purpose of Blockchain Technology</strong></summary>

When evaluating new blockchain technologies, it's important to keep the original intent and purpose of them intact. If we go back to Bitcoin, it was originally designed to be:

* Decentralized
* Immutable
* Secure

You've likely heard of the blockchain trilemma — the problem of trying to balance decentralization, scalability, and security of a blockchain network. Stacks takes the approach of solving this trilemma by separating out chains into layers.

So at the bottom, you have the foundational layer: **Bitcoin**. Bitcoin is the most decentralized, most secure, and most immutable blockchain network. However, that comes with a few tradeoffs:

* Bitcoin is very slow compared to other networks. Bitcoin only has a new block written once every \~10 minutes, making its throughput negligible compared to networks designed for speed like Solana.
* Bitcoin is also "boring". Ethereum came along after Bitcoin and sought to do the same thing for software that Bitcoin did for money. Ethereum's goal is to be a decentralized supercomputer of sorts, serving as a global compute environment for smart contracts (code that is written to a blockchain).
* Bitcoin is not scalable. Because every new block must propagate to every node on the network, Bitcoin can only run as fast as the slowest node in the network.

Now we are seeing the rise of modular blockchain networks like Cosmos that are designed to make it easy for people to spin up their own blockchain networks. While most new blockchain protocols popping up these days see these properties as negatives and seek to eliminate them, the Stacks community sees things differently.

</details>

### The Stacks Way

{% embed url="https://www.youtube.com/watch?v=U49tMeCLgnY" %}

Stacks takes a layered approach: the foundational settlement layer is Bitcoin, and scalability and functionality are added on top of that using layers. There are many different types of L2s and different ways they can be built. They all come with different tradeoffs and have their own way of accomplishing the goals of scalability or functionality.

By taking this layered approach, we are able to have all of the same functionality as chains like Ethereum, but built on Bitcoin.

So Stacks is a Bitcoin layer 2 with some unique properties, like having its own token, that acts as an incentive mechanism to maintain a historical ledger of all of its transactions and operate with its own security budget (in addition to Bitcoin's security budget — more on this in the next section).

This is one of the things that separates Stacks from other Bitcoin layers like Lightning.

* Lightning doesn't add any additional functionality to Bitcoin; it simply helps to scale functionality Bitcoin already has and helps it operate faster. Lightning is also ephemeral — it has no permanent state — and so is unsuitable for things like smart contracts that need to keep track of data and maintain state.
* Contrast this to Stacks, which adds additional functionality to Bitcoin but still ultimately settles to Bitcoin (we'll cover this in the next section as well).

The benefit is that we can maintain a separation of concerns and keep Bitcoin simple and sturdy, chugging along producing blocks, while adding additional layers for functionality and speed. If those other layers were compromised, the foundational layer would remain unaffected. This is important when building systems intended to be a global decentralized money (Bitcoin) and a decentralized economy built on top of that money (Stacks).

With that context, let's dive into exactly how Stacks is connected to Bitcoin.

***

### Additional Resources

* \[[Stacks YT](https://www.youtube.com/watch?v=BmejRmkLxZU)] Muneeb gives a talk at the Stacks 2.0 Mainnet Launch event on January 14, 2021.

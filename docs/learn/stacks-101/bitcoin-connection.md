# The Bitcoin Connection

<figure><img src="../.gitbook/assets/Frame 316126254.jpg" alt=""><figcaption></figcaption></figure>

In the previous section, we described Stacks as bringing smart contract functionality to Bitcoin, without modifying Bitcoin itself, and explained a bit about how the chain works.

That's a big promise, but how does Stacks actually deliver on it? And what makes Stacks unique among other Bitcoin layers and other blockchains like Ethereum?

Before we get into the technical details of how Stacks works, it's important to get a high-level overview of the problem it's solving and how it actually does that. We'll dive deeper into some of these topics as we go through the docs, but it's good to get a high-level picture to bring everything together.

This topic is deep, and the section is long, but it provides an in-depth understanding of the problem Stacks solves and how.

Let's get into it.

### Is Stacks a Bitcoin L2?

Stacks is a Bitcoin layer for smart contracts. Classification as L1, L2, or sidechain depends on the definition. Generally, L1 chains are sovereign with their own security budget and can survive independently. L2 chains share the L1's security and can't survive without it. We cover different L2 designs and Stacks' comparison in [Stacks Among Other Bitcoin Layers](stacks-among-other-layers.md).

The initial Stacks release in early 2021 had its own security budget separate from Bitcoin L1. Though it couldn't function without Bitcoin, developers called it a unique system, sometimes 'layer 1.5' (see [Decrypt article](https://decrypt.co/82019/bitcoin-defi-thing-says-stacks-founder-muneeb-ali)).

The upcoming Nakamoto release will eliminate Stacks' separate security budget. 100% of Bitcoin's hash power will determine Stacks' finality. To reorganize Stacks blocks, an attacker must reorganize Bitcoin L1 itself—a hard task providing strong security. See the [Stacks paper](https://stacks.co/stacks.pdf) for details.

The [Ethereum L2 definition](https://ethereum.org/en/layer-2/) focuses on withdrawing assets using only L1 security. By this, Stacks isn't a clear L2 because peg-out signers control sBTC withdrawals. Bitcoin can't verify this without L1 changes. Also, assets are issued on L2s, not L1 (except BTC). So, 'settlement on Bitcoin' matters more—is data secured by 100% of Bitcoin's hash power?

Bitcoin L2s expand functionality and scalability, so their goals differ based on the L1's capabilities.

Users and developers call Stacks a Bitcoin L2 for simplicity. Key properties support this:

{% stepper %}
{% step %}
**Bitcoin finality**

100% of the Bitcoin hashpower decides block ordering and transaction finality.
{% endstep %}

{% step %}
**Consensus runs on Bitcoin L1**

Stacks consensus runs on Bitcoin L1, and Stacks L2 cannot operate or survive without Bitcoin L1.
{% endstep %}

{% step %}
**sBTC and economic unit**

With the upcoming decentralized Bitcoin peg, called sBTC, most of the economy on Stacks layer will likely use BTC as the unit of economy. It is expected that most users will simply use Bitcoin in wallets and apps and then peg out their BTC to Bitcoin L1.
{% endstep %}

{% step %}
**Data hashed and stored on Bitcoin L1**

All data and transactions on Stacks are automatically hashed and permanently stored on Bitcoin L1 on every Bitcoin block. Anyone can verify that some data on Stacks is valid by checking the corresponding hash on Bitcoin L1. This compact storage of hashes on L1 is somewhat similar to rollups (although there are other differences). You can read more about this process in the [Block Production](../block-production/) section.
{% endstep %}

{% step %}
**Contracts can read Bitcoin L1**

Contracts on Stacks layer can read Bitcoin L1 transactions and respond to them. Assets on Stacks layer can be moved simply through Bitcoin L1 transactions.
{% endstep %}
{% endstepper %}

Why do some think Stacks isn't a Bitcoin L2? Common reasons:

{% stepper %}
{% step %}
**Old security-budget material**

The initial Stacks version (released early 2021) had a separate security budget, which changed to following 100% Bitcoin hash power with the Nakamoto release. Old materials and blog posts still reference the initial version but will likely be updated.
{% endstep %}

{% step %}
**Ethereum L2 withdrawal definition doesn't map cleanly**

The Ethereum L2 definition requires withdrawing base-layer assets via an L1 transaction using only L1 security (true for Lightning). This doesn't apply cleanly to Bitcoin L2s because assets are defined on L2s, not L1. The only relevant asset is pegged BTC. In the upcoming Stacks release, users withdraw BTC with a Bitcoin L1 transaction, but L1 can't validate it, requiring majority peg-out signer approval. Bitcoin miners could validate if L1 changes, but Stacks optimizes for decentralization without L1 changes. Future L1 upgrades could improve this.
{% endstep %}

{% step %}
**Healthy Bitcoin skepticism**

Bitcoin community members are generally skeptical of claims and on the lookout for people making any false marketing claims. This is generally a healthy thing for the Bitcoin ecosystem and builds up the immune system. Some such community members might be skeptical about Stacks as a Bitcoin layer or L2 until they fully read the technical details and reasoning. There is a good [Twitter thread](https://twitter.com/lopp/status/1623756872976158722?s=20) about this topic as well.
{% endstep %}
{% endstepper %}

Why not call Stacks a sidechain? Sidechains usually have separate security budgets, subset of miners, consensus on the sidechain, and don't publish data on Bitcoin L1. Stacks doesn't fit: consensus on Bitcoin L1, follows Bitcoin finality, publishes data on L1.

Can Stacks layer work with rollups?

Yes! There's active R\&D to integrate rollups with Stacks. The challenge is moving BTC in and out. The decentralized [sBTC](../sbtc/) peg works for both Stacks and sovereign rollups. Without Bitcoin L1 changes, sBTC's decentralized signers provide the most trust-minimized way. Future Bitcoin upgrades for validity rollups could let Stacks benefit too.

With sBTC, sovereign rollups become more appealing. Stacks could provide decentralized signers for trust-minimized BTC in rollups, with data availability from Bitcoin L1 via Ordinals.

### Why Does Stacks Need a Token?

This leads to a key debate in crypto and Bitcoin: do blockchains need tokens?

Tokens exist to fund blockchain maintenance and progress.

Bitcoin is a token that incentivizes miners to add blocks. Rewards follow a schedule; after they end, the chain relies on fees.

Blockchains maintain permanent transaction records. Tokens incentivize securing and maintaining the chain.

Networks like Lightning don't need tokens because they don't maintain historical records. Channels use multisigs; state disappears when closed. For global financial systems, incentives are crucial.

In Stacks' context, it provides smart contracts for Bitcoin, serving as rails for a decentralized economy.

Bitcoin community members are rightly skeptical of new tokens. Many projects force tokens unnecessarily. Stacks' founders are Bitcoin builders with history of tokenless apps (e.g., BNS in 2015 using OP_RETURN). Why a token for Stacks L2? Let's explore.

The STX token serves two main purposes:

{% stepper %}
{% step %}
**Incentives for Stacks L2 miners**

Newly minted STX are used to incentivize decentralized block production on Stacks L2.
{% endstep %}

{% step %}
**Incentives for peg-out signers**

Signers participating in peg-out operations receive incentives in STX to economically align them with protocol rules.
{% endstep %}
{% endstepper %}

To remove the token, Stacks would need a federated network like Liquid, where pre-selected companies control mining and peg-outs.

Stacks' developers aimed for an open, permissionless system. Decentralized mining requires incentives, like Bitcoin's new BTC for miners. Anyone with BTC can mine Stacks L2.

sBTC's signers are open and permissionless, incentivized to follow protocol. Federations require trusting pre-set members for peg-outs. Stacks' developers wanted decentralized BTC movement, enabled by economic incentives—a token.

{% hint style="info" %}
With more and more Bitcoin layers emerging, there is some nuance in this federated vs open network design. Some protocols like Botanix's Spiderchain offer an open network but have different incentive mechanisms. We dig into these in detail in the [Stacks Among Other Layers](stacks-among-other-layers.md) section.
{% endhint %}

STX also pays gas fees. With sBTC, the economy will use BTC as the unit. Users will interact with Bitcoin, paying fees with BTC via atomic swaps. BTC can't incentivize mining; only new protocol assets can, like in Bitcoin—hence the token.

### The Symbiotic Relationship Between Stacks and Bitcoin

Stacks and Bitcoin complement each other. Stacks uses Bitcoin's decentralization, PoW, and value.

Stacks complements Bitcoin by enabling new use cases, increasing its value. This helps Bitcoin's long-term maintenance after mining rewards end, relying on fees.

If Bitcoin is just a store of value, transactions have low economic density. As a foundation for a decentralized economy, transactions gain value, boosting fees. This incentivizes miners as rewards decrease.

### Reading from Bitcoin State

Stacks' superpower is programmatic Bitcoin access, beyond protocol connection.

Clarity, Stacks' smart contract language, enables this functionality.

Clarity accesses Bitcoin state via Stacks' PoX. Each Stacks block links to a Bitcoin block, querying header hashes with [`get-burn-block-info?`](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md#new-method-get-burn-block-info).

It takes a Bitcoin block height and returns the header hash. [`burn-block-height`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-keywords#burn-block-height) gives the current Bitcoin block height.

`get-burn-block-info?` returns data only for processed blocks after Stacks' launch. To check Bitcoin events, wait at least one block.

This is the first step for Clarity as Bitcoin's programming layer. For a BTC transaction, the Clarity contract must detect it. This can be manual using Clarity functions and the [BTC library](https://explorer.stacks.co/txid/0x8b112f2b50c1fa864997b7496aaad1e3940700309a3fdcc6c07f1c6f8b9cfb7b?chain=mainnet), like [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html).

{% hint style="info" %}
Note that this process is made easier by the additional Clarity functions added in 2.1, like the `get-burn-block-info?` function we looked at above.
{% endhint %}

Automation is possible with event-based architecture, like Hiro's [chainhooks](https://www.hiro.so/blog/meet-4-new-features-in-clarinet#setting-up-trigger-actions-with-chainhooks), triggering Clarity calls on BTC transactions (with some centralization).

This is the first component for building Bitcoin dApps on Stacks: read access to the Bitcoin chain.

Next, let's explore how Stacks is 'built on Bitcoin' through its block production: Proof of Transfer.

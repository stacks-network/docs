---
description: >-
  This page breaks down what exchanges should expect in terms of the upgrade and
  timing for Nakamoto. This upgrade will be follow the standard update process.
---

# Nakamoto for Exchanges

<details>

<summary>What is the Nakamoto upgrade?</summary>

The Nakamoto release brings many new capabilities and improvements to the Stacks blockchain by focusing on a set of core advancements: improving transaction speed, enhancing finality guarantees for transactions, mitigating Bitcoin miner MEV (miner extractable value) opportunities that affect PoX, and boosting robustness against chain reorganizations. This strategic upgrade aims to solidify trust in the Stacks network, offer greater alignment with Bitcoin's immutable nature, and foster an environment ripe for advanced Decentralized Finance (DeFi) applications. The expected outcome is a versatile, scalable, and secure platform that closely integrates with, yet distinctly enhances, the Bitcoin ecosystem.\
\
Learn more: [nakamoto-in-10-minutes.md](../what-is-the-nakamoto-release/nakamoto-in-10-minutes.md "mention")

</details>

### What does the Nakamoto upgrade mean for exchanges?

The main thing exchanges will notice when the Nakamoto rollout is complete is the faster blocks! Gone are the days of waiting for Bitcoin blocks for confirmations. In addition to fast blocks, exchanges will benefit from:

* Smoother block production
* No forking at the Stacks layer, once a transaction is confirmed in an anchor block, it is as irreversible as a Bitcoin transaction (and therefore, can update confirmation rules (number of confirmations) to match Bitcoin's)
* For exchanges offering Stacking pools, likely increased BTC rewards thanks to MEV improvements

{% hint style="info" %}
Note: These new Nakamoto features will **not** be available on the network until the [second hard fork](nakamoto-for-exchanges.md#timeline) as described in the rollout plan. This is to allow time for Signers to onboard on the network. **Learn more:** [.](./ "mention")
{% endhint %}

### How should exchanges prepare for the upgrade?

This upgrade will feel very familiar. You will be able to follow the usual process and it won’t even require a genesis sync. In addition, the corresponding API upgrade is non-schema-breaking, so no event replay is needed. In other words, the Nakamoto upgrade will look and feel like a simple hotfix update/node update vs. previous major hard forks.

**Upgrade Steps:**

1. Download and install binaries/docker images which will be provided directly in your dedicated support channel and linked here when ready
2. Restart the node

Note: If you’re running a Stacking pool (Signer), you may have extra steps. Please start by visiting the documentation [here](https://docs.stacks.co/nakamoto-upgrade/running-a-signer) or getting in touch via your dedicated Telegram channel.

### Timeline

You can learn more about the 2-step rollout structure here: [.](./ "mention") including a simple graphic of the timeline.

There are two steps for Nakamoto rollout exchanges should be aware of:

1. **Instantiation block:** The first hard fork occurs <mark style="color:orange;">at Bitcoin block 840,360</mark> which is currently projected for \~April 22nd. You can check the [real-time projection here](https://stacks-network.github.io/when-activation/2.5/). At this time, exchanges will need to upgrade to the latest node software or they will not process valid blocks and users will not be able to move funds on the network.
2. **Activation block:** The second hard fork occurs around August 28. At this time, the Nakamoto consensus rules will activate, meaning the new Nakamoto features will be made live. Exchanges will need to repeat the upgrade process at this time. Again, no genesis sync, just a download and restart.

### Other Recommendations:

* With just a bit of extra work, exchanges can support the [Stacks SIP-10 token standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md). This allows an exchange to easily list any of a growing number of tokens built on Stacks as well as the upcoming [sBTC asset](broken-reference/).
* Exchanges that already offer staking type services to their users (programs often called Earn/Stake/etc.) should consider adding [Stacking](../../stacks-101/stacking.md) to their platform alongside other offerings. Users can earn BTC by participating in Stacks consensus through a simple pool.

### Resources:

* [Testnet documentation](https://docs.stacks.co/nakamoto-upgrade/nakamoto)
* [API documentation](https://docs.hiro.so/nakamoto/stacks-js)
* [Binaries](https://github.com/stacks-network/stacks-core/releases/tag/2.5.0.0.2)
* [Docker Images](https://hub.docker.com/r/blockstack/stacks-core/tags?page=1\&name=2.5.0.0.2)
* [Stacks Blockchain API](https://github.com/hirosystems/stacks-blockchain-api/releases/tag/v7.10.0)
* [Stacks Blockchain API Docker Images](https://hub.docker.com/r/hirosystems/stacks-blockchain-api/tags?page=1\&name=7.10.0)

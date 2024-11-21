# Nakamoto for Exchanges

<details>

<summary>What is the Nakamoto upgrade?</summary>

The Nakamoto release brings many new capabilities and improvements to the Stacks blockchain by focusing on a set of core advancements: improving transaction speed, enhancing finality guarantees for transactions, mitigating Bitcoin miner MEV (miner extractable value) opportunities that affect PoX, and boosting robustness against chain reorganizations. This strategic upgrade aims to solidify trust in the Stacks network, offer greater alignment with Bitcoin's immutable nature, and foster an environment ripe for advanced Decentralized Finance (DeFi) applications. The expected outcome is a versatile, scalable, and secure platform that closely integrates with, yet distinctly enhances, the Bitcoin ecosystem.\
\
Learn more: [nakamoto-in-10-minutes.md](../nakamoto-in-10-minutes.md "mention")

</details>

### What does the Nakamoto upgrade mean for exchanges?

The main thing exchanges will notice when the Nakamoto rollout is complete is the faster blocks! Gone are the days of waiting for Bitcoin blocks for confirmations. In addition to fast blocks, exchanges will benefit from:

* Smoother block production
* No forking at the Stacks layer, once a transaction is confirmed in an anchor block, it is as irreversible as a Bitcoin transaction (and therefore, can update confirmation rules (number of confirmations) to match Bitcoin's)
* For exchanges offering Stacking pools, likely increased BTC rewards thanks to MEV improvements



### Other Recommendations:

* With just a bit of extra work, exchanges can support the [Stacks SIP-10 token standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md). This allows an exchange to easily list any of a growing number of tokens built on Stacks as well as the upcoming [sBTC asset](broken-reference/).
* Exchanges that already offer staking type services to their users (programs often called Earn/Stake/etc.) should consider adding [Stacking](../../concepts/block-production/stacking.md) to their platform alongside other offerings. Users can earn BTC by participating in Stacks consensus through a simple pool.
* The Stacks Foundation is seeking a handful of exchanges to pilot rapid BTC withdrawals via the upcoming sBTC asset, expected to closely follow the Nakamoto hard fork. Interest exchange can reach out to their usual point of contact or complete [this form](https://stacks.org/exchanges).

### Resources:

* [Testnet documentation](https://docs.stacks.co/nakamoto-upgrade/nakamoto)
* [API documentation](https://docs.hiro.so/nakamoto/stacks-js)
* [Core Binaries](https://github.com/stacks-network/stacks-core/releases/tag/3.0.0.0.0)
* [Signer Binary](https://github.com/stacks-network/stacks-core/releases/tag/signer-3.0.0.0.0.0)
* [Core Docker Images](https://hub.docker.com/r/blockstack/stacks-core/tags?page=1\&name=3.0.0.0.0)
* [Signer Docker Image](https://hub.docker.com/r/blockstack/stacks-signer/tags?page=1\&name=3.0.0.0.0.0)
* [Stacks Blockchain API](https://github.com/hirosystems/stacks-blockchain-api/releases/tag/v7.10.0)
* [Stacks Blockchain API Docker Images](https://hub.docker.com/r/hirosystems/stacks-blockchain-api/tags?page=1\&name=7.10.0)

---
description: Official and Community Tools for Building with Stacks
---

# Stacks Devtools Ecosystem

<div data-with-frame="true"><figure><img src=".gitbook/assets/devtools-ecosystem.png" alt=""><figcaption></figcaption></figure></div>

Discover the full range of developer tools available for building on Stacks.&#x20;

This page aggregates official and community-built developer tools for building on Stacks. Tools vary in scope, maturity, and maintenance status. Whether you’re developing smart contracts, integrating wallets, querying blockchain data, or experimenting with new ideas, this page helps you find the resources to accelerate your projects and navigate the Stacks devtooling ecosystem.

{% hint style="info" %}
Official Stacks devtools are built and maintained by either **Stacks Labs** or **Hiro**.
{% endhint %}

### Smart Contract Development

* [**Clarinet**](https://github.com/stx-labs/clarinet) **\[StacksLabs]** – A local Clarity smart contract development environment with testing and deployment tools, designed to help you build, debug, and iterate on Stacks contracts quickly.
* [**Clarity Playground**](https://github.com/stx-labs/clarity-playground) **\[StacksLabs]** - Run Clarity code in the browser with the Clarinet SDK.
* [**Clarity-WASM**](https://github.com/stx-labs/clarity-wasm) **\[StacksLabs]** - `clar2wasm` is a compiler for generating WebAssembly from Clarity.
* [**Clarity-Zed**](https://github.com/stx-labs/clarity-zed) **\[StacksLabs]** - Clarity Language Support for Zed editor.
* [**Stacks Pyth Bridge**](https://github.com/stx-labs/stacks-pyth-bridge) **\[StacksLabs]** - The Pyth protocol integration is available as a beta on both testnet and mainnet networks for Stacks, to help developers test, give feedback, and ensure the reliability and stability of the integration.
* [**Clarity Deployed Contracts**](https://github.com/boomcrypto/clarity-deployed-contracts) - Browse the source code of all deployed Clarity contracts on Stacks' mainnet and testnet.

### SDKs & Libraries

* [**Stacks.js**](https://github.com/stx-labs/stacks.js) **\[StacksLabs]** – A JavaScript/Typescript library that makes it easy to interact with the Stacks blockchain, including authentication, transactions, and smart contract calls from web apps.
* [**Stacks.js Starters**](https://github.com/stx-labs/stacks.js-starters) **\[StacksLabs]** - Quickly bootstrap frontend applications with Stacks.js on top of multiple JavaScript frameworks as the foundation.
* [**Clarity-Go**](https://github.com/stx-labs/clarity-go) **\[StacksLabs]** - A Go library for decoding Clarity values from their binary serialization format used by the Stacks blockchain.
* [**SecondLayer**](https://github.com/ryanwaits/secondlayer) - Generate fully typed contract interfaces, functions, and React hooks for Clarity smart contracts.
* [**Clarity-types**](https://github.com/ryanwaits/clarity-types) - Strict TypeScript types for Clarity ABI properties and values.
* [**Clarigen**](https://github.com/hstove/clarigen) - Clarigen is a developer tool that automatically generates TypeScript-friendly clients that can interact with Clarity smart contracts.
* [**Stacks.rs**](https://github.com/52/stacks.rs) - A Rust toolkit to interact with the Stacks Blockchain.
* [**StacksPy**](https://github.com/rohitverma007/stackspy) - Python Library to interact with the Stacks blockchain.
* [**x402-Stacks**](https://github.com/tony1908/x402Stacks) - A TypeScript library for implementing the x402 payment protocol on Stacks blockchain.&#x20;
* [**AIBTC**](https://github.com/aibtcdev) - AI agent tooling for Stacks.
* [**Bitcoin TX Proof**](https://github.com/kenrogers/bitcoin-tx-proof) - A TypeScript library for generating Bitcoin transaction proofs, including witness data and merkle proofs. This package helps developers verify Bitcoin transactions in Clarity.

### Indexing & Data

* [**Stacks Blockchain APIs**](https://github.com/hirosystems/stacks-blockchain-api) **\[Hiro]** – High-performance APIs to query blockchain data, explore blocks, transactions, smart contracts, and more, without running your own node.
* [**Token Metadata APIs**](https://github.com/hirosystems/token-metadata-api) **\[Hiro] -** Fetch metadata for every token on Stacks and effortlessly put tokens into your app. Verify and display tokens in your app, for everything from DeFi to NFTs.&#x20;
* [**Bitcoin Indexer**](https://github.com/hirosystems/bitcoin-indexer) **\[Hiro] -** Index Bitcoin meta-protocols like Ordinals, BRC-20, and Runes.
* [**Chainhooks**](https://github.com/hirosystems/chainhook) **\[Hiro]** – A notification service for dApps that triggers webhooks on specific blockchain events, helping you respond to transactions, contract calls, and chain reorganizations in real time.
* [**BNS**](https://www.bnsv2.com/docs) - [API](https://github.com/Strata-Labs/bnsv2-api) and [SDK](https://github.com/Strata-Labs/bns-v2-sdk) documentation for BNSv2, covering how to programmatically register, resolve, and manage Bitcoin Name System identities using on-chain contracts and developer libraries.
* [**Signal21**](https://signal21.io/) - Data analytics platform for the Bitcoin Economy: on-chain visibility into Bitcoin L1, L2s, and Dapps.
* [**Velar Devtools**](https://docs.velar.com/velar/developers) - Velar SDK and APIs allowing developers to implement token swaps, manage liquidity, and interact with the Velar DEX/DeFi ecosystem.
* [**Bitflow Devtools**](https://docs.bitflow.finance/bitflow-documentation/developers/overview) - Documentation on Bitflow's SDKs and contracts for interacting with Bitflow's DeFi ecosystem.
* [**Chainhooks-Go-Client**](https://github.com/tony1908/chainhooks-client-go) - A comprehensive Go client library for interacting with the Hiro Chainhooks API.

### Testing & Simulation

* [**Rendezvous**](https://stacks-network.github.io/rendezvous/) - A smart contract fuzzer for Clarity.

### Wallet & Auth

* [**Stacks Connect**](https://github.com/stx-labs/connect) **\[StacksLabs]** – A protocol-agnostic wallet integration library that enables apps to securely connect with multiple Stacks wallets without reinventing the onboarding flow.
* [**Sign-In with Stacks**](https://github.com/pradel/sign-in-with-stacks/) - A library for creating and verifying Sign-In with Stacks messages.
* [**sBTC Pay**](https://github.com/STX-CITY/sbtc-pay) - A complete "Stripe for sBTC" payment gateway that enables businesses to easily accept Bitcoin payments via sBTC on Stacks blockchain.
* [**Bolt Protocol**](https://github.com/ronoel/bolt-protocol) - Bolt Protocol is a next-generation framework designed to enable near-instant transactions on the Bitcoin network and enable users to pay fees directly in sBTC.

### Monitoring & Analytics

* [**Explorer**](https://github.com/stx-labs/explorer) **\[StacksLabs] -** Explore transactions and accounts on the Stacks blockchain. Clone any contract and experiment in your browser with the Explorer sandbox.
* [**Platform**](https://www.hiro.so/platform) **\[Hiro]** – Manage API keys, Chainhooks, and analyze onchain data streams in one command center. Also houses ready-to-use starter templates for different use case applications.
* [**STXER**](https://stxer.xyz/) - Community built explorer, debugger and simulator for Stacks transactions.

### Docs & Education

* [**Hiro Docs**](https://docs.hiro.so/) **\[Hiro]** - Official Hiro developer documentation website.
* [**Stacks Docs**](https://docs.stacks.co/) **\[StacksLabs]** - Official Stacks developer documentation website.
* [**SIPs**](https://github.com/stacksgov/sips) - Community-submitted Stacks Improvement Proposals (SIPs).

### Core

* [**Stacks Core**](https://github.com/stx-labs/stacks-core) **\[StacksLabs]** - Reference implementation of the Stacks blockchain in Rust.
* [**Stacks Blockchain Docker**](https://github.com/stacks-network/stacks-blockchain-docker) - Run your own Stacks Blockchain node with Docker.
* [**Stacks-Monitoring**](https://github.com/alexlmiller/stacks-monitoring) - Observability stack for Stacks blockchain nodes and signers - dashboards, alerts, and log processing.

***

If you’ve built a Stacks devtool you’d like included, reach out to us via GitHub or Discord with a brief description and link, and we’ll review it for addition to this devtools list.

---
title: Stacks Blockchain APIs
description: Interacting with the Stacks 2.0 Blockchain
---

## Introduction

With the launch of Stacks 2.0, a new version of the Blockstack blockchain was released. There are two ways of interacting with the blockchain, either using the Stacks Blockchain API or by making RPC calls to a Stacks Core directly.

## Stacks Core API

The Stacks 2.0 blockchain's Rust implementation exposes RPC endpoints (in JSON format), which can be used to interface with the Stacks blockchain. [You can find the RPC API references here](https://docs.blockstack.org/core/smart/rpc-api.html).

## Stacks Blockchain API

The Stacks Blockchain API was built to maintain pageable materialized views of the Stacks 2.0 Blockchain. It is a server that exposes a RESTful JSON API, hosted by PBC. It introduces aidditonal functionality (e.g. get all transactions), as well as proxies calls directly to Stacks Node. [You can find the OpenAPI specification and documentation here](https://blockstack.github.io/stacks-blockchain-sidecar/).

~> Note: Using this API requires you to trust the server, but provides a faster onboarding experience. It also addresses performance issues for which querying a node itself would be too slow or difficult

-> If you are looking for the Stacks 1.0 RPC endpoint references, please follow [this link](https://core.blockstack.org/).

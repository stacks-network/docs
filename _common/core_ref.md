---
layout: core
title: "Stacks Node API"
description: Interacting with the Blockstack Blockchain
permalink: /:collection/:path.html
---

With the launch of Stacks 2.0, a new version of the Blockstack blockchain was released. There are two ways of interacting with the blockchain, either using a RESTful JSON API or by making JSON RPC calls to the blockchain core node.

## JSON RPC API
The Stacks 2.0 blockchain's Rust implementation exposes JSON RPC endpoints, which can be used to interface with blockchain. [You can find the RPC API references here](https://github.com/blockstack/stacks-blockchain/blob/master/docs/rpc-endpoints.md).

## RESTful JSON API
A RESTful JSON API that is hosted by PBC and has a proxy to the JSON RPC endpoints. [You can find the OpenAPI specification and documentation here](https://blockstack.github.io/stacks-blockchain-sidecar/).

Using this API (sometimes referred to as "sidecar") requires you to trust the server, but provides a faster onboarding experience. It also addresses performance issues for which querying a node itself would be too slow or difficult.

{% include note.html content="If you are looking for the Stacks 1.0 RPC endpoint references, please follow this <a href='https://core.blockstack.org/'>link</a>." %}

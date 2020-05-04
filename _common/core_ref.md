---
layout: core
title: "Stacks Node API"
description: Interacting with the Blockstack Blockchain
permalink: /:collection/:path.html
---

With the launch of Stacks 2.0, a new version of the Blockstack blockchain was released. You currently have two ways of interacting with the blockchain:

- Using a hosted HTTPS REST client that makes RPC calls to the blockchain
- Directly making JSON RPC calls to the blockchain yourself

Using the hosted client requires you to trust the client but provides a faster onboarding.

## Hosted REST Client
This client communicates with the JSON RPC endpoints. The hosted client references and OpenAPI specification can be find [here](https://blockstack.github.io/stacks-blockchain-sidecar/).

## JSON RPC Endpoints
The Stacks 2.0 blockchain's Rust implementation exposes a JSON RPC endpoint, which can be used to interface with blockchain. You can find the references [here](https://github.com/blockstack/stacks-blockchain/blob/master/docs/rpc-endpoints.md).

{% include note.html content="If you are looking for the Stacks 1.0 RPC endpoint references, please follow this <a href='https://core.blockstack.org/'>link</a>." %}
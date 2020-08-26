---
title: Stacks Blockchain API
description: Interacting with the Stacks 2.0 Blockchain via API
---

## Introduction

The Stacks 2.0 Blockchain API was built to maintain pageable materialized views of the Stacks 2.0 Blockchain. It is a server that exposes a RESTful JSON API and WebSockets, hosted by PBC. It introduces aidditonal functionality (e.g. get all transactions), as well as proxies calls directly to Stacks Node. [You can find the OpenAPI specification and documentation here](https://blockstack.github.io/stacks-blockchain-api/).

~> Note: Using this API requires you to trust the server, but provides a faster onboarding experience. It also addresses performance issues for which querying a node itself would be too slow or difficult

## Client library

A generated JS Client is available for consumption of this API. The client library enables typesafe REST and WebSocket communication. [Please review the client documentation for more details](https://blockstack.github.io/stacks-blockchain-api/client/index.html).

@include "different_apis.md"

## Legacy API

-> If you are looking for the Stacks 1.0 RPC endpoint references, please follow [this link](https://core.blockstack.org/).

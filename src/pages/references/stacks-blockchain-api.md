---
title: Stacks Blockchain API
description: Interacting with the Stacks 2.0 Blockchain via API
---

## Introduction

The Stacks 2.0 Blockchain API was built to maintain pageable materialized views of the Stacks 2.0 Blockchain. It is a server that exposes a RESTful JSON API and WebSockets, hosted by PBC. It introduces aidditonal functionality (e.g. get all transactions), as well as proxies calls directly to Stacks Node. [You can find the OpenAPI specification and documentation here](https://blockstack.github.io/stacks-blockchain-api/).

~> Note: Using this API requires you to trust the server, but provides a faster onboarding experience. It also addresses performance issues for which querying a node itself would be too slow or difficult

## Client library

A generated JS Client is available for consumption of this API. The client library enables typesafe REST and WebSocket communication. [Please review the client documentation for more details](https://blockstack.github.io/stacks-blockchain-api/client/index.html).

## Stacks Node RPC API

The Stacks 2.0 Blockchain API is centrally-hosted. However, every running Stacks node exposes an RPC API, which allows you to interact with the underlying blockchain. Instead of using a centrally-hosted API, you can directly access the RPC API of a locally-hosted Node.

-> The Stacks Blockchain API proxies to Node RPC endpoints

While the Node RPC API doesn't give the same functionality as the hosted Stacks 2.0 Blockchain API, you get similar functionality in a way that is scoped to that specific node. The RPC API includes the following endpoints:

- [POST /v2/transactions](https://blockstack.github.io/stacks-blockchain-api/#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://blockstack.github.io/stacks-blockchain-api/#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://blockstack.github.io/stacks-blockchain-api/#operation/get_fee_transfer)
- [GET /v2/info](https://blockstack.github.io/stacks-blockchain-api/#operation/get_core_api_info)

~> Your local node exposes an HTTP server via port `20443`. The info endpoint would be `localhost:20443/v2/info`.

## Legacy API

If you are looking for the Stacks 1.0 RPC endpoint references, please follow [this link](https://core.blockstack.org/).

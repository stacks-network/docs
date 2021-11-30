---
title: Stacks Blockchain API
description: Interacting with the Stacks 2.0 Blockchain via API
images:
  sm: /images/pages/testnet-sm.svg
---

## Introduction

The Stacks 2.0 Blockchain API allows you to query the Stacks 2.0 blockchain and interact with smart contracts. It was built to maintain pageable materialized views of the Stacks 2.0 Blockchain.

~> The RESTful API is developed by Hiro. Hiro also hosts a public API node for easy onboarding. Using it requires you to trust the hosted server, but provides a faster onboarding experience. You can [run your own API server](https://docs.hiro.so/get-started/running-api-node)

The RESTful JSON API can be used without any authorization. The basepath for the API is:

```bash
# for mainnet, replace `testnet` with `mainnet`
https://stacks-node-api.testnet.stacks.co/
```

-> This documentation only covers endpoints that are exposed on a Stacks node, referred to as the RPC API. For full documentation on the RESTful API, check out the [Hiro's API reference](https://docs.hiro.so/api).

### Stacks Node RPC API

The [stacks-node implementation](https://github.com/blockstack/stacks-blockchain/) exposes JSON RPC endpoints.

All `/v2/` routes a proxied to a Hiro-hosted Stacks Node. For a trustless architecture, you should make these requests to a self-hosted node.

## Proxied Stacks Node RPC API endpoints

The Stacks 2.0 Blockchain API is centrally hosted. However, every running Stacks node exposes an RPC API, which allows you to interact with the underlying blockchain. Instead of using a centrally hosted API, you can directly access the RPC API of a locally hosted Node.

-> The Stacks Blockchain API proxies to Node RPC endpoints

While the Node RPC API doesn't give the same functionality as the hosted Stacks 2.0 Blockchain API, you get similar functionality in a way that is scoped to that specific node. The RPC API includes the following endpoints:

- [POST /v2/transactions](https://docs.hiro.so/api#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://docs.hiro.so/api#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://docs.hiro.so/api#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://docs.hiro.so/api#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://docs.hiro.so/api#operation/get_fee_transfer)
- [GET /v2/info](https://docs.hiro.so/api#operation/get_core_api_info)

~> If you run a local node, it exposes an HTTP server on port `20443`. The info endpoint would be `localhost:20443/v2/info`.

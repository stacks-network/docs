---
title: API de la blockchain Stacks
description: Interagir avec la Blockchain Stacks 2.0 via l'API
sidebar_position: 4
---

## Introduction

:::tip API Documentation La documentation officielle de l'API est disponible [ici](https://stacks-network.github.io/stacks-blockchain/). :::


L'API de la Blockchain Stacks 2.0 vous permet de interroger la blockchain Stacks 2.0 et d'interagir avec des contrats intelligents. Il a été construit pour maintenir des vues matérialisées paginables de la blockchain Stacks 2.0.

:::prudence L'API RESTful est développée par Hiro. Hiro héberge également un noeud d'API public pour faciliter l'intégration. L'utiliser nécessite de faire confiance au serveur hébergé, mais offre une expérience d'intégration plus rapide. Vous pouvez [exécuter votre propre serveur API](https://docs.hiro.so/get-started/running-api-node) :::

L'API JSON RESTful peut être utilisée sans aucune autorisation. Le chemin de base de l'API est :

```bash
# pour mainnet, remplacez `testnet` par `mainnet`
https://stacks-node-api.testnet.stacks.co/
```

:::note Cette documentation ne couvre que les points de terminaison qui sont exposés sur un noeud Stacks, appelé l'API RPC. Pour une documentation complète sur l'API RESTful, consultez la [référence de l'API Hiro](https://docs.hiro.so/api). :::

### API RPC d'un noeud Stacks

L' [implémentation de stacks-node](https://github.com/stacks-network/stacks-blockchain/) expose les points d'entrée JSON RPC.

Tous les accès `/v2/` passent par un proxy Stacks hébergé par Hiro. Pour une architecture sans confiance, vous devriez faire ces requêtes à un noeud auto-hébergé.

## Proxied Stacks Node RPC API endpoints

The Stacks 2.0 Blockchain API is centrally hosted. However, every running Stacks node exposes an RPC API, which allows you to interact with the underlying blockchain. Instead of using a centrally hosted API, you can directly access the RPC API of a locally hosted Node.

:::tip
The Stacks Blockchain API proxies to Node RPC endpoints
:::

While the Node RPC API doesn't give the same functionality as the hosted Stacks 2.0 Blockchain API, you get similar functionality in a way that is scoped to that specific node. The RPC API includes the following endpoints:

- [POST /v2/transactions](https://docs.hiro.so/api#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://docs.hiro.so/api#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://docs.hiro.so/api#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://docs.hiro.so/api#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://docs.hiro.so/api#operation/get_fee_transfer)
- [GET /v2/info](https://docs.hiro.so/api#operation/get_core_api_info)

:::caution If you run a local node, it exposes an HTTP server on port `20443`. The info endpoint would be `localhost:20443/v2/info`. :::

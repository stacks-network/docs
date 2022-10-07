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

## Points d'entrée du proxy Hiro pour de l'API RPC Stacks

L'API Stacks 2.0 Blockchain est hébergée de façon centralisée. Cependant, chaque nœud Stacks en cours d’exécution expose une API RPC, qui vous permet d’interagir avec la blockchain. Au lieu d'utiliser une API hébergée de manière centralisée, vous pouvez directement accéder à l'API RPC d'un noeud hébergé localement.

:::tip
Les proxy API de la Blockchain Stacks vers les points RPC de Node
:::

Bien que le noeud API RPC ne donne pas les mêmes fonctionnalités que ceux de la Blockchain Stacks API 2.0 , vous obtenez des fonctionnalités similaires d'une manière qui est étendue à ce noeud spécifique. L'API RPC inclut les points d'entrée suivants :

- [POST /v2/transactions](https://docs.hiro.so/api#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://docs.hiro.so/api#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://docs.hiro.so/api#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://docs.hiro.so/api#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://docs.hiro.so/api#operation/get_fee_transfer)
- [GET /v2/info](https://docs.hiro.so/api#operation/get_core_api_info)

:::caution Si vous exécutez un noeud local, il expose un serveur HTTP sur le port `20443`. Le point d'accès info serait `localhost:20443/v2/info`. :::

---
title: API Blockchain Stacks
description: Berinteraksi dengan Blockchain Stacks 2.0 melalui API
sidebar_position: 4
---

## Pengantar

:::tip API Documentation Official API Documentation is available [here](https://stacks-network.github.io/stacks-blockchain/). :::


API Blockchain Stacks 2.0 memungkinkan Anda untuk melakukan query blockchain Stacks 2.0 dan berinteraksi dengan kontrak pintar. Dibangun untuk menjaga tampilan halaman dari Stacks 2.0 Blockchain.

:::caution The RESTful API is developed by Hiro. Hiro juga melakukan hosting noda API publik untuk kemudahan onboarding. Dalam menggunakannya, Anda harus mempercayai server yang dihosting, memberikan pengalaman onboarding yang lebih cepat. You can [run your own API server](https://docs.hiro.so/get-started/running-api-node) :::

API JSON RESTful dapat digunakan tanpa otorisasi apa pun. Jalur dasar untuk API adalah:

```bash
# for mainnet, replace `testnet` with `mainnet`
https://stacks-node-api.testnet.stacks.co/
```

:::note This documentation only covers endpoints that are exposed on a Stacks node, referred to as the RPC API. Untuk dokumentasi lengkap tentang API RESTful, lihat [referensi API Hiro](https://docs.hiro.so/api). :::

### API RPC Noda Stacks

[Implementasi noda-stacks](https://github.com/stacks-network/stacks-blockchain/) mengekspos endpoint RPC JSON.

Semua `/v2/` merutekan proxy ke Noda Stacks yang dihosting oleh Hiro. Untuk arsitektur tanpa kepercayaan, Anda harus membuat permintaan ini ke noda yang dihosting sendiri.

## Endpoint API RPC Noda Stacks yang diproxy

API Blockchain Stacks 2.0 dihosting secara terpusat. Namun, setiap noda Stacks yang berjalan memperlihatkan API RPC, yang memungkinkan Anda berinteraksi dengan blockchain yang mendasarinya. Alih-alih menggunakan API yang dihosting secara terpusat, Anda dapat langsung mengakses API RPC dari noda yang dihosting secara lokal.

:::tip
The Stacks Blockchain API proxies to Node RPC endpoints
:::

Meskipun Noda RPC API tidak memberikan fungsionalitas yang sama seperti API Blockchain Stacks 2.0 yang dihosting, Anda mendapatkan fungsionalitas serupa dengan cara yang dicakupkan ke noda tertentu. API RPC mencakup endpoint berikut:

- [POST /v2/transactions](https://docs.hiro.so/api#operation/post_core_node_transactions)
- [GET /v2/contracts/interface/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_interface)
- [POST /v2/map_entry/{contract_address}/{contract_name}/{map_name}](https://docs.hiro.so/api#operation/get_contract_data_map_entry)
- [GET /v2/contracts/source/{contract_address}/{contract_name}](https://docs.hiro.so/api#operation/get_contract_source)
- [GET /v2/accounts/{principal}](https://docs.hiro.so/api#operation/get_account_info)
- [POST /v2/contracts/call-read/{contract_address}/{contract_name}/{function_name}](https://docs.hiro.so/api#operation/call_read_only_function)
- [GET /v2/fees/transfer](https://docs.hiro.so/api#operation/get_fee_transfer)
- [GET /v2/info](https://docs.hiro.so/api#operation/get_core_api_info)

:::caution If you run a local node, it exposes an HTTP server on port `20443`. Endpoint info adalah `localhost:20443/v2/info`. :::

---
title: Jaringan
description: Panduan jaringan Stacks 2.0
sidebar_position: 7
---

## Token

Token Stacks (STX) merupakan token native di jaringan blokchain Stacks 2.0. Bagian terkecilnya adalah satu mikro-STX. 1.000.000 mikro-STX sama dengan satu Stacks (STX).

Jumlah STX harus disimpan sebagai bilangan bulat (panjang 8 bytes), dan mewakili jumlah mikro-STX. Sebagai gambaran, mikro-STX dibagi dengan 1.000.000 (6 digit desimal).

## Biaya

Biaya digunakan untuk memberi insentif kepada penambang untuk mengkonfirmasi transaksi di jaringan blockhchain Stacks 2.0. Biaya tersebut dihitung berdasarkan perkiraan tarif biaya dan ukuran transaksi dalam byte. Tingkat biaya adalah variabel yang ditentukan oleh pasar. For the [testnet](testnet), it is set to 1 micro-STX.

Perkiraan biaya dapat diperoleh melalui endpoint [`GET /v2/fees/transfer`](https://docs.hiro.so/api#operation/get_fee_transfer):

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/fees/transfer'
```

API akan merespons dengan tarif biaya (sebagai bilangan bulat):

```json
1
```

[Pustaka Transaksi Stacks JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) mendukung estimasi biaya untuk:

- transfer token (`estimateTransfer`)
- penyebaran kontrak (`estimateContractDeploy`)
- panggilan kontrak non read-only (`estimateContractFunctionCall`)

:::tip For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/hirosystems/stacks.js/blob/master/packages/transactions/src/builders.ts#L97). :::

## Nonce

Setiap akun membawa [properti nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) yang menunjukkan jumlah transaksi yang diproses untuk akun yang diberikan. Nonce adalah kode satu kali, dimulai dari `0` untuk akun baru, dan bertambah 1 pada setiap transaksi.

Nonce ditambahkan ke semua transaksi dan membantu mengidentifikasinya untuk memastikan transaksi diproses secara berurutan untuk menghindari pemrosesan ganda.

:::tip
The consensus mechanism also ensures that transactions aren't "replayed" in two ways. Pertama, noda mengqueri output transaksi yang tidak terpakai (UTXOs) untuk memenuhi kondisi pengeluaran mereka dalam transaksi baru. Kedua, pesan yang dikirim antar noda meninjau nomor urut.
:::

Ketika transaksi transfer token baru dibuat, nonce akun terbaru perlu diambil dan diatur.

:::tip The API provides an endpoint to [simplify nonce handling](https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling). :::

## Konfirmasi

Jaringan Stacks 2.0 ditautkan ke jaringan bitcoin. Ini memungkinkan transaksi di Stacks untuk mendapat finalitas dan keamanan yang sama dari jaringan blockchain Bitcoin.

Waktu untuk menambang satu blok, untuk mengkonfirmasi transaksi, pada akhirnya akan sesuai dengan "waktu blok" yang diharapkan dari jaringan bitcoin: 10 menit.

:::tip Transactions can also be mined in [microblocks](microblocks), reducing the latency significantly. :::

The block time is hardcoded and will change throughout the implementation phases of the [testnet](testnet). Waktu blok terkini dapat diperoleh melalui endpoint [`GET /extended/v1/info/network_block_times`](https://docs.hiro.so/api#operation/get_network_block_times):

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/extended/v1/info/network_block_times'
```

API akan merespons dengan waktu blok (dalam detik):

```js
{
    "testnet": {
        "target_block_time": 120
    },
    "mainnet": {
        "target_block_time": 600
    }
}
```

## Panggilan fungsi read-only

Kontrak pintar dapat memperlihatkan panggilan fungsi publik. Untuk fungsi yang membuat modifikasi status pada blockchain, transaksi perlu dibuat dan disebarkan.

Namun, untuk panggilan fungsi read-only, transaksi **tidak** diperlukan. Sebagai gantinya, panggilan ini dapat dilakukan menggunakan [Stacks Blockchain API](https://docs.hiro.so/get-started/stacks-blockchain-api).

:::tip
Read-only function calls do not require transaction fees
:::

Panggilan kontrak read-only dapat dilakukan menggunakan endpoint [`POST /v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>`](https://docs.hiro.so/api#operation/call_read_only_function):

```bash
# for mainnet, replace `testnet` with `mainnet`
curl --location --request POST 'https://stacks-node-api.testnet.stacks.co/v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sender": "<stx_address>.<contract_name>",
  "arguments": [<clarity_value>, ...]
}'
```

Contoh respons untuk panggilan yang berhasil:

```js
{
  "okay": true,
  "result": "<clarity_value>"
}
```

:::tip To set the function call arguments and read the result, [Clarity values](../write-smart-contracts/values) need to be serialized into a hexadecimal string. The [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) library supports these operations :::

## Melakukan query

Detail jaringan Stacks 2.0 dapat di-query menggunakan [API Blockchain Stacks](https://docs.hiro.so/get-started/stacks-blockchain-api).

### Cek kesehatan

[Pemeriksa status](https://stacks-status.com/) adalah layanan yang menyediakan antarmuka pengguna untuk meninjau kesehatan blockchain Stacks 2.0 dengan cepat.

### Informasi jaringan

Informasi jaringan dapat diperoleh menggunakan endpoint [`GET /v2/info`](https://docs.hiro.so/api#operation/get_core_api_info):

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://stacks-node-api.testnet.stacks.co/v2/info'
```

Contoh respon:

```js
{
    "peer_version": 385875968,
    "burn_consensus": "826401d65cf3671210a3fb135d827d549c0b4d37",
    "burn_block_height": 1972,
    "stable_burn_consensus": "e27ea23f199076bc41a729d76a813e125b725f64",
    "stable_burn_block_height": 1971,
    "server_version": "blockstack-core 0.0.1 => 23.0.0.0 (master:bdd042242+, release build, linux [x86_64]",
    "network_id": 2147483648,
    "parent_network_id": 3669344250,
    "stacks_tip_height": 933,
    "stacks_tip": "1f601823fbcc5b6b2215b2ff59d2818fba61ee4a3cea426d8bc3dbb268005d8f",
    "stacks_tip_burn_block": "54c56a9685545c45accf42b5dcb2787c97eda8185a1c794daf9b5a59d4807abc",
    "unanchored_tip": "71948ee211dac3b241eb65d881637f649d0d49ac08ee4a41c29217d3026d7aae",
    "exit_at_block_height": 28160
}
```

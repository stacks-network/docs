---
title: Menjalankan noda testnet
description: Menyiapkan dan menjalankan noda testnet dengan Docker
tags:
  - tutorial
---

## Pengantar

Prosedur ini menunjukkan cara menjalankan noda testnet lokal menggunakan gambar Docker.

:::warning
This procedure focuses on Unix-like operating systems (Linux and MacOS). Prosedur ini belum diuji pada Windows.
:::

## Prasyarat

Menjalankan noda tidak memiliki persyaratan perangkat keras khusus. Pengguna telah berhasil menjalankan noda pada papan Raspberry Pi dan arsitektur system-on-chip lainnya. Untuk menyelesaikan prosedur ini, Anda harus menginstal perangkat lunak berikut di mesin host noda:

- [Docker](https://docs.docker.com/get-docker/)
- [curl](https://curl.se/download.html)
- [jq](https://stedolan.github.io/jq/download/)

### Konfigurasi firewall

Agar layanan noda API berfungsi dengan benar, Anda harus mengkonfigurasi aturan firewall jaringan apa pun untuk mengizinkan lalu lintas pada port yang dibahas di bagian ini. Detail konfigurasi jaringan dan firewall sangat spesifik untuk mesin dan jaringan Anda, jadi contoh detail tidak diberikan.

Port berikut harus terbuka di mesin host:

Jalan masuk:

- stacks-blockchain (open to `0.0.0.0/0`):
  - `20443 TCP`
  - `20444 TCP`

Jalan keluar:

- `18332`
- `18333`
- `20443-20444`

Port keluar ini untuk menyinkronkan [`stacks-blockchain`][] dan header Bitcoin. Jika tidak terbuka, sinkronisasi akan gagal.

## Langkah 1: pengaturan awal

Untuk menjalankan noda testnet, Anda harus mengunduh gambar Docker dan membuat struktur direktori untuk menyimpan data persisten dari layanan. Unduh dan konfigurasikan gambar Docker dengan perintah berikut:

```sh
docker pull blockstack/stacks-blockchain
```

Buat struktur direktori untuk data layanan dengan perintah berikut:

```sh
mkdir -p ./stacks-node/persistent-data/stacks-blockchain/testnet && cd stacks-node
```

## Langkah 2: menjalankan blockchain Stacks

Mulai kontainer [`stacks-blockchain`][] dengan perintah berikut:

```sh
docker run -d --rm \
  --name stacks-blockchain \
  -v $(pwd)/persistent-data/stacks-blockchain/testnet:/root/stacks-node/data \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain \
/bin/stacks-node testnet
```

Anda dapat memverifikasi kontainer [`stacks-blockchain`][] yang sedang berjalan dengan perintah:

```sh
docker ps --filter name=stacks-blockchain
```

## Langkah 3: memverifikasi layanan

:::info
The initial burnchain header sync can take several minutes, until this is done the following commands will not work
:::

Untuk memverifikasi kemajuan sinkronisasi header [`stacks-blockchain`][] burnchain:

```sh
docker logs stacks-blockchain
```

Keluarannya harus mirip dengan berikut ini:

```
INFO [1626290705.886954] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.2% (8000 out of 2034380)
INFO [1626290748.103291] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.4% (10000 out of 2034380)
INFO [1626290776.956535] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.7% (12000 out of 2034380)
```

Untuk memverifikasi tinggi [`stacks-blockchain`][] yang sedang berlangsung, gunakan perintah berikut:

```sh
curl -sL localhost:20443/v2/info | jq
```

Jika kejadian sedang berjalan, Anda akan menerima keluaran terminal yang mirip dengan berikut ini:

```json
{
  "peer_version": 4207599105,
  "pox_consensus": "12f7fa85e5099755a00b7eaecded1aa27af61748",
  "burn_block_height": 2034380,
  "stable_pox_consensus": "5cc4e0403ff6a1a4bd17dae9600c7c13d0b10bdf",
  "stable_burn_block_height": 2034373,
  "server_version": "stacks-node 2.0.11.2.0-rc1 (develop:7b6d3ee+, release build, linux [x86_64])",
  "network_id": 2147483648,
  "parent_network_id": 118034699,
  "stacks_tip_height": 509,
  "stacks_tip": "e0ee952e9891709d196080ca638ad07e6146d4c362e6afe4bb46f42d5fe584e8",
  "stacks_tip_consensus_hash": "12f7fa85e5099755a00b7eaecded1aa27af61748",
  "genesis_chainstate_hash": "74237aa39aa50a83de11a4f53e9d3bb7d43461d1de9873f402e5453ae60bc59b",
  "unanchored_tip": "32bc86590f11504f17904ee7f5cb05bcf71a68a35f0bb3bc2d31aca726090842",
  "unanchored_seq": 0,
  "exit_at_block_height": null
}
```

## Menghentikan noda testnet

Gunakan perintah berikut untuk menghentikan noda testnet lokal:

```sh
docker stop stacks-blockchain
```

## Bacaan tambahan

<!-- markdown-link-check-disable -->

- [Menjalankan noda API Stacks](https://docs.hiro.so/get-started/running-api-node)
- [Menjalankan node mainnet Stacks](running-mainnet-node)
<!-- markdown-link-check-enable-->

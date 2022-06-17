---
title: Menjalankan noda mainnet
description: Menyiapkan dan menjalankan node mainnet dengan Docker
tags:
  - tutorial
---

## Pengantar

Prosedur ini menunjukkan cara menjalankan noda mainnet lokal menggunakan gambar Docker.

:::caution
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

- `8332`
- `8333`
- `20443-20444`

These egress ports are for syncing stacks-blockchain and Bitcoin headers. Jika tidak terbuka, sinkronisasi akan gagal.

## Langkah 1: pengaturan awal

Untuk menjalankan noda mainnet, Anda harus mengunduh gambar Docker dan membuat struktur direktori untuk menyimpan data persisten dari layanan. Unduh dan konfigurasikan gambar Docker dengan perintah berikut:

```sh
docker pull blockstack/stacks-blockchain
```

Buat struktur direktori untuk data layanan dengan perintah berikut:

```sh
mkdir -p ./stacks-node/{persistent-data/stacks-blockchain/mainnet,config/mainnet} && cd stacks-node
```

## Langkah 2: menjalankan blockchain Stacks

Pertama, buat file `./config/mainnet/Config.toml` dan tambahkan konten berikut ke file menggunakan editor teks:

```toml
[node]
working_dir = "/root/stacks-node/data"
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
bootstrap_node = "02da7a464ac770ae8337a343670778b93410f2f3fef6bea98dd1c3e9224459d36b@seed-0.mainnet.stacks.co:20444,02afeae522aab5f8c99a00ddf75fbcb4a641e052dd48836408d9cf437344b63516@seed-1.mainnet.stacks.co:20444,03652212ea76be0ed4cd83a25c06e57819993029a7b9999f7d63c36340b34a4e62@seed-2.mainnet.stacks.co:20444"
wait_time_for_microblocks = 10000

[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "bitcoin.blockstack.com"
username = "blockstack"
password = "blockstacksystem"
rpc_port = 8332
peer_port = 8333

[connection_options]
read_only_call_limit_write_length = 0
read_only_call_limit_read_length = 100000
read_only_call_limit_write_count = 0
read_only_call_limit_read_count = 30
read_only_call_limit_runtime = 1000000000
```

Start the `stacks-blockchain` container with the following command:

```sh
docker run -d --rm \
  --name stacks-blockchain \
  -v $(pwd)/persistent-data/stacks-blockchain/mainnet:/root/stacks-node/data \
  -v $(pwd)/config/mainnet:/src/stacks-node \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain \
/bin/stacks-node start --config /src/stacks-node/Config.toml
```

You can verify the running `stacks-blockchain` container with the command:

```sh
docker ps --filter name=stacks-blockchain
```

## Langkah 3: memverifikasi layanan

:::note
The initial burnchain header sync can take several minutes, until this is done the following commands will not work
:::

To verify the `stacks-blockchain` burnchain header sync progress:

```sh
docker logs stacks-blockchain
```

Keluarannya harus mirip dengan berikut ini:

```
INFO [1626290705.886954] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.2% (8000 out of 691034)
INFO [1626290748.103291] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.4% (10000 out of 691034)
INFO [1626290776.956535] [src/burnchains/bitcoin/spv.rs:926] [main] Syncing Bitcoin headers: 1.7% (12000 out of 691034)
```

To verify the `stacks-blockchain` tip height is progressing use the following command:

```sh
curl -sL localhost:20443/v2/info | jq
```

Jika kejadian sedang berjalan, Anda akan menerima keluaran terminal yang mirip dengan berikut ini:

```json
{
  "peer_version": 402653184,
  "pox_consensus": "89d752034e73ed10d3b97e6bcf3cff53367b4166",
  "burn_block_height": 666143,
  "stable_pox_consensus": "707f26d9d0d1b4c62881a093c99f9232bc74e744",
  "stable_burn_block_height": 666136,
  "server_version": "stacks-node 2.0.11.1.0-rc1 (master:67dccdf, release build, linux [x86_64])",
  "network_id": 1,
  "parent_network_id": 3652501241,
  "stacks_tip_height": 61,
  "stacks_tip": "e08b2fe3dce36fd6d015c2a839c8eb0885cbe29119c1e2a581f75bc5814bce6f",
  "stacks_tip_consensus_hash": "ad9f4cb6155a5b4f5dcb719d0f6bee043038bc63",
  "genesis_chainstate_hash": "74237aa39aa50a83de11a4f53e9d3bb7d43461d1de9873f402e5453ae60bc59b",
  "unanchored_tip": "74d172df8f8934b468c5b0af2efdefe938e9848772d69bcaeffcfe1d6c6ef041",
  "unanchored_seq": 0,
  "exit_at_block_height": null
}
```

## Menghentikan noda mainnet

Gunakan perintah berikut untuk menghentikan noda mainnet lokal:

```sh
docker stop stacks-blockchain
```

## Opsional. Menjalankan noda Stacks dengan noda bitcoin sendiri

Disarankan untuk menggunakan noda bitcoin Anda sendiri jika memungkinkan.

Untuk melakukannya cukup perbarui file `stacks-node/config/mainnet/Config.toml` dengan detail noda bitcoin Anda. Misalnya:

```
[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "localhost"
username = "rpc username"
password = "rpc password"
rpc_port = 8332
peer_port = 8333
```

Konfigurasi rpc noda bitcoin Anda berada di luar cakupan dokumen ini, namun Anda dapat menemukan informasi lebih lanjut tentang cara menyiapkannya [ di sini](https://developer.bitcoin.org/examples/intro.html).

## Bacaan tambahan

<!-- markdown-link-check-disable -->

- [Menjalankan noda API Stacks](https://docs.hiro.so/get-started/running-api-node)
- [Menjalankan noda testnet Stacks](running-testnet-node)
<!-- markdown-link-check-enable-->

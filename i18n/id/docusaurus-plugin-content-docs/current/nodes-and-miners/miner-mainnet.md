---
title: Menambang token Stacks mainnet
description: Menyiapkan dan menjalankan penambang di mainnet Stacks 2.0
sidebar_position: 5
tags:
  - tutorial
---

## Pengantar

Make sure you've followed the [Running mainnet node](running-mainnet-node) procedure. Setelah selesai, tinggal beberapa langkah lagi untuk menjalankan penambang proof-of-burn di mainnet.

If you're interested in mining on the testnet, you can find instructions on how to do that [here](miner-testnet):

If you want to learn more about the technical details of mining, please review the [mining guide](../understand-stacks/mining):

## Menjalankan bitcoind secara lokal

Untuk berpartisipasi sebagai penambang di mainnet, Anda harus memiliki akses ke noda bitcoin mainnet. Salah satu cara untuk mencapai ini adalah dengan menjalankan bitcoind secara lokal. [Pastikan komputer Anda memenuhi persyaratan perangkat keras minimum sebelum melanjutkan.](https://bitcoin.org/en/bitcoin-core/features/requirements)

Pertama, unduh perangkat lunak bitcoind untuk platform Anda dari https://bitcoin.org/en/download.

Selanjutnya, mulai bitcoind dengan konfigurasi berikut:

```toml
server=1
rpcuser=your-bitcoind-username
rpcpassword=your-bitcoind-password
txindex=0
listen=1
rpcserialversion=0
maxorphantx=1
banscore=1
bind=0.0.0.0:8333
rpcbind=0.0.0.0:8332
rpcport=8332
```

Terakhir, mulai bitcoind sebagai berikut:

```bash
bitcoind -conf=path/to/bitcoin.conf
```

Mungkin perlu waktu beberapa hari hingga noda tersebut disinkronkan dengan mainnet Bitcoin.

## Menjalankan penambang

Pertama, sebuah keychain perlu dibuat. Dengan keychain ini, kita akan membeli beberapa BTC dari pertukaran mata uang kripto, dan kemudian menggunakan BTC tersebut untuk mulai menambang.

Untuk mendapatkan keychain, cara paling sederhana adalah dengan menggunakan `stacks-cli`. Kita akan menggunakan perintah `make_keychain`.

```bash
npx @stacks/cli make_keychain 2>/dev/null | json_pp > keychain.txt
```

Setelah ini berjalan, Anda akan melihat beberapa JSON di file `keychain.txt` baru yang terlihat seperti ini:

```json
{
  "mnemonic": "exhaust spin topic distance hole december impulse gate century absent breeze ostrich armed clerk oak peace want scrap auction sniff cradle siren blur blur",
  "keyInfo": {
    "privateKey": "2033269b55026ff2eddaf06d2e56938f7fd8e9d697af8fe0f857bb5962894d5801",
    "address": "STTX57EGWW058FZ6WG3WS2YRBQ8HDFGBKEFBNXTF",
    "btcAddress": "mkRYR7KkPB1wjxNjVz3HByqAvVz8c4B6ND",
    "index": 0
  }
}
```

**Jangan sampai kehilangan informasi ini** - kita harus menggunakan bidang `privateKey`.

Alamat BTC di atas kemudian perlu diimpor ke jaringan BTC.

```bash
bitcoin-cli -rpcport=8332 -rpcuser=your-user -rpcpassword=your-password importaddress <btcAddress from JSON above>
```

<!-- markdown-link-check-disable -->

Setelah diimpor, kita perlu mendapatkan beberapa BTC ke alamat tersebut. Anda seharusnya dapat mentransfer BTC ke alamat ini menggunakan pertukaran mata uang kripto seperti [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), atau [Kraken](https://www.kraken.com).

<!-- markdown-link-check-enable-->

Sekarang, kita perlu mengkonfigurasi noda kita untuk menggunakan keychain Bitcoin ini. Kloning [repositori blockchain-stacks](https://github.com/stacks-network/stacks-blockchain) ke mesin lokal Anda jika Anda belum melakukannya. Di folder `blockchain-stacks`, ubah file di [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/stacks-network/stacks-blockchain/blob/master/testnet/stacks-node/conf /mainnet-miner-conf.toml).

Perbarui properti berikut:

```toml
[node]
...
# Masukkan kunci privat Anda di sini
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Sekarang, ambil `privateKey` Anda dari sebelumnya, ketika Anda menjalankan perintah `make_keychain`. Ganti bidang `seed` dengan kunci privat Anda. Simpan dan tutup file konfigurasi ini.

Untuk menjalankan penambang Anda, jalankan ini di baris perintah:

```bash
stacks-node start --config=./testnet/stacks-node/conf/mainnet-miner-conf.toml
```

Noda Anda akan dimulai. Ini akan memakan waktu untuk menyinkronkan, dan kemudian penambang Anda akan berjalan.

### Membuat biner yang dioptimalkan

Langkah-langkah di atas sangat bagus untuk mencoba menjalankan noda sementara. Jika Anda ingin menghost noda di server di suatu tempat, Anda mungkin ingin menghasilkan biner yang dioptimalkan. Untuk melakukannya, gunakan konfigurasi yang sama seperti di atas, jalankan:

```bash
cd testnet/stacks-node
cargo build --release --bin stacks-node
```

Kode di atas akan mengkompilasi biner yang dioptimalkan. Untuk menggunakannya, jalankan:

```bash
cd ../..
./target/release/stacks-node start --config=./mainnet-miner-conf.toml
```

To read more about the technical details of mining on the Stacks 2.0 network, have a look at [the mining guide](../understand-stacks/mining).

### Aktifkan pencatatan debug

Jika Anda mengalami masalah atau ingin melihat pencatatan verbose, Anda dapat menjalankan noda dengan pencatatan debug yang diaktifkan. Di baris perintah, jalankan:

```bash
STACKS_LOG_DEBUG=1 stacks-node mainnet
```

## Menjalankan penambang di Windows

### Prasyarat

Make sure are [running a node](running-mainnet-node) and [running bitcoind locally](#running-bitcoind-locally) before starting this tutorial.

### Membuat keychain dan mendapatkan token mainnet di Windows

Untuk mengatur penambang, pertama-tama kita perlu membuat keychain. Dengan keychain ini, kita akan membeli beberapa BTC dari pertukaran mata uang kripto, dan kemudian menggunakan BTC tersebut untuk mulai menambang.

Untuk mendapatkan keychain, cara paling sederhana adalah dengan menggunakan `stacks-cli`. Kita akan menggunakan perintah `stx make-keychain`.

Membuat keychain:

```bash
npm install --global @stacks/cli
stx make_keychain > cli_keychain.json
type cli_keychain.json
```

Setelah ini berjalan, Anda mungkin akan melihat beberapa log instalasi, dan pada akhirnya Anda akan melihat beberapa JSON yang terlihat seperti ini:

```json
{
  "mnemonic": "exhaust spin topic distance hole december impulse gate century absent breeze ostrich armed clerk oak peace want scrap auction sniff cradle siren blur blur",
  "keyInfo": {
    "privateKey": "2033269b55026ff2eddaf06d2e56938f7fd8e9d697af8fe0f857bb5962894d5801",
    "address": "STTX57EGWW058FZ6WG3WS2YRBQ8HDFGBKEFBNXTF",
    "btcAddress": "mkRYR7KkPB1wjxNjVz3HByqAvVz8c4B6ND",
    "index": 0
  }
}
```

:::tip Check out the [Stacks CLI reference](https://docs.hiro.so/references/stacks-cli) for more details :::

Alamat BTC di atas kemudian perlu diimpor ke jaringan BTC.

```bash
bitcoin-cli -rpcport=8332 -rpcuser=your-user -rpcpassword=your-password importaddress <btcAddress from JSON above>
```

Setelah diimpor, kita perlu mendapatkan beberapa BTC ke alamat tersebut. Anda seharusnya dapat mentransfer BTC ke alamat ini menggunakan pertukaran mata uang kripto seperti [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), atau [Kraken](https://www.kraken.com).

### Perbarui file konfigurasi

Sekarang, kita perlu mengkonfigurasi noda kita untuk menggunakan keychain Bitcoin ini. Kloning [repositori blockchain-stacks](https://github.com/stacks-network/stacks-blockchain) ke mesin lokal Anda jika Anda belum melakukannya. Di folder `blockchain-stacks`, ubah file di [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/stacks-network/stacks-blockchain/blob/master/testnet/stacks-node/conf /mainnet-miner-conf.toml).

Perbarui properti berikut:

```toml
[node]
...
# Masukkan kunci privat Anda di sini
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Sekarang, ambil `privateKey` Anda dari sebelumnya, ketika Anda menjalankan perintah `stx make_keychain`. Ganti bidang seed dengan kunci privat Anda. Simpan dan tutup file konfigurasi ini.

### Jalankan penambang

Untuk memulai penambang Anda, jalankan ini di baris perintah:

```bash
stacks-node start --config=testnet/stacks-node/conf/mainnet-miner-conf.toml
```

:::note
While starting the node for the first time, windows defender might pop up with a message to allow access. Jika demikian, izinkan akses untuk menjalankan noda.
::: ![Windows Defender](/img/windows-defender.png)

Noda Anda akan dimulai. Ini akan memakan waktu untuk menyinkronkan, dan kemudian penambang Anda akan berjalan.

### Aktifkan pencatatan debug pada Windows

Jika Anda mengalami masalah atau ingin melihat pencatatan verbose, Anda dapat menjalankan noda dengan pencatatan debug yang diaktifkan. Di baris perintah, jalankan:

```bash
set RUST_BACKTRACE=full;
set STACKS_LOG_DEBUG=1;
stacks-node start --config=mainnet-miner-conf.toml
```

## Opsional: Berjalan dengan Docker

Atau, Anda dapat menjalankan noda mainnet dengan Docker.

:::caution Ensure you have [Docker](https://docs.docker.com/get-docker/) installed on your machine. :::

### Membuat keychain dan mendapatkan token

Membuat keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain 2>/dev/null
```

Kita perlu mendapatkan beberapa BTC ke alamat tersebut. Anda seharusnya dapat mentransfer BTC ke alamat ini menggunakan pertukaran mata uang kripto seperti [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), atau [Kraken](https://www.kraken.com).

### Perbarui file konfigurasi

Sekarang, kita perlu mengkonfigurasi noda kita untuk menggunakan keychain Bitcoin ini. Kloning [repositori blockchain-stacks](https://github.com/stacks-network/stacks-blockchain) ke mesin lokal Anda jika Anda belum melakukannya. Di folder `blockchain-stacks`, ubah file di [`testnet/stacks-node/conf/mainnet-miner-conf.toml`](https://github.com/stacks-network/stacks-blockchain/blob/master/testnet/stacks-node/conf /mainnet-miner-conf.toml).

Perbarui properti berikut:

```toml
[node]
...
# Masukkan kunci privat Anda di sini
seed = "replace-with-your-private-key"
local_peer_seed = "replace-with-your-private-key"
...

[burnchain]
...
# To mine on mainnet, you need to run bitcoind locally
# Details can be found in above section, 'Running bitcoind locally'
peer_host = "127.0.0.1"
username = "<USERNAME>"
password = "<PASSWORD>"
...
```

Sekarang, ambil `privateKey` Anda dari sebelumnya, ketika Anda menjalankan perintah `stx make_keychain`. Ganti bidang seed dengan kunci privat Anda. Simpan dan tutup file konfigurasi ini.

### Memulai penambang

:::info The ENV VARS `RUST_BACKTRACE` and `STACKS_LOG_DEBUG` are optional. If removed, debug logs will be disabled :::

```bash
docker run -d \
  --name stacks_miner \
  --rm \
  --network host \
  -e RUST_BACKTRACE="full" \
  -e STACKS_LOG_DEBUG="1" \
  -v "$(pwd)/testnet/stacks-node/conf/mainnet-miner-conf.toml:/src/stacks-node/mainnet-miner-conf.toml" \
  -p 20443:20443 \
  -p 20444:20444 \
  blockstack/stacks-blockchain:latest \
/bin/stacks-node start --config /src/stacks-node/mainnet-miner-conf.toml
```

Anda dapat meninjau log noda dengan perintah ini:

```bash
docker logs -f stacks_miner
```

## Opsional: Berjalan di Kubernetes dengan Helm

Selain itu, Anda juga dapat menjalankan noda mainnet di klaster Kubernetes menggunakan [bagan Helm blockchain-stacks](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

Pastikan Anda telah menginstal prasyarat berikut di mesin Anda:

- [Docker](https://docs.docker.com/get-docker/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/) (Hanya diperlukan jika membuat klaster Kubernetes lokal)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [helm](https://helm.sh/docs/intro/install/)

### Membuat keychain dan mendapatkan beberapa token

Membuat keychain:

```bash
docker run -i node:14-alpine npx @stacks/cli make_keychain 2>/dev/null
```

Kita perlu mendapatkan beberapa BTC ke alamat tersebut. Anda seharusnya dapat mentransfer BTC ke alamat ini menggunakan pertukaran mata uang kripto seperti [Coinbase](https://www.coinbase.com), [Binance](https://www.binance.com), atau [Kraken](https://www.kraken.com).

### Instal grafik dan jalankan penambang

Untuk menginstal grafik dengan nama rilis `my-release` dan menjalankan noda sebagai penambang:

```bash
minikube start # Jalankan ini hanya jika berdiri di cluster Kubernetes lokal
helm repo add blockstack https://charts.blockstack.xyz
helm install my-release blockstack/stacks-blockchain \
  --set config.node.miner=true \
  --set config.node.seed="replace-with-your-privateKey-from-generate-keychain-step" \
  --set config.burnchain.mode="mainnet"
```

Anda dapat meninjau log noda dengan perintah ini:

```bash
kubectl logs -l app.kubernetes.io/name=stacks-blockchain
```

Untuk informasi selengkapnya tentang bagan Helm dan opsi konfigurasi, lihat [bagan beranda](https://github.com/stacks-network/stacks-blockchain/tree/master/deployment/helm/stacks-blockchain).

---
title: Konfigurasi Noda Stacks
description: Parameter konfigurasi dan opsi untuk biner noda-stacks
sidebar_position: 6
---

## Pemakaian

```bash
stacks-node sub-command [--subcommand-option <value>]
```

## Subperintah

:::note The `stacks-node` binary may have deprecated commands that are not documented on this page. Perintah yang tidak digunakan lagi mungkin dapat diakses hingga sepenuhnya dihapus dari sumbernya. :::

### mocknet

Memulai noda berdasarkan penyiapan lokal cepat yang meniru burnchain. Ideal untuk pengembangan kontrak pintar.

Contoh:

```bash
stacks-node mocknet
```

### krypton

Start a node that will join and stream blocks from the public krypton regtest, powered by Blockstack via [Proof of Transfer](../understand-stacks#consensus-mechanism).

Contoh:

```bash
stacks-node krypton
```

### testnet

Start a node that will join and stream blocks from the public testnet.

Contoh:

```bash
stacks-node testnet
```

### mainnet

Memulai noda yang bergabung dan mengalirkan blok dari mainnet publik.

Contoh:

```bash
stacks-node mainnet
```

### mulai

Memulai noda dengan konfigurasi Anda sendiri. Can be used for joining a network, starting a new chain, or replacing default values used by the `mocknet` or `testnet` subcommands.

#### Argumen

**--config**: jalur relatif atau absolut ke file konfigurasi TOML. Diperlukan.

Contoh:

```bash
stacks-node start --config=/path/to/config.toml
```

Lihat [Opsi File Konfigurasi](#configuration-file-options) untuk informasi lebih lanjut.

#### versi

Menampilkan informasi tentang versi saat ini dan siklus rilis.

Contoh:

```bash
stacks-node version
```

#### bantuan

Menampilkan pesan bantuan.

Contoh:

```bash
stacks-node help
```

## Opsi File Konfigurasi

File konfigurasi TOML memiliki beberapa bagian di mana opsi dapat ditempatkan.

Untuk melihat daftar contoh konfigurasi, [lihat halaman ini](https://github.com/stacks-network/stacks-blockchain/tree/master/testnet/stacks-node/conf) .

### Bagian: noda

Berisi berbagai opsi konfigurasi yang berkaitan dengan noda-stacks.

Contoh:

```toml
[node]
rpc_bind = "0.0.0.0:20443"
p2p_bind = "0.0.0.0:20444"
# Enter your private key here
seed = "replace-with-your-private-key"
miner = true
```

#### working_dir (opsional)

Jalur absolut ke direktori yang akan digunakan noda-stacks untuk menyimpan berbagai data.

Contoh:

```toml
working_dir = "/root/stacks-node"
```

#### rpc_bind

Alamat dan port noda-stacks harus diikat untuk koneksi RPC.

Contoh:

```toml
rpc_bind = "0.0.0.0:20443"
```

#### p2p_bind

Alamat dan port noda-stacks harus diikat untuk koneksi RPC.

Contoh:

```toml
p2p_bind = "0.0.0.0:20444"
```

#### data_url (opsional)

Alamat dan port dari mana noda-stacks akan menerima koneksi rpc yang masuk.

Contoh:

```toml
data_url = "1.2.3.4:20443"
```

#### p2p_address (opsional)

Alamat dan port dari mana noda-stacks akan menerima koneksi p2p yang masuk.

Contoh:

```toml
p2p_address = "1.2.3.4:20444"
```

#### bootstrap_node (opsional)

Kunci publik, alamat, dan noda-stacks port harus digunakan untuk menarik data transaksi dari saat memulai.

Contoh:

```toml
bootstrap_node = "047435c194e9b01b3d7f7a2802d6684a3af68d05bbf4ec8f17021980d777691f1d51651f7f1d566532c804da506c117bbf79ad62eea81213ba58f8808b4d9504ad@testnet.blockstack.org:20444"
```

#### wait_time_for_microblocks (opsional)

Jumlah waktu (dalam milidetik) yang akan ditunggu oleh sebuah noda sebelum mencoba menambang sebuah blok, setelah mengejar ujung rantai yang ditautkan. Ini dapat memberi waktu untuk menyiarkan mikroblok yang akan disertakan dalam blok yang ditambang tersebut.

Contoh:

```toml
wait_time_for_microblocks = 15000
```

#### seed (opsional)

Kunci privat yang digunakan untuk menambang. Hanya diperlukan jika `miner` disetel ke `true`.

Contoh:

```toml
seed = "replace-with-your-private-key"
```

#### local_peer_seed (opsional)

Kunci privat yang digunakan untuk menandatangani pesan P2P di jaringan Stacks. Ini membedakan peer jaringan dan digunakan bahkan oleh noda non-penambangan.

Contoh:

```toml
local_peer_seed = "replace-with-your-private-key"
```

#### miner (opsional)

Menentukan apakah noda-stacks menjalankan pengikut (`false`) atau penambang (`true`). Default ke `false` jika dihilangkan.

Contoh:

```toml
miner = true
```

#### mine_microblocks (opsional)

Menentukan apakah noda-stacks akan menambang mikroblok. Hanya akan berlaku jika `miner` disetel ke `true`.

Contoh:

```toml
mine_microblocks = true
```

#### prometheus_bind (opsional)

Alamat dan port noda-stacks harus terbuka untuk pengumpulan metrik Prometheus.

Contoh:

```toml
prometheus_bind = "0.0.0.0:9153"
```

### Bagian: events_observer (opsional)

Berisi opsi untuk menonton event yang dipancarkan oleh layanan [stacks-blockchain-api](https://github.com/hirosystems/stacks-blockchain-api) lokal.

:::info
This section can be repeated multiple times.
:::

Contoh:

```toml
[[events_observer]]
endpoint = "address-to-my-local.stacks-node-api.com:3700"
retry_count = 255
events_keys = ["*"]
```

#### endpoint

Alamat dan port ke api-noda-stacks untuk menonton event.

Contoh:

```toml
endpoint = "address-to-my-local.stacks-node-api.com:3700"
```

#### retry_count

Frekuensi pengiriman ulang event ke endpoint sebelum gagal.

Contoh:

```toml
retry_count = 255
```

#### events_keys

Kunci event yang harus ditonton. Event noda yang dipancarkan dapat dibatasi oleh akun, nama fungsi, dan jenis peristiwa. Asterix ("\*") dapat digunakan untuk memancarkan semua event.

Contoh:

```toml
events_keys = ["*"]
```

```toml
events_keys = [
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.store::print",
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.contract.ft-token",
    "STGT7GSMZG7EA0TS6MVSKT5JC1DCDFGZWJJZXN8A.contract.nft-token",
    "stx"
]
```

### Bagian: connection_options (opsional)

Menentukan opsi konfigurasi untuk orang lain yang terhubung ke noda stacks.

Contoh:

```toml
[connection_options]
public_ip_address = "1.2.3.4:20444"
download_interval = 60
walk_interval = 30
```

#### public_ip_address

IP publik yang diiklankan dari noda-stacks ini.

Contoh:

```toml
public_ip_address = "1.2.3.4:20444"
```

#### download_interval

Waktu (dalam detik) antara upaya mengunduh blok.

Contoh:

```toml
download_interval = 60
```

#### walk_interval

Waktu (dalam detik) antara upaya untuk berjalan di sekitar lingkungan.

Contoh:

```toml
walk_interval = 30
```

#### read_only_call_limit_read_length

Jumlah total byte yang diizinkan untuk dibaca oleh panggilan fungsi read-only individual.

Contoh:

```toml
read_only_call_limit_read_length = 100000
```

#### read_only_call_limit_read_count

Jumlah total operasi baca independen yang diizinkan untuk panggilan fungsi read-only individual.

Contoh:

```toml
read_only_call_limit_read_count = 30
```

#### read_only_call_limit_runtime

Batas [Biaya runtime](https://github.com/stacksgov/sips/blob/2d3fd9bf8da7a04f588d90ff6252173d7609d7bf/sips/sip-006/sip-006-runtime-cost-assessment.md#introduction) untuk panggilan fungsi read-only individual.

Contoh:

```toml
read_only_call_limit_runtime = 1000000000
```

### Bagian: burnchain

Bagian ini berisi opsi konfigurasi yang berkaitan dengan blockchain yang diikat oleh noda-stacks di backend untuk proof-of-transfer (BTC).

Contoh:

```toml
[burnchain]
chain = "bitcoin"
mode = "mainnet"
peer_host = "your.bitcoind.node.org"
rpc_port = 8332
peer_port = 8333
```

#### chain

Noda-stacks blockchain mengikat pada backend untuk proof-of-transfer. Hanya nilai yang didukung: `"bitcoin"`.

Contoh:

```toml
chain = "bitcoin"
```

#### mode

Profil atau fase pengujian untuk menjalankan noda-stacks. Nilai yang valid adalah `"mocknet"`, `"helium"`, `"neon"`, `"argon"`, ` "krypton"`, `"xenon"`.

Contoh:

```toml
mode = "xenon"
```

#### peer_host

Nama domain host yang menjalankan blockchain Bitcoin backend. Diperlukan untuk menjalankan noda Bitcoin pribadi secara lokal, atau menggunakan noda Bitcoin yang dihosting secara publik.

Contoh:

```toml
peer_host = "your.bitcoind.node.org"
```

#### rpc_port

port peer_host noda-stacks akan terhubung untuk koneksi RPC.

Contoh:

```toml
rpc_port = 8332
```

#### peer_port

port peer_host noda-stacks akan terhubung untuk koneksi P2P.

Contoh:

```toml
peer_port = 8333
```

#### burn_fee_cap (opsional)

Jumlah maksimum (dalam Satoshi) dari "komitmen bakar" untuk disiarkan untuk pemilihan blok berikutnya.

Contoh:

```toml
burn_fee_cap = 30000
```

#### satoshis_per_byte (opsional)

Jumlah (dalam Satoshi) per [byte virtual](https://en.bitcoin.it/wiki/Weight_units). Ini digunakan untuk menghitung biaya transaksi.

Contoh:

```toml
satoshis_per_byte = 50
```

Jadi total biaya transaksi adalah `(estimated_tx_size * satoshis_per_byte) + burn_fee_cap`.

#### commit_anchor_block_within (opsional)

Menetapkan periode waktu (dalam milidetik) untuk komitmen. Hanya digunakan bila `mode` disetel ke `"helium"`.

Contoh:

```toml
commit_anchor_block_within = 10000
```

### Bagian: ustx_balance (hanya testnet/regtest)

Bagian ini berisi opsi konfigurasi yang berkaitan dengan alokasi blok genesis untuk alamat di mikro-STX. Jika pengguna mengubah nilai-nilai ini, noda mereka mungkin bertentangan dengan noda lain di jaringan dan tidak dapat menyinkronkan dengan noda lain.

:::info
This section can repeat multiple times, and thus is in double-brackets. Setiap bagian hanya dapat mendefinisikan satu alamat. Bagian ini diabaikan jika menjalankan noda di mainnet.
:::

Contoh:

```toml
[[ustx_balance]]
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
amount = 10000000000000000

[[ustx_balance]]
address = "ST11NJTTKGVT6D1HY4NJRVQWMQM7TVAR091EJ8P2Y"
amount = 10000000000000000

[[ustx_balance]]
address = "ST1HB1T8WRNBYB0Y3T7WXZS38NKKPTBR3EG9EPJKR"
amount = 10000000000000000

[[ustx_balance]]
address = "STRYYQQ9M8KAF4NS7WNZQYY59X93XEKR31JP64CP"
amount = 10000000000000000
```

#### address

Alamat yang menjaga saldo mikro-STX.

Contoh:

```toml
address = "STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6"
```

#### amount

Saldo micro-STX diberikan ke alamat di awal noda.

Contoh:

```toml
amount = 10000000000000000
```

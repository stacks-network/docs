---
title: Stacking
description: Pengantar mekanisme hadiah Proof-of-Transfer
sidebar_position: 9
---

## Pengantar

Stacking memberi hadiah kepada pemegang token Stacks (STX) dengan bitcoin karena menyediakan layanan berharga ke jaringan dengan mengunci token mereka untuk waktu tertentu.

![](/img/stacking.png)

Stacking merupakan tindakan bawaan, yang diperlukan oleh mekanisme "Proof-of-Transfer" (PoX). Mekanisme PoX dijalankan oleh setiap penambang di jaringan Stacks 2.0.

:::info The Stacking consensus algorithm is implemented as a smart contract, using [Clarity](../write-smart-contracts/). [Read more about the contract](../noteworthy-contracts/stacking-contract). :::

## Alur Stacking

Mekanisme Stacking dapat disajikan sebagai berikut:

![Alur Stacking](/img/stacking-illustration.png)

1. Melakukan panggilan API untuk mendapatkan detail tentang siklus hadiah yang akan datang
2. Untuk akun Stacks tertentu, mengkonfirmasikan kelayakannya
3. Mengkonfirmasikan alamat hadiah BTC dan durasi penguncian
4. Transaksi disebarkan dan token STX dikunci. Ini perlu terjadi sebelum fase persiapan dari siklus hadiah berikutnya, 100 blok Bitcoin terakhir dari fase hadiah yang sedang berlangsung
5. Mekanisme Stacks dalam menjalankan siklus hadiah dan mengirimkan hadiah ke alamat hadiah BTC yang ditetapkan
6. Selama periode penguncian, detail tentang waktu pembukaan kunci, hadiah, dan lainnya dapat diperoleh
7. Setelah periode penguncian berlalu, token dilepaskan dan dapat diakses kembali
8. Menampilkan riwayat hadiah, termasuk detail seperti penghasilan untuk siklus hadiah sebelumnya

:::info Keep in mind that the target duration for a reward cycles is ~2 weeks. Durasi ini didasarkan pada waktu blok target jaringan (10 menit) dan bisa lebih tinggi karena [varians waktu konfirmasi](https://www.blockchain.com/charts/median-confirmation-time) dari jaringan bitcoin. :::

## Alur pendelegasian Stacking

Alur Stacking berbeda untuk kasus penggunaan delegasi:

![Alur pendelegasian Stacking](/img/stacking-delegation-illustration.png)

- Sebelum Stacking dapat dimulai untuk pemegang token, delegator harus diberikan izin ke Stacks atas nama pemilik akun. Izin dibatasi hingga jumlah maksimum yang diizinkan untuk di-Stack oleh delegator. Jumlah maksimum tidak dibatasi oleh dana yang tersedia dan dapat diatur sehingga jauh lebih tinggi. Sebuah akun hanya dapat diasosiasikan dengan satu delegator
- Akun harus mendefinisikan hubungan delegasi. Mereka secara opsional dapat membatasi alamat hadiah Bitcoin yang harus digunakan untuk pembayaran, dan ketinggian blok bakar kedaluwarsa untuk izin, sehingga membatasi waktu delegator memiliki izin untuk Stack
- Delegator harus mengunci Stacks dari akun yang berbeda ("fase gabungan") hingga mencapai jumlah minimum Stacks yang diperlukan untuk berpartisipasi dalam Stacking
- Setelah delegator mengunci token STX yang cukup, mereka dapat menyelesaikan dan melakukan partisipasi mereka dalam siklus hadiah berikutnya
- Hubungan delegasi tertentu memungkinkan pemegang STX untuk menerima pembayaran langsung dari penambang (langkah 5/6)
- Pemutusan hubungan delegasi dapat terjadi secara otomatis berdasarkan aturan kedaluwarsa yang ditetapkan atau secara aktif mencabut hak delegasi

## Penambangan PoX

Penambangan PoX adalah modifikasi dari penambangan Proof-of-Burn (PoB), alih-alih mengirim Bitcoin yang berkomitmen ke alamat pembakaran, Bitcoin akan ditransfer ke pemegang STX yang memenuhi syarat yang berpartisipasi dalam protokol stacking.

:::note
A PoX miner can only receive newly minted STX tokens when they transfer Bitcoin to eligible owners of STX tokens
:::

![Alur menambang](/img/pox-mining-flow.png)

Penambang menjalankan noda Stacks dengan penambangan aktif untuk berpartisipasi dalam mekanisme PoX. Noda mengimplementasikan mekanisme PoX, yang memastikan penanganan dan insentif yang tepat melalui empat fase utama:

- Pendaftaran: penambang mendaftar untuk pemilihan mendatang dengan mengirimkan data konsensus ke jaringan
- Komitmen: penambang terdaftar mentransfer Bitcoin untuk berpartisipasi dalam pemilihan. BTC yang berkomitmen dikirim ke satu kumpulan pemegang token STX yang berpartisipasi
- Pemilihan: fungsi acak terverifikasi memilih satu penambang untuk menulis blok baru di blockchain Stacks
- Perakitan: penambang terpilih menulis blok baru dan mengumpulkan hadiah dalam bentuk token STX baru

## Persyaratan pemegang token

Pemegang token Stacks (STX) tidak secara otomatis menerima hadiah stacking. Sebaliknya, mereka harus:

- Komit untuk berpartisipasi sebelum siklus hadiah dimulai
- Komit mengenai jumlah minimum token STX untuk mengamankan slot hadiah, atau menggabungkan dengan orang lain untuk mencapai jumlah minimum
- Mengunci token STX untuk periode tertentu
- Memberikan alamat Bitcoin yang didukung untuk menerima hadiah (native segwit tidak didukung)

Diagram berikut menjelaskan cara token STX minimal per slot ditentukan. Informasi lebih lanjut tentang [minimal dinamis untuk stacking](https://stacking.club) tersedia di stacking.club.

![Minimal dinamis untuk kelayakan individu](/img/stacking-dynamic-minimum.png)

Pemegang token memiliki berbagai penyedia dan alat untuk mendukung partisipasi mereka dalam Stacking. Situs web Stacks berisi [daftar penyedia dan gabungan stacking](https://stacks.org/stacking#earn).

## Stacking dalam algoritma konsensus PoX

Stacking adalah kemampuan bawaan PoX dan terjadi melalui serangkaian tindakan pada blockchain Stacks. [Detail implementasi proof-of-transfer lengkap](https://github.com/stacks-network/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md) ada di SIP-007. Di bawah ini adalah ringkasan tindakan yang paling relevan dari algoritma.

![Siklus PoX](/img/pox-cycles.png)

- Stacking terjadi selama siklus hadiah dengan waktu yang tetap. Dalam setiap siklus hadiah, satu kumpulan alamat Bitcoin yang terkait dengan peserta stacking akan menerima hadiah BTC
- Siklus penghargaan terdiri dari dua fase: persiapan dan penghargaan
- Selama fase persiapan, penambang memutuskan blok terkait dan mengumpulkan hadiah. Menambang cabang turunan dari blok terkait memerlukan transfer dana penambangan ke alamat hadiah yang sesuai. Kumpulan hadiah adalah kumpulan alamat Bitcoin yang memenuhi syarat untuk menerima dana dalam siklus hadiah
- Penambang mendaftar sebagai kandidat pemimpin untuk pemilihan di masa depan dengan mengirimkan transaksi kunci yang dapat membakar mata uang kripto. Transaksi juga mendaftarkan ujung rantai pilihan pemimpin (harus merupakan turunan dari blok terkait) dan komitmen dana ke 2 alamat dari kumpulan hadiah
- Pemegang Token mendaftar untuk siklus hadiah berikutnya dengan menyiarkan pesan yang ditandatangani yang mengunci token STX terkait untuk periode penguncian yang ditentukan protokol, menentukan alamat Bitcoin untuk menerima dana, dan memberikan suara pada ujung rantai Stacks
- Beberapa pemimpin dapat berkomitmen pada ujung rantai yang sama. Pemimpin yang memenangkan pemilihan dan rekan-rekan yang juga mendukung pemimpin itu secara kolektif berbagi hadiah, sebanding dengan berapa banyak yang dibakar oleh masing-masing
- Token yang dikunci pemegang Token secara otomatis akan terbuka setelah periode penguncian selesai

## Alamat bitcoin

:::danger You must provide a BTC address in one of two formats:

* [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash), which starts with `1`.

* [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash), which starts with `3`. The "Native Segwit" format (which starts with `bc1`), for example, is not supported. :::

Kontrak Stacking memerlukan format khusus untuk alamat Bitcoin (alamat hadiah). Ini diperlukan untuk memastikan bahwa penambang dapat dengan benar membuat transaksi Bitcoin yang berisi alamat hadiah.

Alamat harus ditentukan dalam format berikut menggunakan bahasa Clarity:

```clar
;; a tuple of a version and hashbytes buffer
(pox-addr (tuple (version (buff 1)) (hashbytes (buff 20))))
```

`versi` buffer harus mewakili jenis alamat bitcoin yang sedang dikirimkan. Ini dapat berupa:

```js
SerializeP2PKH  = 0x00, // hash160(public-key), same as bitcoin's p2pkh
SerializeP2SH   = 0x01, // hash160(multisig-redeem-script), same as bitcoin's multisig p2sh
SerializeP2WPKH = 0x02, // hash160(segwit-program-00(p2pkh)), same as bitcoin's p2sh-p2wpkh
SerializeP2WSH  = 0x03, // hash160(segwit-program-00(public-keys)), same as bitcoin's p2sh-p2wsh
```

`Hashbytes` adalah 20 byte hash dari alamat bitcoin. Anda bisa mendapatkannya dari pustaka bitcoin, misalnya menggunakan [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```js
const btc = require('bitcoinjs-lib');
console.log(
  '0x' + btc.address.fromBase58Check('1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6').hash.toString('hex')
);
```

## Choosing the right Stacking strategy

[Here](https://blog.stacks.co/stacking-strategy) is an interesting article that may help you choose the right Stacking stategy.


## Where to Stacks?

You can Stack on your own, on a pool or on an exchange:
### Stacking on your own

Stacking on your own is non-custodial.

Stacking on your own requires a protocol minimum (amount changes but about 100,000 STX).

[Hiro Wallet](https://www.hiro.so/wallet) allows stacking on your own.

### Stacking on a pool

Stacking on a pool allows Stacking without the requirement of the protocol minumum.

Some available pools are:

| Pool                                                | Jenis         | Pays rewards in | Fee | Minimum amount |
| --------------------------------------------------- | ------------- |:---------------:| --- |:--------------:|
| [Friedger's Pool](https://pool.friedger.de/)        | Non custodial |   STX or xBTC   | No  |     40 STX     |
| [Planbetter](https://planbetter.org/)               | Non custodial |       BTC       | 5%  |    200 STX     |
| [Stacked](https://staking.staked.us/stacks-staking) | Non custodial |       BTC       |     |  100,000 STX   |
| [Xverse](https://www.xverse.app/)                   | Non custodial |       BTC       | No  |    100 STX     |

### Stacking on an exchange

Stacking on an exchange is custodial, meaning you are trusting the exchange with your Stacks.

Several exchanges allow Stacking directly on their sites. Examples are [Okcoin](https://www.okcoin.com) and [Binance](https://www.binance.com/en/staking)

## Stacking statistics

You can view all sorts of Stacking data and statistics on [Stacking Club](https://stacking.club)
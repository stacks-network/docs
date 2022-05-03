---
title: Proof of Transfer
description: Memahami mekanisme konsensus proof-of-transfer
icon: TestnetIcon
images:
  large: /images/stacking.svg
  sm: /images/stacking.svg
---

## Ringkasan

Algoritma konsensus untuk blockchain membutuhkan sumber daya komputasi atau finansial untuk mengamankan blockchain. Praktik umum dari konsensus terdesentralisasi adalah dengan membuatnya secara praktis tidak memungkinkan bagi setiap aktor jahat untuk memiliki kekuatan komputasi yang cukup atau kepemilikan saham untuk menyerang jaringan.

Mekanisme konsensus populer di blockchain modern termasuk proof-of-work, di mana noda mendedikasikan sumber daya komputasi, dan proof-of-stake, di mana noda mendedikasikan sumber daya keuangan untuk mengamankan jaringan.

Proof-of-burn adalah mekanisme konsensus baru di mana para penambang bersaing dengan 'membakar' (menghancurkan) mata uang kripto proof-of-work sebagai proxy untuk sumber daya komputasi.

Proof-of-transfer (PoX) adalah perpanjangan dari mekanisme proof-of-burn. PoX menggunakan mata uang kripto proof-of-work dari blockchain yang sudah ada untuk mengamankan blockchain baru. Namun, tidak seperti proof-of-burn, alih-alih membakar mata uang kripto, penambang mentransfer mata uang kripto yang berkomitmen ke beberapa peserta lain dalam jaringan.

![Mekanisme PoX](/images/pox-mechanism.png)

Ini memungkinkan peserta jaringan untuk mengamankan jaringan mata uang kripto PoX dan mendapatkan hadiah dalam mata uang kripto dasar. Maka dari itu, blockchain proof-of-transfer terkait pada rantai proof-of-work pilihan mereka. Stacks menggunakan [Bitcoin](#why-bitcoin) sebagai rantai tertautnya.

![Peserta PoX](/images/pox-participants.png)

## Mengapa Bitcoin?

Ada beberapa alasan mengapa Stacks memilih Bitcoin sebagai blockchain untuk mendukung konsensus. Ini adalah protokol blockchain tertua, yang diluncurkan pada tahun 2009, dan telah menjadi aset yang diakui di luar komunitas mata uang kripto. BTC telah memegang kapitalisasi pasar tertinggi dari semua mata uang kripto selama dekade terakhir ini.

Bitcoin unggul pada kesederhanaan dan stabilitas, dan telah teruji oleh waktu. Mempengaruhi atau menyerang jaringan akan menjadi sulit atau tidak praktis bagi peretas yang berpotensial. Ini adalah satu-satunya mata uang kripto yang menarik perhatian publik. Bitcoin adalah nama rumah tangga, dan diakui sebagai aset oleh pemerintah, perusahaan besar, dan lembaga perbankan warisan. Terakhir, Bitcoin sebagian besar dianggap sebagai penyimpan nilai yang andal, dan menyediakan infrastruktur yang luas untuk mendukung mekanisme konsensus proof-of-transfer.

SIP-001 memberikan [daftar lengkap alasan mengapa Bitcoin dipilih untuk mengamankan Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

![btc-stacks](/images/pox-why-bitcoin.png)

## Blok dan mikroblok

Blockchain Stacks memungkinkan peningkatan transaksi melalui mekanisme yang disebut mikroblok. Bitcoin dan Stacks berkembang secara bertahap, dan blok mereka dikonfirmasi secara bersamaan. Di Stacks, ini disebut sebagai 'blok tertaut'. Seluruh blok transaksi Stacks sesuai dengan satu transaksi Bitcoin. Ini secara signifikan meningkatkan rasio biaya/byte untuk memproses transaksi Stacks. Karena produksi blok yang secara simultan, Bitcoin bertindak sebagai pembatas kecepatan untuk membuat blok Stacks, sehingga mencegah serangan penolakan layanan pada jaringan rekanannya.

Namun, di antara blok terkait Stacks yang menetap di blockchain Bitcoin, ada juga sejumlah mikroblok yang memungkinkan penyelesaian transaksi Stacks secara cepat dengan tingkat kepercayaan yang tinggi. Hal ini memungkinkan transaksi Stacks untuk menskalakan secara independen dari Bitcoin, sambil tetap secara berkala menetapkan finalitas dengan rantai Bitcoin. Blockchain Stacks mengadopsi model streaming blok di mana setiap pemimpin dapat secara adaptif memilih dan mengemas transaksi ke dalam blok mereka saat mereka tiba di mempool. Oleh karena itu ketika blok terkait dikonfirmasi, semua transaksi dalam aliran mikroblok induk dikemas dan diproses. Ini merupakan metode yang belum pernah terjadi sebelumnya untuk mencapai skalabilitas tanpa membuat protokol yang benar-benar terpisah dari Bitcoin.

![stx-mikroblok](/images/stx-microblocks.png)

## Membuka kunci modal Bitcoin

Stacks juga membuka ratusan miliar modal dalam Bitcoin, dan memberi para Bitcoiner peluang baru untuk menggunakan dan mendapatkan BTC. Stacks merupakan pendamping ekosistem Bitcoin, dan dua jaringan yang bekerja bersama-sama memungkinkan cara yang benar-benar baru dalam menggunakan BTC. Ekosistem Stacks membuat aplikasi mata uang kripto yang interaktif tersedia untuk pemegang Bitcoin. Selain itu, dengan stacking token STX dan berpartisipasi dalam mekanisme konsensus PoX, pengguna memiliki kesempatan untuk mendapatkan BTC sambil mengamankan rantai Stacks.

![Membuka kunci Bitcoin](/images/pox-unlocking-btc.png)

## Clarity dan status Bitcoin

Kontrak pintar Clarity juga memiliki visibilitas unik ke dalam status blockchain Bitcoin. Ini berarti bahwa logika kontrak dalam file Clarity memiliki kemampuan untuk memicu ketika transaksi Bitcoin tertentu dikonfirmasi. Kontrak cerdas Clarity memiliki bukti Verifikasi Pembayaran Sederhana (SPV) bawaan untuk Bitcoin yang membuat interaksi dengan status Bitcoin menjadi lebih mudah bagi pengembang. Selain itu, kontrak Clarity dapat bercabang dengan rantai Bitcoin yang asli. Oleh karena itu, dalam kasus di mana Bitcoin bercabang, pengembang tidak perlu khawatir untuk menyesuaikan penerapan kontrak pintar mereka.

## Lihat juga

- [Baca whitepaper PoX lengkap](https://community.stacks.org/pox)
- [Tonton CEO Muneeb Ali dan Evangelist Joe Bender memberikan ringkasan tentang mekanisme penambangan PoX terobosan Stack](https://www.youtube.com/watch?v=NY_eUrIcWOY)

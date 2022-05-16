---
title: Mikroblok
description: Panduan untuk Mikroblok Stacks
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Pengantar

Mikroblok adalah fitur level-protokol dari blockchain Stacks yang dapat menyelesaikan tantangan teknis dari latensi transaksi. Karena setiap block di Stacks ditautkan ke blok Bitcoin melalui [mekanisme konsensus Proof-of-Transfer][], Stacks akan terbatasi oleh waktu blok yang sama seperti jaringan Bitcoin. Mikroblok memungkinkan blockchain Stacks untuk melakukan transisi status antara blok tertaut.

Microblocks are a powerful mechanism for developers to create performant, high quality applications on Stacks, while still inheriting the security of Bitcoin.

## Status transaksi

[Model pembuatan blok Stacks][] dijelaskan pada SIP-001. Standar tersebut menguraikan mekanisme di mana pemimpin blok terpilih dapat menghasilkan blok di blockchain Stacks baik dengan mengelompokkan transaksi atau dengan mengalirkannya. Mikroblok adalah produk dari model streaming.

Jika pemimpin blok telah memilih untuk menambang mikroblok, pemimpin memilih transaksi dari mempool dan mengemasnya menjadi mikroblok pada epoch saat ini. Mikroblok adalah blok transaksi yang dimasukkan oleh penambang setelah blok tertaut sebelumnya ditambang, namun sebelum blok berikutnya dipilih. Transaksi yang termasuk dalam mikroblok diproses oleh jaringan: hasilnya akan diketahui.

Pertimbangkan suatu transaksi dari perspektif jumlah konfirmasi blok yang dimilikinya. Transaksi yang termasuk dalam mikroblok dapat memiliki siklus hidup sebagai berikut:

```
Transaksi 1 disiarkan ke mempool. Awalnya memiliki 0 konfirmasi.
Transaksi 1 telah dimasukkan ke dalam mikroblok. Sekarang masih memiliki 0 konfirmasi, namun hasil dari transaksi sudah diketahui. Transaksi 1 telah dimasukan ke dalam blok tertaut berikutnya. Sekarang memiliki 1 konfirmasi.
Blok Stacks berikutnya mengkonfimasi blok sebelumnya. Transaksi 1 sekarang memiliki 2 konfirmasi.
Blok Stacks berikutnya mengkonfimasi blok sebelumnya. Transaksi 1 sekarang memiliki 3 konfirmasi.
...
```

Pertimbangkan suatu transaksi serupa yang belum dimasukkan ke dalam suatu mikroblok:

```
Transaksi 2 disiarkan ke mempool. Awalnya memiliki 0 konfirmasi.
Transaksi 2 telah dimasukkan ke dalam blok tertaut berikutnya. Sekarang memiliki 1 konfirmasi.
Blok Stacks berikutnya mengkonfimasi blok sebelumnya. Transaksi 2 sekarang memiliki 2 konfirmasi.
Blok Stacks berikutnya mengkonfimasi blok sebelumnya. Transaksi 2 sekarang memiliki 3 konfirmasi.
```

Siklus hidup dari dua transaksi tersebut mirip, namun perbedaannya terdapat pada status tertunda. Banyak wallet Bitcoin menampilkan saldo 0-konfirmasi: saldo wallet Anda dengan transaksi mempool apapun yang telah terjadi. Hal ini berguna karena dapat menunjukkan pada Anda ketika Anda sudah mengirim atau menerima transaksi. Dengan kontrak pintar, menampilkan status tertunda bukan suatu proses yang sederhana, karena pada kontrak pintar bukan hanya terdapat transfer tapi juga perpindahan dari input ke output, kontrak pintar juga dapat memanggil kontrak pintar lainnya, memancarkan event, atau melakukan komputasi lainnya. Transaksi yang diproses dalam mikroblok menghasilkan semua informasi itu.

-> If a transaction is dependent on a chain state that could by altered by previous transactions with serious implications, you should carefully consider whether it should be performed using microblocks.

## Mengaktifkan mikroblok

Penambang dapat memilih untuk mengaktifkan atau menonaktifkan mikroblok pada konfigurasi penambangan. Sebagai praktik terbaik, penambang harus mengaktifkan penambangan mikroblok. Ketika aplikasi atau pengguna mengirimkan transaksi, transaksi tersebut dapat menyertakan argumen yang mengharuskan transaksi berada dalam mikroblok, blok tertaut, atau salah satunya.

### Transaksi

Transaksi mencakup opsi yang mengontrol apakah penambang harus memasukkannya ke dalam mikroblok atau blok tertaut. Opsi transaksi mode tertaut adalah argumen opsional yang mengontrol apakah suatu transaksi harus disertakan dalam blok tertaut atau mikroblok, atau memenuhi syarat untuk salah satunya.

### Penambangan

Penambang Stacks harus mengaktifkan mikroblok dalam konfigurasi penambangnya untuk menerapkan model streaming blok. Untuk informasi lebih lanjut, lihat [penambangan mikroblok][].

## Mengembangkan dengan mikroblok

Pada kebanyakan kasus, informasi dari transaksi yang ada pada mikroblok harus diperlakukan seperti informasi yang datang dari blok lain. Wallet dan penjelajah menampilkan konsekuensi transaksi mikroblok sebagai keadaan jaringan saat ini. Keadaannya tentatif.

Suatu transaksi mikroblok dapat direorganisasi pada blok berikutnya alih-alih dikonfirmasi apa adanya. Karena itu, UI Anda harus bisa mengkomunikasikan kepada pengguna jika keluaran transaksi berubah, atau jika blok terkait transaksi berubah. Ini adalah hasil yang sama seperti jika terjadi percabangan 1 blok.

### Pustaka Stacks.js

Stacks.js provides the [AnchorMode][] argument on transaction objects so that your application can set the microblocks preference for transactions.

### API

!> Dukungan API untuk mikroblok masih menjadi pekerjaan yang sedang dilakukan. Tinjau [dokumentasi API][microblocks_api] dengan cermat untuk memastikan bahwa Anda tetap mendapat informasi aktual terhadap implementasi dari mikroblok.

API Blockchain Stacks mengeluarkan mikroblok melalui berbagai endpoint. Silakan tinjau [panduan API Blockchain Stacks][] untuk informasi lebih lanjut.

## Praktik Terbaik

Bekerja dengan mikroblok adalah keputusan desain yang harus Anda lakukan untuk aplikasi yang Anda buat. Ketika bekerja dengan mikroblok, praktik terbaik berikut ini disarankan.

### Menangani nonce

Penanganan nonce dengan mikroblok merupakan hal yang menantang karena akun nonce berikutnya harus memperhitungkan nilai nonce yang termasuk dalam mikroblok, yang mungkin belum termasuk dalam blok tertaut. API Blockchain Stacks [memberikan endpoint][] untuk mendapatkan nonce berikutnya untuk prinsipal yang diberikan.

### Desain Aplikasi

Keadaan dari transaksi mikroblok harus secara cermat dikomunikasikan ke pengguna. Tidak ada transaksi yang menjadi final sebelum dimasukkan ke dalam blok tertaut, dan desain aplikasi Anda harus menunjukkan ini.

The following guidelines are provided as an initial set of best practices for UI design when incorporating microblocks into your application.

#### Penjelajah

Menampilkan status tertunda, namun memperingatkan bahwa transaksi masih tertunda. Diindikasikan secara visual bahwa saldo yang ditampilkan bergantung pada status tertunda.

#### Wallet

Menampilkan status tertunda, namun memperingatkan bahwa transaksi masih tertunda. Diindikasikan secara visual bahwa saldo yang ditampilkan bergantung pada status tertunda.

#### Bursa

Melanjutkan untuk menghitung konfirmasi, status mikroblok masih dianggap sebagai tertunda.

#### Aplikasi

Komunikasi mikroblok sangat bergantung terhadap aplikasi. Untuk beberapa aplikasi, menampilkan transaksi yang masih tertunda atau 0-konfirmasi sebagai terkonfirmasi mungkin tidak apa-apa. Misalnya, menyimpan data di rantai, atau mengqueri kontrak BNS. Untuk aplikasi lain, seperti mengirim nilai nyata, menunggu 3-konfirmasi akan lebih bijaksana sebelum menampilkan status sebagai terkonfirmasi.

[mekanisme konsensus Proof-of-Transfer]: /understand-stacks/proof-of-transfer
[Model pembuatan blok Stacks]: https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md#operation-as-a-leader
[penambangan mikroblok]: /understand-stacks/mining#microblocks
[AnchorMode]: https://stacks-js-git-master-blockstack.vercel.app/enums/transactions.anchormode.html
[panduan API Blockchain Stacks]: https://docs.hiro.so/get-started/stacks-blockchain-api#microblocks-support
[memberikan endpoint]: https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling
[microblocks_api]: https://docs.hiro.so/api#tag/Microblocks

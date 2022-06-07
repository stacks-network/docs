---
title: Memahami Stacks
description: Pelajari lebih lanjut tentang blockchain Stacks 2.0
sidebar_position: 1
---

![](/img/SBC-L-2x-10.png)
## Pengantar

Stacks 2.0 adalah blockchain lapisan-1 yang terhubung ke Bitcoin dan membawa kontrak pintar dan aplikasi terdesentralisasi ke dalamnya. Kontrak pintar dan aplikasi yang dikembangkan di platform Stacks secara native terintegrasi dengan keamanan, stabilitas, dan kekuatan ekonomi Bitcoin.

## Kemampuan

Baca lebih lanjut tentang fitur-fitur yang disediakan blockchain Stacks 2.0.

<!-- markdown-link-check-disable -->

:::tip Check out the [technical specifications](technical-specs) for a brief overview :::


<!-- markdown-link-check-enable-->

A detailed [comparison of the Stacks blockchain to other blockchain technologies][] is available at the Stacks Foundation blog.
### Mekanisme konsensus
![](/img/pages/stacking.svg) Stacks 2.0 mengimplementasikan mekanisme penambangan baru yang disebut Proof of Transfer ("PoX"). PoX adalah algoritma konsensus antara dua blockchain. Menggunakan blockchain yang sudah mapan (dalam hal ini Bitcoin) untuk mengamankan blockchain baru (Stacks).

PoX terhubung ke Bitcoin dengan rasio blok 1:1, artinya apa pun yang terjadi di blockchain Stacks dapat diverifikasi di Blockchain Bitcoin.

Instead of burning electricity on proof of work, PoX reuses already minted bitcoins as "proof of computation" and miners represent their cost of mining in bitcoins directly.


[Read more about Proof of Transfer](proof-of-transfer)
### Penambangan

![](/img/pages/testnet-sm.svg) Menambang diperlukan untuk membuat jaringan dapat digunakan, dapat dipercaya, dan aman. Penambang memverifikasi transaksi masuk, berpartisipasi dalam mekanisme konsensus, dan menulis blok baru ke blockchain.

Untuk memberi insentif pada penambangan, penambang menerima token Stacks (STX) yang baru dicetak jika mereka memenangkan tawaran untuk menjadi pemimpin putaran berikutnya.

[Read more about Mining](mining)

### Stacking

Bitcoin yang digunakan untuk tawaran penambang dikirim ke sekumpulan alamat spesifik yang sesuai dengan pemegang token Stacks (STX) yang secara aktif berpartisipasi dalam konsensus ("Stackers"). Jadi, alih-alih dihancurkan, bitcoin yang digunakan dalam proses penambangan diberikan kepada pemegang Stacks yang produktif sebagai hadiah berdasarkan kepemilikan Stacks dan partisipasi mereka dalam algoritma Stacking.

Stacker harus mengunci token Stacks (STX) mereka untuk jangka waktu tertentu.

[Read more about Stacking](stacking)

### Kontrak pintar

![](/img/pages/write-smart-contracts-sm.svg) Clarity adalah bahasa baru untuk kontrak pintar di blockchain Stacks 2.0. Bahasa kontrak cerdas Clarity mengoptimalkan prediktabilitas dan keamanan.

Stacks 2.0 menambatkan kontrak pintar Clarity ke Bitcoin sehingga memungkinkan kontrak pintar untuk beroperasi berdasarkan tindakan yang terlihat pada blockchain bitcoin.

:::note The [Clarity open-source project](https://clarity-lang.org/) is supported by Stacks and [Algorand](https://www.algorand.com/) :::


Clarity berbeda dari bahasa lain yang dirancang untuk menulis kontrak pintar dalam beberapa cara:

- **Prediktabilitas**: Bahasa Clarity menggunakan sintaks yang tepat dan tidak ambigu yang memungkinkan pengembang memprediksi dengan tepat bagaimana kontrak mereka akan dijalankan.
- **Keamanan**: Bahasa Clarity memungkinkan pengguna untuk menyediakan kondisi mereka sendiri untuk transaksi yang memastikan bahwa kontrak tidak akan pernah tiba-tiba mentransfer token yang dimiliki oleh pengguna.
- **Tidak ada kompiler**: Kontrak yang ditulis dalam Clarity disebarkan di blockchain Stacks persis seperti yang ditulis oleh pengembang. Ini memastikan bahwa pengembang kode yang menulis, menganalisis, dan menguji, persis seperti yang dijalankan.

[Read more about Clarity](../write-smart-contracts/clarity-language/)

## Panduan

Baca salah satu panduan kami untuk memahami seluk beluk blockchain Stacks 2.0.

* [Account](../understand-stacks/accounts)
* [Transaksi](../understand-stacks/transactions)
* [Jaringan](../understand-stacks/network)
* [Mikroblok](../understand-stacks/microblocks)

[comparison of the Stacks blockchain to other blockchain technologies]: https://stacks.org/stacks-blockchain

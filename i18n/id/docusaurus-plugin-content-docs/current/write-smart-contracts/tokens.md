---
title: Token
description: Pelajari tentang dukungan token dalam Clarity
sidebar_position: 3
---

## Pengantar

Penggunaan mendasar dari teknologi blockchain adalah representasi, penyimpanan, dan transfer nilai antara pengguna blockchain. Mata uang kripto adalah penggunaan teknologi blockchain yang sangat umum, dan tetap menjadi salah satu pendorong utama adopsi teknologi blockchain. Mata uang kripto direpresentasikan oleh token blockchain: unit nilai individual dalam ekosistem blockchain tertentu. Token Blockchain dapat melampaui mata uang digital, bagaimanapun, dan perkembangan terakhir di seluruh komunitas mata uang kripto telah menunjukkan potensi penggunaan blockchain untuk tokenize dan merepresentasikan tidak hanya uang tetapi aset berwujud lainnya.

Token blockchain adalah aset digital yang dapat diverifikasi dan dimiliki oleh pengguna blockchain. Token Blockchain diatur oleh seperangkat aturan yang ditentukan oleh blockchain itu sendiri (dalam kasus token asli) atau oleh kontrak pintar pada blockchain. Aturan dapat bervariasi tergantung pada sifat dan penggunaan token.

Token pada blockchain terbagi dalam dua kategori umum, tergantung pada propertinya: [sepadan][] atau [tidak-sepadan][]. Bagian berikut membahas properti dari kedua jenis token, dan memberikan informasi tentang penerapan kedua jenis token di Stacks.

## Fungible tokens

Properti inti dari token apa pun di blockchain adalah fungibilitas. Token yang sepadan adalah token yang dapat saling dipertukarkan atau mampu saling menggantikan. Dengan kata lain, satu kuantitas atau bagian dari token yang sepadan dapat diganti dengan jumlah yang sama atau bagian dari token yang sepadan yang sama. Token yang sepadan sering digunakan untuk merepresentasikan dunia nyata yang sepadan seperti mata uang. Token STX adalah contoh dari token yang sepadan. Contoh lain termasuk stablecoin, token yang mewakili hak suara dalam DAO, atau token yang secara algoritma melacak harga saham.

Token yang sepadan membentuk salah satu proposisi nilai terpenting untuk teknologi blockchain, kemampuan untuk menyimpan nilai dan menukar nilai tersebut melalui transaksi internal dan eksternal. Karena token yang sepadan dapat dibagi menjadi bagian-bagian yang lebih kecil dan digabungkan kembali menjadi representasi nilai yang sama, mereka melayani utilitas yang hebat untuk mentransfer nilai antara pengguna blockchain.

Token utama yang sepadan pada blockchain Stacks adalah token asli, STX. Because the Stacks blockchain allows for the creation of \[smart contracts\]\[\], other fungible tokens can be created on the Stacks blockchain as well. [SIP-010][] specifies the standard for fungible tokens on the Stacks blockchain. Spesifikasi ini mendefinisikan fungsi dan sifat yang _harus_ dimiliki oleh token yang sepadan pada Stacks. Dengan mematuhi standar ini, token yang sepadan pada Stacks dapat dengan mudah direpresentasikan oleh wallet yang mendukung Stacks.

### Memahami standar token yang sepadan

The [SIP-010][] standard is an interface definition that allows Stacks applications and wallets to interact with fungible tokens in a standard way. Mendukung standar mengurangi kompleksitas pembuat token untuk memasukkan token mereka ke dalam ekosistem. Under the [SIP-010][] standard, fungible tokens must have the following characteristics:

- Kemampuan untuk mentransfer sejumlah token tertentu ke penerima (`transfer`). Penerima harus menjadi prinsipal Stacks.
- Kemampuan untuk mendapatkan nama token yang dapat dibaca oleh manusia (`get-name`).
- Kemampuan untuk mendapatkan nama pendek (simbol ticker) untuk token (`get-symbol`).
- Kemampuan untuk mendapatkan jumlah desimal dalam representasi token (`get-decimals`). Ini digunakan untuk membangun representasi token yang biasa dihadapi oleh seseorang. Misalnya, dolar AS memiliki 2 desimal, jika satuan dasarnya adalah sen.
- Kemampuan untuk mendapatkan saldo token untuk prinsipal Stacks tertentu (`get-balance-of`).
- Kemampuan untuk mendapatkan total pasokan token (`get-total-supply`).
- URI ke metadata yang terkait dengan token (`get-token-uri`). Ini dapat menyelesaikan metadata luar-rantai tentang token atau kontrak, seperti ikon gambar untuk token atau deskripsi.

## Non-fungible tokens (NFT)

Non-fungible tokens (NFT) adalah jenis token yang tidak dapat dipertukarkan. NFT memiliki sifat unik (biasanya dalam bentuk metadata lampiran) yang membatasi kemampuan untuk menggantinya dengan token yang identik. NFT adalah token yang unik, seperti karya seni, atau hak kepemilikan atas aset nyata seperti rumah.

NFT sendiri tidak memiliki nilai bawaan, seperti mata uang. Nilai NFT berasal dari aset yang direpresentasikan oleh NFT. Penggunaan NFT sangat banyak, termasuk seni digital, koleksi, nama domain, dan representasi kepemilikan hak konten. NFT dapat digunakan sebagai sertifikat digital yang melacak keaslian barang nyata, atau mendigitalkan hak kepemilikan atas properti.

As with fungible tokens, NFTs on the Stacks blockchain are created with smart contracts. [SIP-009][] specifies the standard for NFTs on the Stacks blockchain. Spesifikasi ini mendefinisikan fungsi dan sifat yang _harus_ dimiliki, tetapi sebagian besar NFT memiliki lebih banyak fungsi atau sifat yang dilampirkan daripada yang hanya dijelaskan oleh spesifikasi. Dengan mematuhi standar ini, token yang tidak sepadan pada Stacks dapat dengan mudah direpresentasikan oleh wallet yang mendukung Stacks.

### Memahami standar token yang tidak sepadan

The [SIP-009][] standard is an interface definition that the Stacks ecosystem aligned on. Dengan dukungan untuk standar ini di seluruh dompet dan alat, akan menjadi makin mudah untuk berinteraksi dengan NFT. Under the [SIP-009][] standard, NFT contract must have the following characteristics:

- Kemampuan untuk mendapatkan pengidentifikasi token terakhir (`get-last-token-id`). Id ini merepresentasikan batas atas NFT yang dikeluarkan oleh kontrak.
- URI ke metadata yang terkait dengan pengidentifikasi token tertentu. (`get-token-uri`). URI ini dapat diselesaikan menjadi file JSON dengan informasi tentang pembuatnya, file media terkait, deskripsi, tanda tangan, dan banyak lagi.
- Kemampuan untuk memverifikasi pemilik untuk pengidentifikasi token yang diberikan (`get-owner`). The owner resolves to a [Stacks principal](principals).
- Kemampuan untuk mentransfer NFT ke penerima (`transfer`). Penerima harus menjadi prinsipal Stacks.

## Bacaan lebih lanjut

- [Perbedaan Antara Token Fungible dan Non-Fungible](https://101blockchains.com/fungible-vs-non-fungible-tokens/)
- [Jelaskan Seperti Saya 5: NFT](https://messari.io/article/explain-it-like-i-am-5-nfts)

[sepadan]: #fungible-tokens
[tidak-sepadan]: #non-fungible-tokens-nfts
[SIP-010]: https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md
[SIP-009]: https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md

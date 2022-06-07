---
title: Gaia
description: Arsitektur penyimpanan terdesentralisasi untuk data luar-rantai
sidebar_position: 5
tags:
  - gaia
---

## Pengantar

Aplikasi yang dibuat dengan blockchain Stacks menyimpan data luar-rantai menggunakan sistem penyimpanan yang disebut Gaia.

Sementara metadata transaksional publik paling baik disimpan di blockchain Stacks, data aplikasi pengguna seringkali dapat disimpan lebih efisien dan pribadi di penyimpanan Gaia.

Menyimpan data dari blockchain memastikan bahwa aplikasi Stacks dapat memberi pengguna kinerja tinggi dan ketersediaan tinggi untuk baca dan tulis data tanpa memperkenalkan pihak kepercayaan pusat.

## Memahami Gaia dalam arsitektur Stacks

Diagram berikut menggambarkan arsitektur Stacks dan tempat Gaia di dalamnya:

![Arsitektur Stacks](/img/architecture.png)

Blockchain membutuhkan konsensus di antara sejumlah besar orang, sehingga mereka bisa melambat. Selain itu, blockchain tidak dirancang untuk menampung banyak data. Ini artinya menggunakan blockchain untuk setiap bit data yang mungkin ditulis dan disimpan pengguna itu mahal. Misalnya, bayangkan jika sebuah aplikasi menyimpan setiap tweet dalam rantai.

Blockchain Stacks mengatasi masalah kinerja menggunakan pendekatan berlapis. Lapisan dasar terdiri dari blockchain Stacks dan Sistem Penamaan Blockchain (BNS). Blockchain mengatur kepemilikan identitas di jaringan Stacks. Identitas dapat berupa nama seperti nama domain, nama pengguna, atau nama aplikasi.

Ketika identitas dibuat, pembuatannya dicatat di blockchain Stacks. Identitas membentuk data utama yang disimpan ke dalam blockchain Stacks. Identitas ini sesuai dengan perutean data di Stacks OSI. Data perutean disimpan di Jaringan Atlas Peer, lapisan kedua. Setiap noda inti yang bergabung dengan Jaringan Stacks dapat memperoleh seluruh salinan data perutean ini. Stacks menggunakan data perutean untuk mengaitkan identitas (nama domain, nama pengguna, dan nama aplikasi) dengan lokasi penyimpanan tertentu di lapisan akhir, yaitu Sistem Penyimpanan Gaia.

Sistem Penyimpanan Gaia terdiri dari _layanan hub_ dan sumber daya penyimpanan pada penyedia perangkat lunak cloud. Penyedia penyimpanan dapat berupa penyedia komersial apa pun seperti Azure, DigitalOcean, Amazon EC2, dan sebagainya. Biasanya sumber daya komputasi dan sumber daya penyimpanan berada di vendor cloud yang sama, meskipun ini bukan suatu keharusan. Gaia saat ini memiliki dukungan driver untuk S3, Azure Blob Storage, Google Cloud Platform, dan disk lokal, tetapi model driver juga memungkinkan dukungan backend lainnya.

Gaia menyimpan data sebagai penyimpanan nilai kunci sederhana. Saat identitas dibuat, penyimpanan data yang sesuai dikaitkan dengan identitas tersebut di Gaia. Saat pengguna masuk ke dApp, proses autentikasi memberikan aplikasi URL hub Gaia, yang kemudian ditulis ke penyimpanan atas nama pengguna tersebut.

Blockchain Stacks hanya menyimpan data identitas. Data yang dibuat oleh tindakan dari identitas yang disimpan dalam Sistem Penyimpanan Gaia. Setiap pengguna memiliki data profil. Saat pengguna berinteraksi dengan dApp yang terdesentralisasi, aplikasi tersebut menyimpan data aplikasi atas nama pengguna. Karena Gaia menyimpan data pengguna dan aplikasi dari blockchain, Stacks DApp biasanya lebih berkinerja daripada DApps yang dibuat di blockchain lain.

## Kontrol pengguna atau cara Gaia didesentralisasi

Hub Gaia berjalan sebagai layanan yang menulis ke penyimpanan data. Penyimpanan itu sendiri adalah penyimpanan nilai kunci sederhana. Layanan hub menulis ke penyimpanan data dengan meminta token autentikasi yang valid dari pemohon. Biasanya, layanan hub berjalan pada sumber daya komputasi dan penyimpanan itu sendiri pada sumber daya penyimpanan khusus yang terpisah. Biasanya, kedua sumber daya milik penyedia komputasi cloud yang sama.

![Penyimpanan Gaia](/img/gaia-storage.png)

Pendekatan Gaia terhadap desentralisasi berfokus pada kontrol pengguna atas data dan penyimpanannya. Pengguna dapat memilih penyedia hub Gaia. Jika pengguna dapat memilih penyedia hub Gaia mana yang akan digunakan, maka pilihan itu adalah semua desentralisasi yang diperlukan untuk mengaktifkan aplikasi yang dikontrol oleh pengguna. Selain itu, Gaia mendefinisikan API seragam untuk aplikasi untuk mengakses data tersebut.

Kontrol data pengguna terletak pada cara data pengguna diakses. Saat aplikasi mengambil file `data.txt` untuk pengguna tertentu `alice.id`, pencarian akan mengikuti langkah-langkah berikut:

1. Ambil `zonefile` untuk `alice.id`.
2. Baca URL profilnya dari `zonefile`.
3. Ambil profil Alice.
4. _Verifikasi_ bahwa profil ditandatangani oleh kunci `alice.id`
5. Temukan url read-only dari bagian profil `appsMeta` (mis. `https://example-app.gaia.alice.org`).
6. Ambil file dari `https://example-app.gaia.alice.org/data.txt`.

Karena `alice.id` memiliki akses ke [zonefile](https://docs.stacks.co/references/bns-contract#name-update), dia dapat mengubah di mana profilnya disimpan. Misalnya, dia dapat melakukan ini jika penyedia layanan atau penyimpanan profil saat ini disepakati. Untuk mengubah tempat penyimpanan profilnya, dia mengubah URL hub Gaia nya ke URL hub Gaia lainnya. Jika pengguna memiliki sumber daya komputasi dan penyimpanan yang cukup, pengguna dapat menjalankan Sistem Penyimpanan Gaia mereka sendiri dan mengabaikan penyedia hub Gaia komersial secara bersamaan.

:::caution
Users with existing identities cannot yet migrate their data from one hub to another.
:::

Aplikasi yang menulis langsung atas nama `alice.id` tidak perlu melakukan pencarian. Alih-alih, [Alur autentikasi Stacks](https://stacks.js.org) menyediakan URL hub gaia pilihan Alice ke aplikasi. Alur autentikasi ini _juga_ dalam kontrol Alice karena wallet Alice _harus_ menghasilkan respons autentikasi.

## Memahami penyimpanan data

Hub Gaia menyimpan data tertulis _persis_ seperti yang diberikan. Ini menawarkan jaminan minimal tentang data. Hub Gaia tidak memastikan bahwa data diformat secara valid, berisi tanda tangan yang valid, atau dienkripsi. Sebaliknya, filosofi desain menyatakan bahwa masalah ini adalah masalah dari sisi klien.

Pustaka klien (seperti [`Stacks.js`](https://stacks.js.org/)) mampu memberikan jaminan ini. Definisi liberal dari [prinsip ujung-ke-ujung](https://en.wikipedia.org/wiki/End-to-end_principle) memandu keputusan desain ini.

Saat aplikasi ditulis ke hub Gaia, token autentikasi, kunci, dan data diteruskan ke hub Gaia.

![Tulisan Gaia](/img/gaia-writes.png)

Token memastikan aplikasi memiliki otorisasi untuk menulis ke hub atas nama pengguna.

## Gaia versus sistem penyimpanan lainnya

Berikut ini adalah cara Gaia menghadapi sistem penyimpanan terdesentralisasi lainnya. Fitur yang umum untuk semua sistem penyimpanan dihilangkan.

| Fitur                                                 | [Gaia](https://github.com/stacks-network/gaia) | [Sia](https://sia.tech/) | [Storj](https://storj.io/) | [IPFS](https://ipfs.io/) | [DAT](https://datproject.org/) | [SSB](https://www.scuttlebutt.nz/) |
| ----------------------------------------------------- | ---------------------------------------------- | ------------------------ | -------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| Pengguna mengontrol tempat data dihosting             | X                                              |                          |                            |                          |                                |                                    |
| Data dapat dilihat di browser Web biasa               | X                                              |                          |                            | X                        |                                |                                    |
| Data dapat dibaca/ditulis                             | X                                              |                          |                            |                          | X                              | X                                  |
| Data dapat dihapus                                    | X                                              |                          |                            |                          | X                              | X                                  |
| Data dapat dicantumkan                                | X                                              | X                        | X                          |                          | X                              | X                                  |
| Ruang data yang dihapus dapat diambil kembali         | X                                              | X                        | X                          | X                        |                                |                                    |
| Pencarian data memiliki kinerja yang dapat diprediksi | X                                              |                          | X                          |                          |                                |                                    |
| Izin menulis dapat didelegasikan                      | X                                              |                          |                            |                          |                                |                                    |
| Izin pencantuman dapat didelegasikan                  | X                                              |                          |                            |                          |                                |                                    |
| Mendukung banyak backend secara asli                  | X                                              |                          | X                          |                          |                                |                                    |
| Data dapat dialamatkan secara global                  | X                                              | X                        | X                          | X                        | X                              |                                    |
| Membutuhkan mata uang kripto untuk bekerja            |                                                | X                        | X                          |                          |                                |                                    |
| Data ditujukan untuk konten                           |                                                | X                        | X                          | X                        | X                              | X                                  |

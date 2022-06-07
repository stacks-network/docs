---
title: Transaksi
description: Panduan untuk transaksi Stacks 2.0
sidebar_position: 6
---

## Pengantar

Transaksi adalah unit dasar eksekusi di blockchain Stacks. Each transaction is originated from a [Stacks 2.0 account](accounts), and is retained in the Stacks blockchain history for eternity. Panduan ini akan membantu Anda memahami transaksi Stacks 2.0.

## Siklus hidup

Transaksi melewati fase sebelum akhirnya dikonfirmasi, dan tersedia untuk semua, di jaringan Stacks 2.0.

![Siklus hidup transaksi](/img/tx-lifecycle.png)

- **Membuat**: Transaksi dibuat sesuai dengan spesifikasi pengkodean.
- **Validasi dan tanda tangan**: Transaksi divalidasi untuk memastikan transaksi dilakukan dengan baik. Tanda tangan diperlukan untuk diisi.
- **Broadcast**: Transaksi dikirim ke noda.
- **Daftar**: Seorang penambang menerima transaksi, memverifikasi, dan menambahkannya ke ["mempool"](https://academy.binance.com/en/glossary/mempool), area penyimpanan untuk semua transaksi yang tertunda.
- **Proses**: Penambang meninjau mempool dan memilih transaksi untuk blok berikutnya yang akan ditambang. Tergantung pada jenis transaksi, tindakan yang berbeda dapat terjadi dalam langkah ini. Misalnya, pasca kondisi dapat diverifikasi untuk transfer token, token yang ditentukan kontrak cerdas dapat dicetak, atau upaya untuk memanggil metode kontrak cerdas yang ada dapat dilakukan.
- **Konfirmasi**: Penambang berhasil menambang blok dengan serangkaian transaksi. Transaksi di dalam berhasil disebarkan ke jaringan.

:::note A transaction can have one of three states once it is registered: `pending`, `success`, or `failed`. :::

## Tipe

Stacks 2.0 mendukung serangkaian jenis transaksi yang berbeda:

| **Jenis**          | **Nilai**           | **Deskripsi**                                                                                                                                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coinbase           | `coinbase`          | Transaksi pertama di blok baru (entitas yang memegang beberapa transaksi). Digunakan untuk mendaftar hadiah blok. Ini tidak dibuat dan disiarkan secara manual seperti jenis transaksi lainnya. |
| Transfer token     | `token_transfer`    | Transfer aset dari pengirim ke penerima                                                                                                                                                         |
| Penyebaran kontrak | `smart_contract`    | Instansiasi kontrak                                                                                                                                                                             |
| Panggilan kontrak  | `contract_call`     | Panggilan kontrak untuk fungsi publik, non read-only                                                                                                                                            |
| Mikroblok Poison   | `poison_microblock` | Menghukum para pemimpin yang dengan sengaja mengelak tentang mikroblok yang telah mereka kemas                                                                                                  |

Contoh setiap jenis transaksi dapat ditemukan di [Definisi respon Stacks Blockchain API untuk transaksi](https://docs.hiro.so/api#operation/get_transaction_by_id).

:::caution Read-only contract call calls do **not** require transactions. Read more about it in the [network guide](network#read-only-function-calls). :::

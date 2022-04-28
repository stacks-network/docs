---
title: Transaksi
description: Panduan untuk transaksi Stacks 2.0
icon: TestnetIcon
images:
  large: /images/transaction-signing.svg
  sm: /images/transaction-signing.svg
---

## Pengantar

Transaksi adalah unit dasar eksekusi di blockchain Stacks. Setiap transaksi berasal dari [akun Stacks 2.0](/understand-stacks/accounts), dan disimpan dalam riwayat blockchain Stacks untuk selamanya. Panduan ini akan membantu Anda memahami transaksi Stacks 2.0.

## Siklus hidup

Transaksi melewati fase sebelum akhirnya dikonfirmasi, dan tersedia untuk semua, di jaringan Stacks 2.0.

![Siklus hidup transaksi](/images/tx-lifecycle.png)

- **Membuat**: Transaksi dibuat sesuai dengan spesifikasi pengkodean.
- **Validasi dan tanda tangan**: Transaksi divalidasi untuk memastikan transaksi dilakukan dengan baik. Tanda tangan diperlukan untuk diisi.
- **Broadcast**: Transaksi dikirim ke noda.
- **Daftar**: Seorang penambang menerima transaksi, memverifikasi, dan menambahkannya ke ["mempool"](https://academy.binance.com/en/glossary/mempool), area penyimpanan untuk semua transaksi yang tertunda.
- **Proses**: Penambang meninjau mempool dan memilih transaksi untuk blok berikutnya yang akan ditambang. Tergantung pada jenis transaksi, tindakan yang berbeda dapat terjadi dalam langkah ini. Misalnya, pasca kondisi dapat diverifikasi untuk transfer token, token yang ditentukan kontrak cerdas dapat dicetak, atau upaya untuk memanggil metode kontrak cerdas yang ada dapat dilakukan.
- **Konfirmasi**: Penambang berhasil menambang blok dengan serangkaian transaksi. Transaksi di dalam berhasil disebarkan ke jaringan.

> Sebuah transaksi dapat memiliki salah satu dari tiga status setelah didaftarkan: `tertunda`, `berhasil`, atau `gagal`.

## Jenis

Stacks 2.0 mendukung serangkaian jenis transaksi yang berbeda:

| **Jenis**          | **Nilai**           | **Deskripsi**                                                                                                                                                                                   |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coinbase           | `coinbase`          | Transaksi pertama di blok baru (entitas yang memegang beberapa transaksi). Digunakan untuk mendaftar hadiah blok. Ini tidak dibuat dan disiarkan secara manual seperti jenis transaksi lainnya. |
| Transfer token     | `token_transfer`    | Transfer aset dari pengirim ke penerima                                                                                                                                                         |
| Penyebaran kontrak | `smart_contract`    | Instansiasi kontrak                                                                                                                                                                             |
| Panggilan kontrak  | `contract_call`     | Panggilan kontrak untuk fungsi publik, non read-only                                                                                                                                            |
| Mikroblok Poison   | `poison_microblock` | Menghukum para pemimpin yang dengan sengaja mengelak tentang mikroblok yang telah mereka kemas                                                                                                  |

Contoh setiap jenis transaksi dapat ditemukan di [Definisi respon Stacks Blockchain API untuk transaksi](https://docs.hiro.so/api#operation/get_transaction_by_id).

~> Panggilan kontrak read-only **tidak** memerlukan transaksi. Baca lebih lanjut tentangnya di [panduan jaringan](/understand-stacks/network#read-only-function-calls).

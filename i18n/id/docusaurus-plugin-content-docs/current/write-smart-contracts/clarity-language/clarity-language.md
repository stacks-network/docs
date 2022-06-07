---
title: Clarity Language
description: Ringkasan dari konstruksi bahasa Clarity
sidebar_label: Clarity Language
tags:
  - clarity
---

## Sistem Tipe Clarity

Bahasa Clarity menggunakan sistem tipe statis yang kuat. Argumen fungsi dan skema database memerlukan tipe tertentu, dan penggunaan tipe diperiksa selama peluncuran kontrak. Sistem tipe _tidak_ memiliki tipe universal super.

## Fungsi publik

Fungsi yang ditentukan melalui pernyataan `define-public` adalah fungsi _publik_ dan ini adalah satu-satunya jenis fungsi yang dapat dipanggil secara langsung melalui transaksi blockchain yang ditandatangani. Selain dapat dipanggil langsung dari suatu transaksi (lihat format wire Stacks untuk detail lebih lanjut tentang transaksi Stacks), fungsi publik dapat dipanggil oleh kontrak pintar lainnya.

Fungsi publik _harus_ mengembalikan tipe `(respons ...)`. Ini digunakan oleh Clarity untuk menentukan apakah perubahan dari menjalankan fungsi akan terwujud atau tidak. Jika suatu fungsi mengembalikan tipe `(err ...)`, setiap mutasi pada status blockchain dari menjalankan fungsi (dan fungsi apa pun yang dipanggil selama eksekusi) akan dibatalkan.

Selain fungsi yang ditentukan melalui `define-public`, kontrak dapat mengekspos fungsi read-only. Fungsi-fungsi ini, yang ditentukan melalui `define-read-only`, dapat dipanggil oleh kontrak pintar lainnya, dan dapat diquerikan melalui penjelajah blockchain publik. Fungsi-fungsi ini _tidak boleh_ mengubah status blockchain apa pun. Tidak seperti fungsi publik normal, fungsi read-only dapat mengembalikan jenis apa pun.

## Panggilan kontrak

Kontrak pintar dapat memanggil fungsi dari kontrak pintar lainnya menggunakan fungsi `(contract-call?)`.

Fungsi ini mengembalikan hasil tipe respons -- nilai pengembalian dari fungsi kontrak pintar yang disebut.

Kami membedakan 2 jenis `contract-call?` yang berbeda, yaitu:

### Pengiriman statis

Yang dipanggil adalah kontrak invarian yang diketahui tersedia dalam-rantai saat kontrak pemanggil diterapkan. Dalam hal ini, prinsipal yang dipanggil disediakan sebagai argumen pertama, diikuti dengan nama metode dan argumennya:

```clarity
(contract-call?
    .registrar
    register-name
    name-to-register)
```

### Pengiriman dinamis

Yang dipanggil diteruskan sebagai argumen, dan diketik sebagai referensi sifat (`<A>`).

```clarity
(define-public (swap (token-a <can-transfer-tokens>)
                     (amount-a uint)
                     (owner-a principal)
                     (token-b <can-transfer-tokens>)
                     (amount-b uint)
                     (owner-b principal)))
     (begin
         (unwrap! (contract-call? token-a transfer-from? owner-a owner-b amount-a))
         (unwrap! (contract-call? token-b transfer-from? owner-b owner-a amount-b))))
```

Sifat dapat didefinisikan secara lokal:

```clarity
(define-trait can-transfer-tokens (
    (transfer-from? (principal principal uint) (response uint)))
```

Atau diimpor dari kontrak yang ada:

```clarity
(use-trait can-transfer-tokens
    .contract-defining-trait.can-transfer-tokens)
```

Melihat kesesuaian sifat, kontrak yang dipanggil memiliki dua jalur yang berbeda. Mereka "kompatibel" oleh suatu sifat dengan mendefinisikan metode yang cocok melalui beberapa metode yang didefinisikan dalam suatu sifat, atau secara eksplisit menyatakan kesesuaian menggunakan pernyataan `impl-trait`:

```clarity
(impl-trait .contract-defining-trait.can-transfer-tokens)
```

Kesesuaian eksplisit harus lebih dipilih apabila memadai. Bertindak sebagai perlindungan dengan membantu sistem analisis statis untuk mendeteksi penyimpangan dalam tanda tangan metode sebelum penerapan kontrak.

Batasan berikut dikenakan pada panggilan kontrak:

1. Pada pengiriman statis, kontrak pintar yang dipanggil <em x id="4">harus</em> ada pada saat pembuatan.
2. Tidak ada siklus yang mungkin ada dalam grafik panggilan kontrak pintar. Mencegah rekursi (dan bug masuk kembali). Struktur tersebut dapat dideteksi dengan analisis statis dari grafik panggilan, dan akan ditolak oleh jaringan.
3. `contract-call?` hanya untuk panggilan antar kontrak. Upaya untuk menjalankan ketika pemanggil juga yang dipanggil akan membatalkan transaksi.

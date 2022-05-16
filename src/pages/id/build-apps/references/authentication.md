---
title: Autentikasi
description: Daftar dan masuk pengguna menggunakan identitas pada blockchain Stacks
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Pengantar

Panduan ini menjelaskan bagaimana autentikasi dilakukan pada blockchain Stacks.

Autentikasi menyediakan cara bagi pengguna untuk mengidentifikasi diri mereka ke aplikasi sambil mempertahankan kontrol penuh atas kredensial dan detail pribadinya. Ini dapat diintegrasikan sendiri atau digunakan bersama dengan [penandatanganan transaksi](https://docs.hiro.so/get-started/transactions#signature-and-verification) dan [penyimpanan data](https://docs.stacks.co/gaia/overview), yang merupakan prasyarat.

Pengguna yang mendaftar untuk aplikasi Anda selanjutnya dapat mengautentikasi ke aplikasi lain dengan dukungan untuk [Sistem Penamaan Blockchain](/build-apps/references/bns) dan sebaliknya.

## Cara kerjanya

Alur autentikasi dengan Stacks mirip dengan alur klien-server biasa yang digunakan oleh layanan masuk terpusat (misalnya, OAuth). Namun, dengan Stacks alur autentikasi terjadi sepenuhnya di sisi klien.

Aplikasi dan autentikator, seperti [Wallet Stacks](https://www.hiro.so/wallet/install-web), berkomunikasi selama alur autentikasi dengan meneruskan dua token. Aplikasi yang melakukan permintaan mengirimkan token `authRequest` kepada autentikator. Setelah pengguna menyetujui autentikasi, autentikator merespons aplikasi dengan token `authResponse`.

Token ini didasarkan pada [standar JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) dengan dukungan tambahan untuk kurva `secp256k1` yang digunakan oleh Bitcoin dan banyak mata uang kripto lainnya. Mereka diteruskan melalui string kueri URL.

Saat pengguna memilih untuk mengautentikasi aplikasi, itu akan mengirimkan token `authRequest` ke autentikator melalui string kueri URL dengan parameter yang bernama sama yaitu:

`https://wallet.hiro.so/...?authRequest=j902120cn829n1jnvoa...`

Saat autentikator menerima permintaan, autentikator akan menghasilkan token `authResponse` untuk aplikasi dengan menggunakan _kunci transit sementara_ . Kunci transit sementara hanya digunakan untuk contoh aplikasi tertentu, dalam hal ini, untuk menandatangani `authRequest`.

Aplikasi menyimpan kunci transit sementara selama pembuatan permintaan. Bagian publik dari kunci transit diteruskan dalam token `authRequest`. Autentikator menggunakan bagian publik dari kunci untuk mengenkripsi _kunci privat aplikasi_ yang dikembalikan melalui `authResponse`.

Autentikator membuat kunci privat aplikasi dari _identitas alamat kunci privat_ pengguna dan domain aplikasi. Kunci privat aplikasi memiliki tiga fungsi:

1. Digunakan untuk membuat kredensial yang memberikan akses aplikasi ke keranjang penyimpanan di hub Gaia pengguna
2. Digunakan dalam enkripsi ujung-ke-ujung dari file yang disimpan untuk aplikasi di penyimpanan pengguna Gaia.
3. Berfungsi sebagai rahasia kriptografi yang dapat digunakan aplikasi untuk melakukan fungsi kriptografi lainnya.

Terakhir, kunci privat aplikasi bersifat deterministik, artinya kunci privat yang sama akan selalu dibuat untuk alamat dan domain Stacks tertentu.

The first two of these functions are particularly relevant to [data storage with Stacks.js](https://docs.stacks.co/build-apps/references/gaia).

## Pasangan kunci

Autentikasi dengan Stacks akan membuat ekstensif jika menggunakan kriptografi kunci publik secara umum dan ECDSA dengan kurva `secp256k1` secara khusus.

Bagian berikut menjelaskan tiga pasangan kunci publik-privat yang digunakan, termasuk bagaimana mereka dibuat, di mana mereka digunakan dan kepada siapa kunci privat diungkapkan.

### Kunci privat transit

Privat transit adalah kunci sementara yang digunakan untuk mengenkripsi rahasia yang perlu diteruskan dari autentikator ke aplikasi selama proses autentikasi. Ini dibuat secara acak oleh aplikasi di awal respons autentikasi.

Kunci publik yang sesuai dengan kunci privat transit disimpan dalam susunan elemen tunggal dalam `public_keys` dari token permintaan autentikasi. Autentikator mengenkripsi data rahasia seperti kunci privat aplikasi menggunakan kunci publik ini dan mengirimkannya kembali ke aplikasi saat pengguna masuk ke aplikasi. Kunci privat transit menandatangani permintaan autentikasi aplikasi.

### Identitas alamat kunci privat

Identitas alamat kunci privat berasal dari frasa keychain pengguna dan merupakan kunci privat dari nama pengguna Stacks yang dipilih pengguna untuk masuk ke aplikasi. Ini merupakan rahasia yang dimiliki oleh pengguna dan jangan pernah meninggalkan rahasia pengguna dari autentikator.

Kunci privat ini menandatangani token respons autentikasi untuk aplikasi yang menunjukkan bahwa pengguna telah menyetujui masuk ke aplikasi tersebut.

### Kunci privat aplikasi

Kunci privat aplikasi adalah kunci privat khusus aplikasi yang dihasilkan dari identitas alamat kunci privat pengguna menggunakan `domain_name` sebagai masukan.

Kunci privat aplikasi dibagikan secara aman dengan aplikasi pada setiap autentikasi, dan dienkripsi oleh autentikator dengan kunci publik transit. Karena kunci transit hanya disimpan di sisi klien, ini akan mencegah serangan man-in-the-middle di mana server atau penyedia internet berpotensi mengintip kunci privat aplikasi.

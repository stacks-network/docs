---
title: Tips penerapan
description: Mempelajari beberapa metode umum untuk menerapkan aplikasi Anda.
---

## Pengantar

Aplikasi Stacks adalah aplikasi web yang mengautentikasi pengguna dengan Stacks Auth dan menyimpan data dengan Gaia. Kedua teknologi ini dapat diakses dari sisi klien. Dengan demikian, desain dan pengoperasian aplikasi Stacks cenderung sederhana, karena dalam banyak kasus, aplikasi tersebut tidak perlu menghosting apa pun selain aset aplikasi.

## Tempat untuk menerapkan aplikasi Anda

Sebelum pengguna dapat berinteraksi dengan aplikasi Anda, Anda harus menerapkannya pada server yang dapat diakses melalui internet. Untuk memulai penerapan, Anda harus melakukan hal di bawah ini:

- Mengkonfigurasikan atau menyesuaikan file pada direktori `public`.
- Membangun situs aplikasi Anda untuk penerapan.
- Menyalin file aplikasi yang Anda buat ke server produksi Anda.

Jika Anda pertama kali mengisi aplikasi dengan generator aplikasi Stacks, aplikasi Anda berisi blok awal untuk mengkonfigurasi, membangun, dan menerapkan aplikasi Anda. Misalnya, template React membuat perancah dengan blok penyusun berikut.

| File atau Direktori        | Deskripsi                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| node_modules/react-scripts | Satu set skrip dapat membantu Anda memulai proyek React tanpa mengkonfigurasi, jadi Anda tidak perlu menyiapkan proyek Anda sendiri.                               |
| package.json               | Berisi bagian skrip yang menyertakan referensi ke skrip-react, yang merupakan dependensi. Skrip ini membuat direktori build yang berisi file Anda untuk penerapan. |
| public/favicon.ico         | Contoh ikon pintasan.                                                                                                                                              |
| public/index.html          | Halaman entri untuk aplikasi.                                                                                                                                      |
| public/manifest.json       | File JSON yang menjelaskan aplikasi web Anda ke browser.                                                                                                           |
| cors                       | Berisi contoh file penerapan untuk konfigurasi permintaan lintas-asal.                                                                                             |

Jika Anda menggunakan generator untuk membuat perancah JavasScript atau Vue, file konfigurasi proyek Anda akan berbeda.

Terlepas dari perancah mana yang Anda gunakan, Anda harus menyesuaikan dan memperluas perancah dasar ini sesuai kebutuhan aplikasi Anda. Misalnya, Anda mungkin ingin menambahkan lebih banyak properti ke file `manifest.json`. Karena setiap aplikasi berbeda, Stacks Auth tidak dapat memberi Anda petunjuk khusus tentang cara melakukannya. Langkah-langkah yang Anda ambil khusus untuk aplikasi Anda sendiri.

## Autentikasi Stacks dan penerapannya

Saat aplikasi Anda mengautentikasi pengguna dengan Stacks, Wallet Stacks pada URL meminta sumber daya (manifes aplikasi) dari DApp Anda. Permintaan untuk sumber daya di luar asal (Wallet Stacks) disebut sebagai _permintaan lintas-asal_(COR). Mendapatkan data dengan cara ini bisa berisiko, jadi Anda harus mengkonfigurasi keamanan situs web Anda untuk memungkinkan interaksi lintas asal.

Anda dapat menganggap interaksi CORS sebagai gedung apartemen dengan Keamanan. Misalnya, jika Anda perlu meminjam tangga, Anda dapat meminta tetangga di gedung Anda yang memilikinya. Keamanan kemungkinan besar tidak akan bermasalah dengan permintaan ini (yaitu, sama-asal, gedung Anda). Jika Anda memerlukan alat tertentu, dan Anda memesannya dikirim dari toko perangkat keras online (yaitu, lintas-asal, situs lain), Keamanan dapat meminta identifikasi sebelum mengizinkan petugas pengiriman masuk ke gedung apartemen. (Credit: Codecademy)

Cara Anda mengkonfigurasi COR bergantung pada perusahaan yang Anda gunakan untuk menghost aplikasi web Anda. Generator aplikasi menambahkan direktori `cors` ke perancah aplikasi Anda. Direktori ini berisi file untuk Netlify (`_headers` dan `_redirects`) serta satu untuk Firebase (`firebase.json`). Konfigurasi pada direktori `cors` membuat file `manifest.json` aplikasi Anda dapat diakses oleh aplikasi lain (misalnya, ke Browser Stacks). Jika Anda menerapkan ke layanan selain Netlify atau Firebase, Anda harus mengkonfigurasi CORS pada layanan tersebut untuk menyertakan header berikut saat menayangkan `manifest.json`:

```html
Access-Control-Allow-Origin: * Access-Control-Allow-Headers: "X-Requested-With, Content-Type,
Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding" Access-Control-Allow-Methods:
"POST, GET, OPTIONS, DELETE, PUT"
```

Lihat dokumentasi untuk layanan hosting Anda untuk mempelajari cara mengkonfigurasi CORS pada layanan tersebut.

## Penerapan dan Radiks

Jika Anda menerapkan aplikasi Stacks yang menggunakan [Radiks](https://github.com/stacks-network/radiks), penerapan Anda mencakup server dan komponen database. Anda harus mempertimbangkan hal ini saat menerapkan aplikasi Anda. Anda mungkin ingin memilih layanan seperti [Heroku](https://www.heroku.com) atau [Digital Ocean](https://www.digitalocean.com) jika aplikasi Anda menggunakan Radiks.

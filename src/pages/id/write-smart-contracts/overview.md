---
title: Ringkasan Clarity
description: Ringkasan dan panduan untuk memulai Clarity
images:
  large: /images/contract.svg
  sm: /images/contract.svg
---

## Pengantar

Clarity adalah bahasa kontrak pintar yang **dapat ditentukan** yang mengoptimalkan prediktabilitas dan keamanan, dirancang untuk blockchain Stacks. Kontrak pintar memungkinkan pengembang untuk mengkodekan logika bisnis penting di blockchain.

## Kontrak pintar

Kontrak pintar mengkodekan dan menegakkan aturan untuk memodifikasi kumpulan data tertentu yang dibagikan di antara orang-orang dan entitas yang belum tentu saling percaya satu sama lain. Misalnya, kontrak pintar dapat menyimpan dana dalam escrow sampai beberapa pihak setuju untuk melepaskan dana tersebut, membuat buku besar sendiri dan melacak token barunya sendiri (sepadan atau tidak sepadan), dan bahkan membantu membuat rantai pasokan lebih transparan.

Karena kontrak pintar adalah program yang ada di blockchain, siapa pun dapat mengquerikan, dan siapa pun dapat mengirimkan transaksi untuk menjalankannya. Menjalankan kontrak pintar dapat menghasilkan transaksi baru yang ditulis ke blockchain.

Aplikasi dapat memanfaatkan kontrak pintar untuk mengelola status global yang dapat dilihat oleh publik. Siapa pun dapat mengaudit blockchain untuk memverifikasi secara independen bahwa status bersama global aplikasi telah dikelola dengan benar sesuai dengan aturan kontrak pintar.

Ada [plugin Clarity Visual Studio Code][] yang tersedia untuk bantuan sintaks dan debugging.

## Kasus penggunaan

Tidak semua aplikasi terdesentralisasi memerlukan kontrak pintar, tetapi Clarity membuka kemampuan menarik untuk aplikasi yang terdesentralisasi. Contoh dari kasus penggunaan termasuk, namun tidak terbatas pada:

- Kontrol akses (misalnya membayar untuk bisa mengakses)
- Non-fungible (misalnya barang koleksi) dan token fungible (misalnya stablecoin)
- Template model bisnis (misalnya langganan)
- Blockchain khusus aplikasi
- Decentralized Autonomous Organizations

## Desain bahasa

Clarity berbeda dari kebanyakan bahasa kontrak pintar lainnya dalam dua hal penting yaitu:

- Bahasa diinterpretasikan dan disiarkan di blockchain sebagaimana adanya (tidak dikompilasi)
- Bahasa dapat ditentukan (tidak Turing lengkap)

Menggunakan bahasa yang diinterpretasikan memastikan bahwa kode yang dieksekusi dapat dibaca oleh manusia dan dapat diaudit. Bahasa yang dapat ditentukan seperti Clarity memungkinkan untuk menentukan dengan tepat kode mana yang bisa dijalankan, untuk fungsi apa pun.

Kontrak pintar Clarity terdiri dari dua bagian, ruang data dan serangkaian fungsi. Hanya kontrak pintar terkait yang dapat mengubah ruang data terkait di blockchain. Fungsi mungkin bersifat privat dan dengan demikian hanya dapat dipanggil dari dalam kontrak pintar, atau publik dan dengan demikian dapat dipanggil dari kontrak lain. Pengguna memanggil fungsi publik kontrak pintar dengan menyiarkan transaksi di blockchain yang dapat memanggil fungsi publik. Kontrak juga dapat memanggil fungsi publik dari kontrak pintar lainnya.

Perhatikan beberapa aturan dan batasan bahasa Clarity utama.

- Satu-satunya tipe primitif adalah boolean, integer, buffer, dan prinsipal.
- Rekursi adalah ilegal dan tidak memiliki fungsi anonim.
- Looping hanya dilakukan melalui `map`, `filter`, atau `fold`.
- Ada dukungan untuk daftar, namun, satu-satunya daftar panjang variabel dalam bahasa yang muncul sebagai input fungsi; tidak ada dukungan untuk operasi daftar seperti menambahkan atau bergabung.
- Variabel tidak dapat diubah.

## Jelajahi lebih banyak

Untuk detail dan referensi bahasa, lihat berikut ini:

[@page-reference | grid] | /write-smart-contracts/principals, /write-smart-contracts/values, /references/language-overview

[plugin Clarity Visual Studio Code]: https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp

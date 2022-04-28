---
title: Pertanyaan Umum (FAQ)
description: Pertanyaan Umum
---

## Mengapa transfer saya tertunda?

Biasanya karena biaya Anda terlalu rendah atau [nonce](#what-is-nonce) Anda salah.

Informasi lebih lanjut dapat ditemukan [di sini](https://www.hiro.so/wallet-faq/why-is-my-stacks-transaction-pending). Ada juga [praktik terbaik dan masalah yang diketahui](https://forum.stacks.org/t/transactions-in-mempool-best-practices-and-known-issues/11659) serta [mendiagnosis transaksi yang tertunda](https://forum.stacks.org/t/diagnosing-pending-transactions/11908).

Ada juga [skrip](https://github.com/citycoins/scripts/blob/main/getnetworkstatus.js) ini untuk melihat 200 transaksi pertama atau semua transaksi di mempool, untuk kemudian mengembalikan nilai biaya maksimum dan rata-rata. Kami telah memperhatikan bahwa menggunakan 1,5-2x biaya rata-rata di mempool umumnya akan memproses barang dalam 6-10 blok bahkan selama kemacetan tinggi.

Ada juga [skrip](https://github.com/citycoins/scripts/blob/main/gettxstatus.js) ini untuk melacak transaksi yang tertunda hingga mencapai status akhir.

## Apa itu Nonce?

Sebuah nonce digunakan untuk memastikan bahwa setiap transaksi berjalan dalam urutan yang benar. Nonce dimulai dari 0, jadi transaksi pertama dari sebuah alamat harus disetel ke nonce=0. Anda dapat menemukan alamat dompet Anda dengan mencari alamat di [penjelajah blockchain Stacks](https://explorer.stacks.co/) mana pun. Anda juga dapat menggunakan saldo `$ stx <address>`.

Jika Anda memiliki nonce transaksi yang kurang dari nonce akun Anda, transaksi tersebut tidak dapat ditambang dan akan (harus) hilang setelah 256 blok. Ini tidak mempengaruhi transaksi masa depan dan oleh karena itu dapat diabaikan begitu saja, mereka berada di masa lalu.

Jika Anda memiliki transaksi nonce yang sama dengan nonce akun Anda, maka transaksi tersebut sah dan harus menjadi baris berikutnya yang akan diproses selanjutnya.

Jika Anda memiliki nonce transaksi yang lebih tinggi dari nonce akun Anda, maka perlu ada rantai transaksi yang dimulai dengan nonce akun Anda agar dapat diproses. Misalnya. Nonce akun Anda adalah 10 tetapi transaksi yang tertunda memiliki nonce 12. Ini tidak dapat ditambang sampai transaksi dengan nonce 10 dan 11 diproses.

## Apa itu Replace-by-fee (RBF)?

Transaksi replace-by-fee (RBF) memberi tahu blockchain bahwa Anda ingin mengganti satu transaksi dengan yang lain, sambil menentukan biaya yang lebih tinggi dari biaya transaksi asli. Suatu transaksi dapat diganti dengan **transaksi lain**, dan tidak terbatas pada operasi yang sama.

Ini dapat digunakan untuk **membatalkan transaksi** secara efektif dengan menggantinya dengan sesuatu yang lain, seperti transfer STX kecil ke alamat lain yang dimiliki.

Ini dapat digunakan untuk **menaikkan biaya untuk transaksi** yang tertunda sehingga dianggap oleh penambang selama periode kemacetan yang tinggi. Ini juga dapat digunakan untuk _mengirim ulang_ transaksi, dalam arti bahwa transaksi RBF mendapat txid baru dan dipertimbangkan lagi (atau lebih cepat) oleh penambang. Misalnya. Saya mengajukan transaksi saya dengan biaya 1 STX di blok 54.123. Dengan blok 54.133 saya melihat tx saya belum diambil, jadi saya RBF dengan 1.1 STX. Kemudian tunggu 10 blok lagi, dan RBF lagi jika tidak diterima. Ada keseimbangan antara melakukan ini terlalu sering dan menjaga kecepatan yang konsisten, tetapi telah terlihat membantu menyelesaikan transaksi, terutama ketika yang baru terus-menerus membanjiri.

Transaksi penggantian harus menggunakan nonce yang sama dengan transaksi awal dengan kenaikan biaya minimal 0,000001 STX. Misalnya. Transaksi awal Anda dikenakan biaya 0,03 STX, transaksi RBF baru harus dikenakan biaya 0,030001 STX atau lebih.

Proses transaksi RBF dengan salah satu dari dua cara berikut:

- Jika penambang mengambil transaksi asli sebelum transaksi RBF diterima, maka transaksi asli diproses dan transaksi pengganti masuk ke status tidak dapat ditambang. Ini pada akhirnya akan hilang dan tidak mempengaruhi transaksi di masa depan.
- Jika penambang mengambil transaksi yang diganti, maka transaksi baru akan diproses alih-alih yang asli, dan status transaksi awal diatur ke “droppped_replaced_by_fee”. Status ini tidak ditampilkan pada explorer tetapi dapat dilihat saat menanyakan file txid.

Mengirimkan beberapa transaksi untuk tindakan yang sama dapat memperlambat segalanya dalam beberapa cara.

- Jika total yang dibelanjakan dalam 2 atau 3 transaksi lebih dari yang dapat dihabiskan dalam satu transaksi, transaksi tersebut tampaknya tidak dapat ditambang.
- Jika biaya untuk beberapa transaksi melebihi saldo STX, transaksi tidak dapat ditambang.

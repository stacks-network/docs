---
title: Spesifikasi Teknis
description: Ringkasan spesifikasi teknis Stacks 2.0
---

## Konsensus

- Proof of Transfer (PoX) seperti yang dijelaskan dalam [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md)
- Jaringan akan bertransisi ke Proof of Burn (PoB) seperti yang dijelaskan dalam [SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md) setelah 10 tahun. [Pelajari lebih lanjut tentang Proof-of-Burn di SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).
- Model ancaman
  - 51% dari kekuatan penambangan Stacks yang berbahaya dapat melakukan serangan pengeluaran ganda
  - 51% dari kekuatan penambangan Bitcoin yang berbahaya dapat mengatur ulang rantai Stacks
- Aktor yang berbeda dan peran mereka
  - Penambang Stacks mengemas transaksi ke dalam blok, menambangnya melalui transaksi Bitcoin, menyebarkannya, dan jika mereka memenangkan perlombaan blok, mereka akan menambahkan mikroblok ke blok pemenang mereka hingga blok berikutnya ditambang. Blok berikutnya mengkonfirmasi aliran mikroblok.
  - Pemegang Stacks dapat mengubah perhitungan batas blok (yang tunduk pada veto penambang) dan dapat memilih untuk menonaktifkan hadiah Proof-of-Transfer untuk siklus hadiah.
- Transaksi dianggap final ketika transaksi "blok komit" yang sesuai pada Bitcoin diselesaikan. Biasanya sampai dengan 3-6 konfirmasi.
- Untuk lebih jelasnya, lihat [Proof of Transfer](/understand-stacks/proof-of-transfer).

## Menambang Proof of Transfer

- Jadwal hadiah Coinbase:
  - 1000 STX/blok untuk 4 tahun pertama
  - 500 STX/blok untuk 4 tahun berikutnya
  - 250 STX/blok untuk 4 tahun berikutnya
  - 125 STX/blok setelahnya
- Hadiah Coinbase terakumulasi untuk "penyortiran yang tidak terjawab": Jika blok Bitcoin tidak memiliki penyortiran (pada ketinggian N), maka blok Stacks apa pun yang ditambang dalam penyortiran berikutnya yang dibangun dari ujung rantai Stacks yang ada pada penyortiran kedua dari belakang (pada ketinggian N- 1) dapat mengklaim codebasenya. Ini mendorong penambang untuk tetap menambang meskipun biaya Bitcoin tinggi.
- Bonus penambangan awal: Ini adalah kasus khusus di atas untuk memberi insentif kepada penambang awal. Coinbase untuk semua blok burnchain antara ketinggian blok pembakaran pertama (akan dipilih oleh penambang independen sebagai bagian dari peluncuran Stacks 2.0) dan pemenang penyortiran pertama terakumulasi dan didistribusikan ke penambang melalui jendela (akan ditentukan). Misalnya, katakanlah tinggi blok bakar adalah 10.000 dan penyortiran pertama berada di blok 10500 dan jendela distribusi adalah 100 blok, maka coinbase untuk 500 blok pertama (10.500 - 10.000) akan didistribusikan secara merata kepada penambang yang memenangkan penyortiran pada 100 blok berikutnya.
- Hadiah maturitas jendela: 100 blok, yang berarti para pemimpin akan mendapatkan hadiah coinbase 100 blok setelah mereka berhasil menambang.
- Interval blok: Blockchain Stacks menghasilkan blok dengan kecepatan yang sama dengan burnchain yang mendasarinya. Untuk Bitcoin, kira-kira setiap 10 menit.
- Komitmen BTC: Penambang harus melakukan setidaknya 11.000 satoshi (5.500 sats / [keluaran UTXO](https://learnmeabitcoin.com/technical/utxo)); 2 keluaran / blok) untuk menghindari "dust."
- Untuk lebih jelasnya, lihat [Penambangan](/understand-stacks/mining).

## Stacking

- Stacking terdiri dari 2 fase
  1. Fase persiapan: Dalam fase ini, "blok terkait" dipilih. Kumpulan alamat yang memenuhi syarat ("kumpulan hadiah") ditentukan berdasarkan snapshot dari rantai di blok terkait. Panjang fase persiapan adalah 100 blok. Komitmen stacking perlu dikonfirmasi sebelum fase ini dimulai
  2. Fase hadiah: Dalam fase ini, komitmen BTC penambang didistribusikan di antara kumpulan hadiah. Panjang siklus hadiah adalah 2000 blok BTC (~2 minggu).
- Dua alamat / blok hadiah, dengan total 4000 alamat setiap siklus hadiah. Alamat dipilih menggunakan VRF (fungsi acak terverifikasi), sehingga setiap noda dapat secara deterministik tiba di alamat hadiah yang sama untuk blok yang diberikan.
- Ambang stacking: 0,025% dari jumlah partisipasi STX ketika partisipasi antara 25% dan 100% dan ketika partisipasi di bawah 25%, tingkat ambang selalu 0,00625 dari pasokan likuiditas STX.
- Delegasi: Alamat STX dapat menunjuk alamat lain untuk berpartisipasi dalam Stacking atas namanya. [Bagian yang relevan dalam SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md#stacker-delegation).
- Gabungan: Pemegang STX yang secara individu tidak memenuhi ambang Stacking dapat menggabungkan kepemilikan mereka untuk berpartisipasi dalam Stacking. Untuk melakukan ini, pemegang STX harus mengatur alamat hadiah (opsional) ke "alamat delegasi." Untuk lebih jelasnya, lihat [referensi ini](https://docs.stacks.co/references/stacking-contract#delegate-stx).
- Hanya dua jenis alamat hadiah BTC yang didukung: [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash) atau [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash). Native Segwit tidak didukung.
- Bacaan lebih lanjut: [Stacking](/stacks-blockchain/stacking)

## Akun dan Alamat

- Transaksi di blockchain Stacks berasal dari, dibayar oleh, dan dijalankan di bawah otoritas akun
- Sebuah akun sepenuhnya ditentukan oleh alamat + nonce + asetnya
- Alamat berisi 2 atau 3 bidang: versi 1 byte, hash kunci publik 20 byte (RIPEMD160(SHA256(input))), nama opsional (panjang variabel, maks 128 byte)
- Dua jenis akun: akun standar dimiliki oleh satu atau lebih kunci privat; akun kontrak terwujud ketika kontrak pintar dipakai (ditentukan oleh bidang nama opsional di atas)
- Nonce berfungsi menghitung berapa kali akun telah mengotorisasi transaksi. Dimulai dari 0, otorisasi yang valid harus menyertakan nilai nonce _berikutnya_.
- Aset adalah peta semua jenis aset -- STX, semua aset dalam-rantai yang ditentukan oleh kontrak Clarity (misalnya NFT) -- ke dalam jumlah yang dimiliki oleh akun tersebut.
- Akun tidak perlu "dibuat" atau didaftarkan secara eksplisit; semua akun secara implisit ada dan dipakai pada penggunaan pertama.
- Bacaan lebih lanjut: [Akun](/understand-stacks/accounts)

## Transaksi

- Jenis transaksi: coinbase, transfer-token, penyebaran kontrak, panggilan kontrak, mikroblok poison.
- Hanya akun standar (bukan kontrak) yang dapat membayar biaya transaksi.
- Eksekusi transaksi diatur oleh 3 akun (mungkin berbeda atau tidak)
  1. _akun asal_ adalah akun yang membuat, _mengotorisasi_ dan mengirimkan transaksi
  2. _akun pembayaran_ adalah akun yang ditagih oleh pimpinan atas biaya validasi dan pelaksanaan transaksi
  3. _akun pengirim_ adalah akun yang mengidentifikasi siapa yang sedang menjalankan transaksi: ini dapat berubah saat transaksi dijalankan melalui fungsi Clarity `sebagai kontrak`
- Transaksi dapat di-batch atau dialirkan ke dalam blok. Perilaku dapat dikendalikan oleh mode terkait transaksi. Dengan streaming ([mikroblok](/understand-stacks/microblocks)), memungkinkan waktu konfirmasi yang lebih cepat.
- Dua jenis otorisasi: otorisasi standar adalah di mana akun asal sama dengan akun pembayaran. Otorisasi _Bersponsor_ adalah perbedaan antara akun asal dan akun pembayaran. Misalnya, pengembang atau penyedia layanan dapat membayar pengguna untuk memanggil kontrak pintar mereka.
- Untuk otorisasi bersponsor, pertama-tama pengguna menandatangani dengan akun asal dan kemudian sponsor menandatangani dengan akun pembayaran.
- Batas Mempool untuk transaksi tertunda bersamaan adalah 25 per akun
- Transaksi mempool yang tertunda akan dikumpulkan setelah [256 blok diterima](https://github.com/stacks-network/stacks-blockchain/blob/master/src/core/mempool.rs#L62). Dengan waktu blok target 10 menit, ini sama dengan ~42 jam
- [Pelajari lebih lanjut tentang pengkodean transaksi di SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-encoding)
- [Penandatanganan dan verifikasi transaksi dijelaskan dalam SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-signing-and-verifying)
- Semua transaksi yang mempengaruhi saldo akun bersifat atomik, operasi transfer tidak dapat menambah saldo satu akun tanpa mengurangi yang lain. Namun, transaksi yang melakukan beberapa tindakan akun (misalnya, mentransfer dari beberapa akun) mungkin sebagian akan selesai.
- Transaksi dapat menyertakan string memo (maks 34 byte)

## Lihat juga

- [Baca Stacks 2.0 lengkap: Aplikasi dan Kontrak Pintar untuk whitepaper Bitcoin](https://cloudflare-ipfs.com/ipfs/QmaGgiVHymeDjAc3aF1AwyhiFFwN97pme5m536cHT4FsAW).

- [Tonton video Aaron Blankstein di Stacks whitepaper v2](https://www.youtube.com/watch?v=Wd-Bfe8Sn-Y).

---
title: Sistem Penamaan Blockchain
description: Mengikat nama pengguna Stacks ke status luar-rantai
---

Blockchain Naming System (BNS) is a network system that binds Stacks usernames to off-chain state without relying on any central points of control.

Blockchain Stacks V1 mengimplementasikan BNS melalui operasi nama urutan pertama. Di Stacks V2, BNS diimplementasikan melalui kontrak pintar yang dimuat selama blok genesis.

Nama-nama di BNS memiliki tiga properti:

- **Nama yang unik secara global.** Protokol tidak mengizinkan tubrukan nama, dan semua noda yang berperilaku baik menyelesaikan nama yang diberikan ke status yang sama.
- **Nama memiliki makna yang manusiawi.** Setiap nama dipilih oleh pembuatnya.
- **Nama dimiliki secara penuh.** Hanya pemilik nama yang dapat mengubah statusnya. Secara khusus, sebuah nama dimiliki oleh satu atau lebih kunci privat ECDSA.

Blockchain Stacks memastikan bahwa tampilan BNS setiap noda disinkronkan ke semua noda lain di dunia, sehingga kueri pada satu noda akan sama pada noda lain. Noda blockchain Stacks memungkinkan pemilik nama untuk mengikat hingga 40Kb keadaan luar-rantai ke nama mereka, yang akan direplikasi ke semua noda blockchain Stacks lainnya melalui jaringan P2P.

Konsekuensi terbesar bagi pengembang adalah bahwa di BNS, membaca status nama prosesnya akan cepat dan murah namun menulis status nama prosesnya akan lambat dan mahal. Ini karena mendaftarkan dan mengubah nama memerlukan satu atau lebih transaksi untuk dikirim ke blockchain yang mendasarinya, dan noda BNS tidak akan memprosesnya sampai mereka telah dikonfirmasi. Pengguna dan pengembang perlu memperoleh dan membelanjakan mata uang kripto (STX) yang diperlukan untuk mengirim transaksi BNS.

## Motivasi di balik sistem penamaan

Kami mengandalkan sistem penamaan dalam kehidupan sehari-hari, dan sistem penamaan memainkan peran penting dalam banyak aplikasi yang berbeda. Misalnya, ketika Anda mencari teman di media sosial, Anda menggunakan sistem penamaan platform untuk mencari nama agar menemukan profil mereka. Ketika Anda mencari situs web, Anda menggunakan Domain Name Service untuk mencari nama host ke alamat IP hostnya. Ketika Anda memeriksa cabang Git, Anda menggunakan klien Git Anda untuk mencari nama cabang ke commit hash. Ketika Anda mencari kunci PGP milik seseorang di keyserver, Anda mencari ID kunci mereka ke kunci publik mereka.

Hal seperti apa yang kita inginkan untuk menjadi kenyataan mengenai penamaan? Di BNS, nama bersifat unik secara global, nama memiliki makna yang manusiawi, dan nama dimiliki secara penuh. Namun, jika Anda melihat contoh ini, Anda akan melihat bahwa masing-masing hanya menjamin _dua_ properti ini. Ini untuk membatasi seberapa bergunanya mereka.

- Di DNS dan media sosial, namanya unik secara global dan dapat dibaca oleh manusia, namun tidak dimiliki secara penuh. Operator sistem memiliki keputusan akhir tentang apa yang diputuskan oleh masing-masing nama.

  - **Permasalahan**: Klien harus mempercayai sistem untuk membuat pilihan yang tepat dalam penyelesaian nama yang diberikan. Ini termasuk mempercayai bahwa tidak seorang pun kecuali administrator sistem yang dapat membuat perubahan ini.

- Di Git, nama cabang memiliki makna yang manusiawi dan dimiliki secara penuh, namun tidak unik secara global. Dua noda Git yang berbeda dapat mencari nama cabang yang sama ke status repositori berbeda yang tidak terkait.

  - **Permasalahan**: Karena nama dapat merujuk ke dalam keadaan yang bertentangan, pengembang harus mencari tahu beberapa mekanisme lain untuk menyelesaikan ambiguitas. Dalam kasus Git, pengguna harus melakukan intervensi secara manual.

- Di PGP, nama adalah ID kunci. Mereka unik secara global dan dimiliki secara kriptografis, tetapi tidak dapat dibaca oleh manusia. ID kunci PGP berasal dari kunci yang mereka referensikan.
  - **Problem**: These names are difficult for most users to remember since they do not carry semantic information relating to their use in the system.

Nama BNS memiliki ketiga properti ini, dan tidak memiliki satu permasalahan pun. Ini dapat menjadikannya alat yang ampuh untuk membangun semua jenis aplikasi jaringan. Dengan BNS, kita dapat melakukan hal berikut dan banyak lagi:

- Membangun domain name services di mana nama host tidak dapat dibajak.
- Membangun platform media sosial di mana nama pengguna tidak dapat dicuri oleh phisher.
- Membangun sistem kontrol versi di mana cabang repositori tidak bertentangan.
- Build public-key infrastructure where it's easy for users to discover and remember each other's keys.

## Organisasi BNS

Nama BNS diatur ke dalam hierarki nama global. Ada tiga susunan berbeda dalam hierarki ini yang terkait dengan penamaan:

- **Ruang nama**. Ruang nama adalah nama level teratas dalam hierarki. Sebuah analogi untuk ruang nama BNS adalah domain level atas DNS. Ruang nama BNS yang ada meliputi: `.id`, `.podcast`, dan `.helloworld`. Semua nama lain merupakan milik satu ruang nama. Siapa pun dapat membuat ruang nama, tetapi agar ruang nama tetap ada, ruang nama harus _diluncurkan_ sehingga siapa pun dapat mendaftarkan nama di dalamnya. Ruang nama tidak dimiliki oleh pembuatnya.

- **Nama BNS**. Nama BNS adalah nama-nama yang catatannya disimpan langsung di blockchain. Kepemilikan dan status nama-nama ini dikontrol dengan mengirimkan transaksi blockchain. Contoh dari nama BNS yaitu `verified.podcast` dan `muneeb.id`. Siapa pun dapat membuat nama BNS, selama ruang nama yang memuatnya sudah ada.

- **Subdomain BNS**. Subdomain BNS adalah nama-nama yang catatannya disimpan di luar-rantai, tetapi secara kolektif tertaut ke blockchain. Kepemilikan dan status untuk nama-nama ini berada dalam data jaringan P2P. Sementara subdomain BNS dimiliki oleh kunci privat yang terpisah, pemilik nama BNS harus menyiarkan status subdomain mereka. Contoh dari subdomain yaitu `jude.personal.id` dan `podsaveamerica.verified.podcast`. Tidak seperti ruang nama dan nama BNS, status subdomain BNS adalah _bukan_ bagian dari aturan konsensus blockchain.

A feature comparison matrix summarizing the similarities and differences between these name objects is presented below:

| Fitur                                    | **Ruang nama** | **Nama BNS** | **Subdomain BNS** |
| ---------------------------------------- | -------------- | ------------ | ----------------- |
| Unik secara global                       | X              | X            | X                 |
| Bermakna manusiawi                       | X              | X            | X                 |
| Dimiliki oleh kunci privat               |                | X            | X                 |
| Siapa pun dapat membuat                  | X              | X            | [1]               |
| Pemilik bisa memperbarui                 |                | X            | [1]               |
| Status dihosting secara dalam-rantai     | X              | X            |                   |
| Status dihosting secara luar-rantai      |                | X            | X                 |
| Perilaku dikontrol oleh aturan konsensus | X              | X            |                   |
| Mungkin memiliki tanggal kedaluwarsa     |                | X            |                   |

[1] Memerlukan kerjasama pemilik nama BNS untuk menyiarkan transaksinya

## Ruang nama

Ruang nama adalah objek penamaan level atas pada BNS.

Ruang nama mengontrol beberapa properti tentang nama-nama di dalamnya:

- Seberapa mahal untuk mendaftar
- Seberapa lama dapat bertahan sebelum harus diperbarui
- Siapa (jika ada) yang menerima biaya pendaftaran nama
- Siapa yang diizinkan untuk menyemai ruang nama dengan nama awalnya.

Pada saat penulisan ini, ruang nama BNS terbesar adalah ruang nama `.id`. Nama dalam ruang nama `.id` dimaksudkan untuk menyelesaikan identitas pengguna. Nama pendek di `.id` lebih mahal daripada nama panjang, dan harus diperbarui oleh pemiliknya setiap dua tahun. Biaya pendaftaran nama tidak dibayarkan kepada siapa pun secara khusus --- mereka dikirim ke "lubang hitam" di mana mereka dianggap tidak dapat dihabiskan (tujuannya adalah untuk mencegah squatter ID).

Tidak seperti DNS, _siapa saja_ dapat membuat ruang nama dan menyetel propertinya. Ruang nama dibuat berdasarkan yang pertama datang yang pertama dilayani, dan setelah dibuat, mereka bertahan selamanya.

Namun, membuat ruang nama tidak gratis. Pembuat ruang nama harus _membakar_ mata uang kripto untuk melakukannya. Semakin pendek ruang nama, semakin banyak mata uang kripto yang harus dibakar (ruang nama pendek lebih berharga daripada ruang nama panjang). Misalnya, Blockstack PBC 40 BTC membutuhkan biaya untuk membuat ruang nama `.id` pada tahun 2015 (dalam transaksi `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b281`).

Namespaces can be between 1 and 19 characters long, and are composed of the characters `a-z`, `0-9`, `-`, and `_`.

## Subdomain

Nama BNS dimiliki secara penuh karena pemilik dari kunci privatnya dapat menghasilkan transaksi valid yang memperbarui hash dan pemilik file zonanya. Namun, ada biaya yang mengharuskan pemilik nama untuk membayar transaksi yang mendasarinya di blockchain. Selain itu, pendekatan ini membatasi tingkat pendaftaran nama BNS dan operasi ke bandwidth transaksi blockchain yang mendasarinya.

BNS mengatasi ini melalui subdomain. **Subdomain BNS** adalah jenis nama BNS yang status dan pemiliknya disimpan di luar blockchain, tetapi keberadaan dan riwayat operasinya ditautkan ke blockchain. Seperti rekan-rekan dalam-rantai mereka, subdomain secara global itu unik, dimiliki secara kuat, dan dapat dibaca oleh manusia. BNS memberi mereka nama status dan kunci publik mereka sendiri. Tidak seperti nama dalam-rantai, subdomain dapat dibuat dan dikelola dengan murah, karena mereka disiarkan ke jaringan BNS secara berkelompok. Satu transaksi blockchain dapat mengirim hingga 120 operasi subdomain.

Ini dicapai dengan menyimpan catatan subdomain dalam file zona nama BNS. Pemilik nama dalam-rantai menyiarkan operasi subdomain dengan mengkodekan sebagai catatan `TXT` dalam file zona DNS. Untuk menyiarkan file zona, pemilik nama menyetel hash file zona baru dengan transaksi `NAME_UPDATE` dan mereplikasi file zona. Pada gilirannya, mereplikasi semua operasi subdomain yang dikandungnya, dan menautkan kumpulan operasi subdomain ke transaksi dalam-rantai. Aturan konsensus noda BNS memastikan bahwa hanya operasi subdomain yang valid dari transaksi _valid_ `NAME_UPDATE` yang akan disimpan.

For example, the name `verified.podcast` once wrote the zone file hash `247121450ca0e9af45e85a82e61cd525cd7ba023`, which is the hash of the following zone file:

```bash
$TTL 3600
1yeardaily TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxeWVhcmRhaWx5CiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMXllYXJkYWlseS9oZWFkLmpzb24iCg=="
2dopequeens TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAyZG9wZXF1ZWVucwokVFRMIDM2MDAKX2h0dHAuX3RjcCBVUkkgMTAgMSAiaHR0cHM6Ly9waC5kb3Rwb2RjYXN0LmNvLzJkb3BlcXVlZW5zL2hlYWQuanNvbiIK"
10happier TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMGhhcHBpZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMGhhcHBpZXIvaGVhZC5qc29uIgo="
31thoughts TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMXRob3VnaHRzCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzF0aG91Z2h0cy9oZWFkLmpzb24iCg=="
359 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNTkKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8zNTkvaGVhZC5qc29uIgo="
30for30 TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzMGZvcjMwCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzBmb3IzMC9oZWFkLmpzb24iCg=="
onea TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiBvbmVhCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vb25lYS9oZWFkLmpzb24iCg=="
10minuteteacher TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAxMG1pbnV0ZXRlYWNoZXIKJFRUTCAzNjAwCl9odHRwLl90Y3AgVVJJIDEwIDEgImh0dHBzOi8vcGguZG90cG9kY2FzdC5jby8xMG1pbnV0ZXRlYWNoZXIvaGVhZC5qc29uIgo="
36questionsthepodcastmusical TXT "owner=1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH" "seqn=0" "parts=1" "zf0=JE9SSUdJTiAzNnF1ZXN0aW9uc3RoZXBvZGNhc3RtdXNpY2FsCiRUVEwgMzYwMApfaHR0cC5fdGNwIFVSSSAxMCAxICJodHRwczovL3BoLmRvdHBvZGNhc3QuY28vMzZxdWVzdGlvbnN0aGVwb2RjYXN0bXVzaWNhbC9oZWFkLmpzb24iCg=="
_http._tcp URI 10 1 "https://dotpodcast.co/"
```

Setiap catatan `TXT` dalam file zona ini mengkodekan pembuatan subdomain. Misalnya, `1yeardaily.verified.podcast` memutuskan untuk:

```json
{
  "address": "1MwPD6dH4fE3gQ9mCov81L1DEQWT7E85qH",
  "blockchain": "bitcoin",
  "last_txid": "d87a22ebab3455b7399bfef8a41791935f94bc97aee55967edd5a87f22cce339",
  "status": "registered_subdomain",
  "zonefile_hash": "e7acc97fd42c48ed94fd4d41f674eddbee5557e3",
  "zonefile_txt": "$ORIGIN 1yeardaily\n$TTL 3600\n_http._tcp URI 10 1 \"https://ph.dotpodcast.co/1yeardaily/head.json\"\n"
}
```

This information was extracted from the `1yeardaily` `TXT` resource record in the zone file for `verified.podcast`.

### Siklus Subdomain

Perhatikan bahwa `1yeardaily.verified.podcast` memiliki hash (alamat) kunci publik yang berbeda dari `verified.podcast`. Noda BNS hanya akan memproses operasi subdomain berikutnya pada `1yeardaily.verified.podcast` jika noda tersebut menyertakan tanda tangan dari kunci privat alamat ini. `verified.podcast` tidak dapat menghasilkan pembaruan; hanya pemilik `1yeardaily.verified.podcast yang dapat melakukannya`.

Siklus subdomain dan operasinya ditunjukkan pada Gambar 2.

```
   pembuatan                  pembaruan                  transfer
   subdomain                  subdomain                  subdomain
+----------------+         +----------------+         +----------------+
| cicero         |         | cicero         |         | cicero         |
| owner="1Et..." | di-ttd  | owner="1Et..." | di-ttd  | owner="1cJ..." |
| zf0="7e4..."   |<--------| zf0="111..."   |<--------| zf0="111..."   |<---- ...
| seqn=0         |         | seqn=1         |         | seqn=2         |
|                |         | sig="xxxx"     |         | sig="xxxx"     |
+----------------+         +----------------+         +----------------+
        |                          |                          |
        |        luar-rantai       |                          |
~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ | ~ ~ ~ ~ ~ ~ ~ ...
        |         dalam-rantai     |                          |
        V                          V (hash file zona    )     V
+----------------+         +----------------+         +----------------+
| res_publica.id |         |    jude.id     |         | res_publica.id |
|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<--------|  NAME_UPDATE   |<---- ...
+----------------+         +----------------+         +----------------+
   blok                          blok                       blok
   blockchain                    blockchain                 blockchain


Gambar 2: Masa pakai subdomain sehubungan dengan operasi nama dalam-rantai. Operasi 
subdomain baru hanya akan diterima jika memiliki nomor "seqn=" yang lebih baru, 
dan tanda tangan yang valid di "sig=" di atas badan transaksi. Bidang "sig=" 
mencakup kunci publik dan tanda tangan, serta kunci publik harus hash ke bidang "addr=" 
operasi subdomain sebelumnya.

Transaksi pembuatan subdomain dan transfer subdomain untuk
"cicero.res_publica.id" disiarkan oleh pemilik "res_publica.id."
Namun, nama dalam-rantai mana pun ("jude.id" dalam kasus ini) dapat menyiarkan pembaruan subdomain untuk "cicero.res_publica.id."
```

Operasi subdomain diurutkan berdasarkan nomor urut, dimulai dari 0. Setiap operasi subdomain baru harus menyertakan:

- Nomor urut berikutnya
- Kunci publik yang di-hash ke alamat transaksi subdomain sebelumnya
- A signature from the corresponding private key over the entire subdomain operation.

Jika dua operasi subdomain yang ditandatangani dengan benar tetapi bertentangan ditemukan (jika mereka memiliki nomor urut yang sama), salah satu yang terjadi lebih awal dalam riwayat blockchain yang akan diterima. Operasi subdomain yang tidak valid akan diabaikan.

Combined, this ensures that a BNS node with all of the zone files with a given subdomain's operations will be able to determine the valid sequence of state-transitions it has undergone, and determine the current zone file and public key hash for the subdomain.

### Pembuatan dan Pengelolaan Subdomain

Tidak seperti nama dalam-rantai, pemilik subdomain memerlukan bantuan pemilik nama dalam-rantai untuk menyiarkan operasi subdomain mereka. Khususnya:

- Transaksi pembuatan subdomain hanya dapat diproses oleh pemilik dari nama dalam-rantai yang berbagi sufiksnya. Misalnya, hanya pemilik `res_publica.id` yang dapat menyiarkan transaksi pembuatan subdomain untuk nama subdomain yang diakhiri dengan `.res_publica.id`.
- Transaksi transfer subdomain hanya dapat disiarkan oleh pemilik nama dalam-rantai yang membuatnya. Misalnya, pemilik `cicero.res_publica.id` membutuhkan pemilik `res_publica.id` untuk menyiarkan transaksi transfer subdomain untuk mengubah kunci publik dari `cicero.res_publica.id`.
- Untuk mengirim pembuatan subdomain atau transfer subdomain, semua file zona pemilik nama dalam-rantai harus ada di jaringan Atlas. Ini memungkinkan noda BNS membuktikan _tidak adanya_ operasi pembuatan subdomain dan transfer subdomain yang bertentangan saat memproses file zona baru.
- Transaksi pembaruan subdomain dapat disiarkan oleh _setiap_ pemilik nama dalam-rantai, tetapi pemilik subdomain perlu menemukan orang yang mau bekerja sama. Misalnya, pemilik `verified.podcast` dapat menyiarkan transaksi pembaruan subdomain yang dibuat oleh pemilik `cicero.res_publica.id`.

That said, to create a subdomain, the subdomain owner generates a subdomain-creation operation for their desired name and gives it to the on-chain name owner.

Setelah dibuat, pemilik subdomain dapat menggunakan pemilik nama dalam-rantai mana pun untuk menyiarkan operasi pembaruan subdomain. Untuk melakukannya, mereka membuat dan menandatangani operasi subdomain yang diperlukan dan memberikannya kepada pemilik nama dalam-rantai, yang kemudian mengemasnya dengan operasi subdomain lain ke dalam file zona DNS dan menyiarkannya ke jaringan.

Jika pemilik subdomain ingin mengubah alamat subdomainnya, mereka harus menandatangani operasi transfer subdomain dan memberikannya kepada pemilik nama dalam-rantai yang membuat subdomain. Mereka kemudian mengemasnya ke dalam file zona dan menyiarkannya.

### Pendaftar Subdomain

Karena nama subdomain murah, pengembang mungkin cenderung menjalankan pendaftar subdomain atas nama aplikasi mereka. Misalnya, nama `personal.id` digunakan untuk mendaftarkan nama pengguna tanpa mengharuskan mereka membelanjakan Bitcoin apa pun.

Kami menyediakan implementasi referensi [Pendaftar Subdomain BNS](https://github.com/stacks-network/subdomain-registrar) untuk membantu pengembang menyiarkan operasi subdomain. Pengguna akan tetap memiliki nama subdomain mereka; pendaftar hanya memberi pengembang cara yang nyaman bagi mereka untuk mendaftar dan mengelolanya dalam konteks aplikasi tertentu.

# Standar BNS dan DID

BNS names are compliant with the emerging [Decentralized Identity Foundation](http://identity.foundation) protocol specification for decentralized identifiers (DIDs).

Setiap nama di BNS memiliki DID yang terkait. Format DID untuk BNS adalah:

```bash
    did:stack:v0:{address}-{index}
```

Di mana:

- `{address}` adalah hash kunci publik dalam-rantai (misalnya alamat Bitcoin).
- `{index}` mengacu pada nama `nth` yang dibuat oleh alamat tersebut.

For example, the DID for `personal.id` is `did:stack:v0:1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV-0`, because the name `personal.id` was the first-ever name created by `1dARRtzHPAFRNE7Yup2Md9w18XEQAtLiV`.

Contoh lainnya, DID untuk `jude.id` adalah `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-1`. Di sini, alamat `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` telah membuat satu nama sebelumnya dalam riwayat sebelum nama ini (yang kebetulan adalah `abcdefgh123456.id`).

Tujuan DID adalah untuk memberikan pengidentifikasi tak terbatas untuk kunci publik. Kunci publik dapat berubah, namun DID tidak.

Blockchain Stacks mengimplementasikan metode DID agar kompatibel dengan sistem lain yang menggunakan DID untuk resolusi kunci publik. Agar DID dapat diselesaikan, semua hal berikut harus benar dalam penamaan:

- Nama harus ada
- Hash file zona nama harus hash dari file zona DNS yang terbentuk dengan baik
- File zona DNS harus ada pada data noda Stacks.
- File zona DNS harus berisi catatan sumber daya `URI` yang mengarah ke JSON Web Token yang ditandatangani
- Kunci publik yang menandatangani Token Web JSON (dan disertakan dengannya) harus di-hash ke alamat yang memiliki nama tersebut

Tidak semua nama akan memiliki DID yang menjadi kunci publik. Namun, nama yang dibuat oleh alat standar akan memiliki DID yang melakukannya.

API RESTful sedang dalam pengembangan.

## Pengkodean DID untuk Subdomain

Setiap nama dan subdomain di BNS memiliki DID. Pengkodean sedikit berbeda untuk subdomain, sehingga perangkat lunak dapat menentukan jalur kode mana yang harus diambil.

- Untuk nama BNS dalam-rantai, `{address}` sama dengan alamat Bitcoin yang memiliki nama tersebut. Saat ini, alamat versi byte 0 dan versi byte 5 didukung (yaitu, alamat yang dimulai dengan `1` atau `3`, yang artinya `p2pkh` dan alamat `p2sh`).

- Untuk subdomain BNS luar-rantai, `{address}` memiliki versi byte 63 untuk subdomain yang dimiliki oleh satu kunci privat, dan versi byte 50 untuk subdomain yang dimiliki oleh sekumpulan m-of-n dari kunci privat. Artinya, alamat DID subdomain masing-masing dimulai dengan `S` atau `M`.

Bidang `{index}` untuk DID subdomain berbeda dari bidang `{index}` untuk DID nama BNS, meskipun nama dan subdomain dibuat sama. Misalnya, nama `abcdefgh123456.id` memiliki DID `did:stack:v0:16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg-0`, karena itu adalah nama depan yang dibuat oleh `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg`. Namun, `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` _juga_ membuat `jude.statism.id` sebagai nama subdomain pertamanya. DID untuk `jude.statism.id` adalah `did:stack:v0:SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i-0`. Perhatikan bahwa alamat `SSXMcDiCZ7yFSQSUj7mWzmDcdwYhq97p2i` mengkodekan hash kunci publik yang sama dengan alamat `16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg` (satu-satunya perbedaan antara dua string ini adalah yang pertama dikodekan base58check dengan versi byte 0, dan yang kedua dikodekan dengan versi byte 63).

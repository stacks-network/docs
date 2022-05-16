---
title: Cara berkontribusi
description: Mempelajari bagaimana situs ini dibuat, dan bagaimana Anda dapat berkontribusi di dalamnya.
icon: BlockstackIcon
images:
  large: /images/contribute.svg
  sm: /images/contribute.svg
---

## Pengantar

Selamat datang. Terima kasih atas minat Anda yang ingin berkontribusi dan membantu membuat dokumen ini menjadi lebih baik. Halaman ini menguraikan bagaimana situs ini dibuat, struktur umumnya, menjalankannya secara lokal, dan beberapa tips bermanfaat untuk menggunakan semua fiturnya.

Langkah-langkah ini hanya boleh diikuti untuk membuat perubahan pada struktur umum dari situs dan dokumen yang ditulis dalam bahasa Inggris. **Untuk membuat perubahan dalam bahasa lain**, lihat [terjemahan](/contribute/translations). Pada folder /src/pages/ Anda harus membuat perubahan di /src/pages/en, karena perubahan di lokal lain (misalnya /src/pages/es atau /src/pages/fr) akan ditimpa.

## Next.js, MDX, Markdown

Situs dokumen ini dibuat dengan [Next.js](https://github.com/vercel/next.js) dan menggunakan sesuatu yang disebut [MDX](https://mdxjs.com/). Next.js adalah kerangka kerja yang dibangun di atas React, dan MDX adalah alat yang memungkinkan penulisan kode React (JSX) dalam file Markdown standar. Selain dapat menulis JSX di Markdown, ini memungkinkan aplikasi untuk merender semua konten Markdown dengan komponen React. Ini berarti bahwa kita dapat melakukan beberapa hal yang cukup rumit sementara kontributor hanya perlu tahu cara menulis Markdown.

-> **Tidak tahu apa itu Markdown?** Berikut adalah [panduan bermanfaat ](https://guides.github.com/features/mastering-markdown/) untuk mempelajarinya.

## Memulai

Untuk memulai Anda memiliki dua pilihan:

1. menggunakan web IDE Gitpod di browser Anda.
2. bekerja secara lokal.

### Bekerja di browser

Web IDE Gitpod menyediakan tempat untuk berkontribusi langsung dari browser Anda.

Untuk memulai, Anda hanya perlu memiliki akun github dan membuka tautan [https://gitpod.io/#https://github.com/stacks-network/docs](https://gitpod.io/#https://github.com/stacks-network/docs) di browser Anda.

### Bekerja secara Lokal

Saat bekerja secara lokal dengan situs, beberapa hal di bawah ini diperlukan:

- Familier dengan `git`, GitHub, dan baris perintah. [Baca selengkapnya di sini.](https://docs.github.com/en/github/getting-started-with-github/quickstart)
- [`node` + `npm`,](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) dan [`yarn` terpasang](https://yarnpkg.com/getting-started/install) di mesin Anda.
- Beberapa jenis editor kode, seperti VSCode, Sublime, atau WebStorm.

-> Proyek ini membutuhkan setidaknya Noda versi 12

### Bekerja dengan GitHub

Semua kode untuk situs ini adalah open source, terletak di [repositori GitHub di sini](https://github.com/stacks-network/docs). Sebelum Anda mulai mengedit apa pun, Anda perlu melakukan pencabangan repo sehingga Anda dapat memiliki salinan kode sendiri di bawah profil GitHub Anda. Pada [halaman repositori](https://github.com/stacks-network/docs), Anda seharusnya dapat melihat tombol di kanan atas layar yang bertuliskan "Fork." [Anda dapat membaca tentang Forking di sini.](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)

Ini adalah alur kerja umum untuk berkontribusi pada dokumen ini:

- Kloning fork Anda ke mesin lokal Anda dengan perintah ini `git clone git@github.com:<YOUR_USERNAME>/docs.git stacks_docs`
- Masukkan folder proyek Anda `cd stacks_docs`
- Buat cabang `git checkout -b feat/my-feature-branch`.
- Jalankan perintah `yarn` untuk menginstal semua dependensi.
- Buat perubahan yang Anda inginkan, lalu lakukan dengan pesan seperti ini: `git commit -am "feat: some new feature or content"`.
- Dorong ke GitHub dengan `git push --set-upstream origin feature/my-feature-branch`.
- Kunjungi GitHub dan buat permintaan tarik Anda.

### Menjalankan situs secara lokal

Setelah Anda memiliki proyek di komputer Anda dan dependensi telah diinstal melalui perintah `yarn`, Anda dapat menjalankan `yarn dev` dan akan ada pesan seperti di bawah ini:

```bash
yarn dev
```

```bash
yarn run v1.22.17
$ yarn clean:build-files && next dev
$ rimraf .next && rimraf .cache
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
warn  - You have enabled experimental feature(s).
warn  - Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use them at your own risk.

info  - Disabled SWC as replacement for Babel because of custom Babel configuration "babel.config.js" https://nextjs.org/docs/messages/swc-disabled
info  - automatically enabled Fast Refresh for 1 custom loader
info  - Using external babel configuration from /home/alejandro/stacks-network_docs/babel.config.js
event - compiled client and server successfully in 13.5s (680 modules)
```

Situs dokumen akan dapat diakses di url ini: [`http://localhost:3000`](http://localhost:3000).

## Struktur proyek

### Halaman

Jika Anda hanya tertarik untuk menambahkan konten dokumentasi baru ke situs, file yang penting bagi Anda berada di `./src/pages/*`:

```bash showLineNumbers highlight=11
stacks_docs/
  .github/
  lib/
  node_modules/
  public/
  src/
    _data/
    _includes/
    common/
    components/
    pages/
  types/
```

Perutean untuk situs ini berbasis file, artinya jika Anda membuat folder di dalam `/pages` bernama `clarity` dan kemudian file bernama `overview.md`, Anda akan dapat menavigasi ke `http://localhost:3000/clarity/overview` dan Anda akan melihat konten apa pun yang ada di file markdown tersebut.

### Frontmatter

Frontmatter adalah bagian atas dari dokumen markdown yang ditulis dalam bahasa yang disebut [YAML](https://yaml.org/). Bisa terlihat seperti ini:

```yaml
---
title: This is my page title
description: A short, concise sentence describing what is on this page
---
```

Frontmatter memberi kita kemampuan untuk mendefinisikan beberapa hal dalam halaman yang dapat digunakan situs, seperti judul halaman atau deskripsi halaman. Saat menambahkan halaman baru, silakan sertakan `title` dan `description`.

-> **Tahukah Anda?** Istilah _Frontmatter_ berasal dari bagian awal sebuah buku yang merinci hal-hal seperti: nama dan alamat penerbit, informasi hak cipta, daftar isi, dll.

### Sidebar dinamis

Navigasi sidebar dibuat dengan cara yang sebagian dinamis. Aplikasi mencari melalui daftar jalur dan memparsing markdown untuk mendapatkan beberapa informasi tentang halaman, seperti judul dan heading yang terdapat di dalam halaman.

#### Menambahkan rute baru

Jika Anda menambahkan rute baru, Anda harus menambahkan rute Anda ke bagian yang ada di dalam file ini: `src/common/navigation.yaml`

```bash showLineNumbers highlight=11
sections:
  - pages:
      - path: /
      - path: /understand-stacks
        pages:
          - path: /overview
          - path: /testnet
          - path: /proof-of-transfer
          - path: /mining
          - path: /accounts
          - path: /transactions
          - path: /network
          - path: /stacking
          - path: /command-line-interface
          - path: /local-development
          - path: /technical-specs
          - path: /stacks-blockchain-api
        sections:
          - title: Tutorials
            pages:
              - path: /managing-accounts
              - path: /sending-tokens
              - path: /running-testnet-node
              - path: /integrate-stacking
              - path: /stacking-using-CLI
```

Menambahkan rute baru perlu menambahkan `path` baru.

Skrip akan memproses file tersebut dan mengeluarkan judul dari frontmatter dokumen.

### Halaman non-standar

Ada beberapa halaman dalam dokumen ini yang merupakan halaman markdown non-standar. Ini berarti mereka menggunakan beberapa jenis data eksternal sebagai sumbernya, seperti [Halaman Referensi Clarity](/write-smart-contracts/language-overview), atau [Halaman CLI Stacks](https://docs.hiro.so/references/stacks-cli). Halaman ini menggunakan fungsi Next.js yang disebut [ `getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) yang memungkinkan kita untuk mengambil data eksternal saat runtime dan menggunakannya dalam beberapa cara di halaman kita.

## Tips dan trik

### Pemeriksaan gaya

Kami menggunakan [panduan gaya dokumentasi Pengembang Google](https://developers.google.com/style/) dalam proyek ini. Pastikan untuk menginstal [vale](https://github.com/errata-ai/vale) dan menjalankan pemeriksaan gaya sebelum Anda membuat PR:

```bash
yarn check:style
```

### Gunakan Commit Konvensional

Kami menggunakan [Commit Konvensional](https://www.conventionalcommits.org/en/v1.0.0/) sebagai konvensi penamaan commit. Silakan gunakan sambil berkontribusi.

### Selalu gunakan Markdown jika memungkinkan

Memungkinkan untuk menulis HTML standar saat menulis dalam markdown, tetapi harus dihindari dengan cara apa pun. Kami menggunakan `remark` untuk memproses semua Markdown, ini akan memberi kami hal-hal seperti membuka semua tautan eksternal secara otomatis di jendela baru, dan menambahkan ID ke header. Ketika kami menulis sesuatu dalam HTML, seperti tautan atau gambar, kami tidak mendapatkan manfaat dari plugin remark secara konsisten seperti yang kami lakukan jika kami menggunakan Markdown standar.

### Blok kode

Situs ini menggunakan `react-prisma-renderer` dan `prismjs` untuk menambahkan penggarisbawahan sintaks ke semua kode. Anda dapat melihat daftar lengkap [bahasa yang didukung di sini](https://github.com/PrismJS/prism/tree/master/components). Kami memiliki definisi bahasa khusus untuk `clarity`, bahasa kontrak cerdas kami terletak di sini. Untuk menambahkan bahasa baru, lihat file ini: [`components/codeblock/index.tsx`](#).

Untuk menulis blok kode, Anda perlu mengemas kode Anda dalam ` ```bahasa `, dan mengakhiri blok kode Anda dengan ` ``` `. Berikut adalah contoh ` ```clarity `.

```clarity
(define-data-var counter int 0)

(define-public (get-counter)
 (ok (var-get counter)))
```

#### Penggarisbawahan garis

Anda dapat meneruskan beberapa data tambahan untuk memberi tahu komponen agar menggarisbawahi baris tertentu:

` ```clarity highlight=1,4-6,13-17,28-32 `

Yang akan membuat:

```clarity highlight=1,4-6,13-17,28-32
(define-constant sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(define-constant recipient 'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G)

(define-fungible-token novel-token-19)
(begin (ft-mint? novel-token-19 u12 sender))
(begin (ft-transfer? novel-token-19 u2 sender recipient))

(define-non-fungible-token hello-nft uint)
(begin (nft-mint? hello-nft u1 sender))
(begin (nft-mint? hello-nft u2 sender))
(begin (nft-transfer? hello-nft u1 sender recipient))

(define-public (test-emit-event)
    (begin
        (print "Event. Hello world")
        (ok u1)))
(begin (test-emit-event))

(define-public (test-event-types)
    (begin
        (unwrap-panic (ft-mint? novel-token-19 u3 recipient))
        (unwrap-panic (nft-mint? hello-nft u2 recipient))
        (unwrap-panic (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR))
        (unwrap-panic (stx-burn? u20 tx-sender))
        (ok u1)))

(define-map store ((key (buff 32))) ((value (buff 32))))
(define-public (get-value (key (buff 32)))
    (begin
        (match (map-get? store ((key key)))
            entry (ok (get value entry))
            (err 0))))
(define-public (set-value (key (buff 32)) (value (buff 32)))
    (begin
        (map-set store ((key key)) ((value value)))
        (ok u1)))
```

### Peringatan

Kami menggunakan plugin remark lain untuk menghasilkan beberapa jenis peringatan sebaris dalam dokumentasi kami.

```md
> Ini adalah blockquote standar (non-peringatan).

-> Ini adalah peringatan untuk catatan standar.

=> Ini adalah peringatan untuk sukses.

~> Ini adalah peringatan untuk waspada

!> Ini adalah peringatan untuk bahaya
```

Yang membuat:

> Ini adalah blockquote standar (non-peringatan).

-> Ini adalah peringatan untuk catatan standar.

=> Ini adalah peringatan untuk sukses.

~> Ini adalah peringatan untuk waspada

!> Ini adalah peringatan untuk bahaya

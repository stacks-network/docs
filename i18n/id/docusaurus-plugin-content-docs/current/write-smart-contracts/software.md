---
title: Perangkat lunak pengembangan Clarity
description: Alat berikut berguna saat mengembangkan kontrak pintar Clarity
sidebar_position: 4
---

## Language Server Protocol untuk Clarity (termasuk ekstensi Kode Visual Studio)

Language Server Protocol (LSP) mendefinisikan protokol yang digunakan antara editor atau IDE dan server bahasa yang menyediakan fitur bahasa seperti pelengkapan otomatis, masuk ke definisi, menemukan semua referensi, dll.

Ini membuat pemrograman di Clarity lebih mudah dan lebih intuitif.

![Tangkapan Layar Clarity LSP](https://github.com/hirosystems/clarity-lsp/raw/HEAD/doc/images/screenshot.png?raw=true)

Repositori Clarity LSP tersedia [di sini](https://github.com/hirosystems/clarity-lsp). Ekstensi untuk Visual Studio Code dapat diunduh langsung dari [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp), tetapi mungkin untuk versi lebih lama. Untuk versi yang lebih terbaru, Anda juga dapat mengunduhnya dari [open-vsx](https://open-vsx.org/extension/hirosystems/clarity-lsp).

## Clarity REPL

Read—eval—print loop (REPL), juga disebut sebagai tingkat atas interaktif atau bahasa shell, adalah sederhana, lingkungan pemrograman komputer interaktif yang mengambil input pengguna tunggal (yaitu, ekspresi tunggal), mengevaluasi (mengeksekusi) mereka, dan mengembalikan hasil untuk pengguna; sebuah program yang ditulis dalam lingkungan REPL dijalankan secara sepotong demi sepotong.

![Clarity-repl](https://github.com/hirosystems/clarity-repl/blob/develop/docs/images/screenshot.png?raw=true)

Petunjuk tentang cara menginstal Clarity REPL dapat ditemukan [di sini](https://github.com/hirosystems/clarity-repl).

## Clarinet

Clarinet adalah runtime Clarity yang dikemas sebagai alat baris perintah, yang dirancang untuk memfasilitasi pemahaman, pengembangan, pengujian, dan penerapan kontrak cerdas. Clarinet terdiri dari Clarity REPL dan rangkaian pengujian, yang bila digunakan bersama-sama memungkinkan Anda bisa mengembangkan dan menguji kontrak pintar Clarity dengan cepat, dengan kebutuhan untuk menyebarkan kontrak ke devnet atau testnet lokal.

![Clarinet](https://github.com/hirosystems/clarinet/blob/develop/docs/images/demo.gif?raw=true)

Petunjuk penginstalan, termasuk petunjuk build dari sumber dapat ditemukan [di sini](https://github.com/hirosystems/clarinet). Jika mau, Anda dapat langsung mengunduh realease terkompilasi terbaru untuk Windows, Mac, dan Linux [di sini](https://github.com/hirosystems/clarinet/releases).

[Clarinet 101](https://www.youtube.com/playlist?list=PL5Ujm489LoJaAz9kUJm8lYUWdGJ2AnQTb) berisi beberapa video tutorial Clarinet

### Memulai dengan Clarinet

Anda dapat memverifikasi bahwa Anda telah menginstal Clarinet dengan memeriksa versinya:

```bash
$ clarinet --version
clarinet 0.70
```

Informasi lebih lanjut tentang penggunaan Clarinet tersedia [di sini](https://book.clarity-lang.org/ch07-00-using-clarinet.html). Namun untuk memulai, perintah berikut penting untuk diketahui.

Buat proyek baru dan masukkan direktorinya:

```bash
clarinet new my-project && cd my-project
```

Buat kontrak baru di dalam `my-project`:

```bash
clarinet contract new mycoolcontract
```

Periksa sintaks Clarity:

```bash
clarity check
```

Untuk menguji kontrak Anda:

```bash
clarinet test
```

Masuk ke konsol Clarinet:

```bash
clarinet console
```

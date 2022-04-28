---
title: Tipe
description: Lihat daftar rinci semua tipe untuk bahasa Clarity.
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Sistem Tipe Clarity

Sistem tipe ini berisi:

- `{label-0: value-type-0, label-1: value-type-1, ...}` - suatu grup dari nilai data dengan field yang bernama, aka [_catatan_](https://www.cs.cornell.edu/courses/cs312/2004fa/lectures/lecture3.htm).
- `(list max-len entry-type)` - daftar panjang maksimum `max-len`, dengan entri bertipe `entry-type`
- `(respons ok-type err-type)` - objek yang digunakan oleh fungsi publik untuk melakukan perubahan atau pembatalan. Dapat dikembalikan atau digunakan oleh fungsi lain juga, namun, hanya fungsi publik yang memiliki perilaku komit/batalkan.
- `(optional some-type)` - tipe opsi untuk objek dapat berupa `(some value)` atau `none`
- `(buff max-len)` := buffer byte dengan panjang maksimum `max-len`.
- `(string-ascii max-len)` := String ASCII dengan panjang maksimum `max-len`
- `(string-utf8 max-len)` := UTF-8 string dengan panjang maksimum `max-len` (u"A smiley face emoji \u{1F600} sebagai string utf8 ")
- `principal` := objek yang mewakili prinsipal (apakah prinsipal kontrak atau prinsipal standar).
- `bool` := nilai boolean (`true` atau `false`)
- `int` := bilangan bulat 128-bit yang ditandatangani
- `uint` := bilangan bulat 128-bit yang tidak ditandatangani

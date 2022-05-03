---
title: Kontrak BNS
description: Lihat daftar rinci semua fungsi dan kode kesalahan kontrak BNS.
---

export { convertBNSRefToMdx as getStaticProps } from '@common/data/bns-ref';
import { BNSErrorcodeReference, BNSFunctionReference } from '@components/bns-ref';

## Pengantar

[Sistem Penamaan Blockchain (BNS)](/build-apps/references/bns) diimplementasikan sebagai kontrak pintar menggunakan Clarity.

Di bawah ini adalah daftar dari fungsi publik dan read-only serta kode kesalahan yang dapat dikembalikan oleh metode tersebut.

## Fungsi publik

<BNSFunctionReference {...props.mdx.publicFunctions} />

## Fungsi read-only

<BNSFunctionReference {...props.mdx.readonlyFunctions} />

## Kode kesalahan

<BNSErrorcodeReference {...props.mdx.errorCodes} />

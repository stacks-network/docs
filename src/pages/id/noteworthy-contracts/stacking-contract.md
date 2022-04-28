---
title: Kontrak Stacking
description: Lihat daftar rinci semua fungsi dan kode kesalahan kontrak Stacking.
---

export { convertStackingRefToMdx as getStaticProps } from '@common/data/stacking-ref';
import { StackingErrorcodeReference, StackingFunctionReference } from '@components/stacking-ref';

## Pengantar

Stacking diimplementasikan sebagai kontrak pintar menggunakan Clarity. Anda selalu dapat menemukan pengidentifikasi kontrak Stacking menggunakan [`v2/pox` endpoint](https://docs.hiro.so/api#operation/get_pox_info) Blockchain Stacks API.

Di bawah ini adalah daftar dari fungsi publik dan read-only serta kode kesalahan yang dapat dikembalikan oleh metode tersebut.

## Fungsi publik

<StackingFunctionReference {...props.mdx.publicFunctions} />

## Fungsi read-only

<StackingFunctionReference {...props.mdx.readonlyFunctions} />

## Kode kesalahan

<StackingErrorcodeReference {...props.mdx.errorCodes} />

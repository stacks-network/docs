---
title: Fungsi
description: Lihat daftar rinci semua fungsi untuk bahasa Clarity.
images:
  large: /images/contract.svg
  sm: /images/contract.svg
---

export { convertClarityRefToMdx as getStaticProps } from '@common/data/clarity-ref';
import { ClarityFunctionReference } from '@components/clarity-ref';

## Referensi fungsi

<ClarityFunctionReference {...props.mdx.functions} />

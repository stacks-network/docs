---
title: Glosarium
description: Daftar lengkap istilah yang digunakan dalam ekosistem.
images:
  large: /images/cli.svg
  sm: /images/cli.svg
---

export { convertGlossaryToJson as getStaticProps } from '@common/data/glossary'; import { Glossary } from '@components/glossary';

<Glossary data={props.glossary} />

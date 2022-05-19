---
title: Glossary
description: A comprehensive list of terms used within the ecosystem.
images:
  large: /images/cli.svg
  sm: /images/cli.svg
---

export { convertGlossaryToJson as getStaticProps } from '@common/data/glossary';
import { Glossary } from '@components/glossary';

<Glossary data={props.glossary} />

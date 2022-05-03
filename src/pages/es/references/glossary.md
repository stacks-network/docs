---
title: Glosario
description: Una lista de términos comunmente utilizados en el ecosistema.
images:
  large: /images/cli.svg
  sm: /images/cli.svg
---

export { convertGlossaryToJson as getStaticProps } from '@common/data/glossary'; import { Glossary } from '@components/glossary';

<Glossary data={props.glossary} />

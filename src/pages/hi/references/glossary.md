---
title: Glossary
description: A comprehensive list of terms used within the ecosystem.
---

export { convertGlossaryToJson as getStaticProps } from '@common/data/glossary' import { Glossary } from '@components/glossary'

<Glossary data={props.glossary} />

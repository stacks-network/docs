---
description: Blockstack DApp technical FAQs
---

export { convertFaqAnswersToMDX as getStaticProps } from '@common/data/faq'
import { FAQs } from '@components/faq'

# DApp Developer FAQs

This document lists frequently-asked questions developers about Blockstack application development. If you are new to Blockstack, you should read the [general questions](/faqs/allFAQs) first.

For more technical FAQs about Stacks nodes, the Stacks blockchain, and other architectural elements, see the [entire set of technical FAQs](/core/faq_technical).

If you have a technical question that gets frequently asked on the
[forum](https://forum.blockstack.org) or [Slack](https://blockstack.slack.com),
feel free to send a pull-request with the question and answer.

<FAQs category="appdevs" data={props.mdx} />

<FAQs category="opensource" data={props.mdx} />

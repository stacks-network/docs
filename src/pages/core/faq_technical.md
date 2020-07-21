export { convertFaqAnswersToMDX as getStaticProps } from '@common/data/faq'
import { FAQs } from '@components/faq'

# Technical FAQ

This document lists frequently-asked questions by developers interested in working with Blockstack application and core components. If you are new to Blockstack, you should read the [general questions](/faqs/allFAQs) first.

If you have a technical question that gets frequently asked on the
[forum](https://forum.blockstack.org) or [Slack](https://blockstack.slack.com),
feel free to send a pull-request with the question and answer.

## DApp developers

<FAQs category="appdevs" data={props.mdx} />

## Core developers

<FAQs category="coredevs" data={props.mdx} />

## Open source developers

<FAQs category="opensource" data={props.mdx} />

## Miscellaneous questions

<FAQs category="miscquest" data={props.mdx} />

---
description: 'Blockstack Network documentation'
---

export { convertFaqAnswersToMDX as getStaticProps } from '@common/mdx'
import { FAQs } from '@components/faq'

# FAQs about Stacks tokens and wallet

## Stacks tokens

<FAQs category="tokens" data={props.mdx} />

## Stacks Wallet

<FAQs category="wallet" data={props.mdx} />

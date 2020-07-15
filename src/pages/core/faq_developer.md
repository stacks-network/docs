---
description: Blockstack DApp technical FAQs
---

# DApp Developer FAQs

This document lists frequently-asked questions developers about Blockstack application development. If you are new to Blockstack, you should read the [general questions](/faqs/allFAQs) first.

For more technical FAQs about Stacks nodes, the Stacks blockchain, and other architectural elements, see the [entire set of technical FAQs](/core/faq_technical).

If you have a technical question that gets frequently asked on the
[forum](https://forum.blockstack.org) or [Slack](https://blockstack.slack.com),
feel free to send a pull-request with the question and answer.

{% for faq in site.data.theFAQs.faqs %}
{% if faq.category == 'dappdevs' %}

### {{ faq.question }}

{{ faq.answer }}
{% endif %}
{% endfor %}

{% for faq in site.data.theFAQs.faqs %}
{% if faq.category == 'opensource' %}

### {{ faq.question }}

{{ faq.answer }}
{% endif %}
{% endfor %}

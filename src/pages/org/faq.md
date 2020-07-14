---
description: 'Blockstack Network documentation'
---

# FAQs about Stacks tokens and wallet

## Stacks tokens

{% for faq in site.data.theFAQs.faqs %}
{% if faq.category == 'tokens' %}

### {{ faq.question }}

{{ faq.answer }}
{% endif %}
{% endfor %}

## Stacks Wallet

{% for faq in site.data.theFAQs.faqs %}
{% if faq.category == 'wallet' %}

### {{ faq.question }}

{{ faq.answer }}
{% endif %}
{% endfor %}

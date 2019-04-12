---
layout: org
permalink: /:collection/:path.html
---
# Frequently asked questions
{:.no_toc}

* TOC
{:toc}

## Stacks Wallet

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'wallet' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}


## Stacks tokens

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'tokens' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}
---
layout: learn
permalink: /:collection/:path.html
---
# DApp Developer FAQs
{:.no_toc}

This document lists frequently-asked questions developers about Blockstack application development. If you are new to Blockstack, you should read the [general questions]({{site.baseurl}}/faqs/allFAQs.html) first.

For more technical questions about Blockstack Core nodes, the Stacks blockchain, and other architectural elements, see the [core developer questions]({{site.baseurl}}/core/faq_technical.html).

If you have a technical question that gets frequently asked on the
[forum](https://forum.blockstack.org) or [Slack](https://blockstack.slack.com),
feel free to send a pull-request with the question and answer.

* TOC
{:toc}


## DApp developers

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'dappdevs' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}


## Open source developers

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'opensource' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

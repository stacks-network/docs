---
layout: core
permalink: /:collection/:path.html
---
# Blockstack Technical FAQ
{:.no_toc}

This document lists frequently-asked questions and answers to technical
questions about Blockstack. If you are new to Blockstack, you should read the
[genera questions](faqs/allFAQs) first.

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


## Core developers

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'coredevs' %}
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

## Miscellaneous questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'miscquest' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

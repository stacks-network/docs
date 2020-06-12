---


---
# Technical FAQ
{:.no_toc}

This document lists frequently-asked questions by developers interested in working with Blockstack application and core components. If you are new to Blockstack, you should read the [general questions]({{site.baseurl}}/faqs/allFAQs.html) first.

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

---
layout: org
description: "Blockstack Network documentation"
permalink: /:collection/:path.html
redirect_from: /org/voucherholder
---
# Blockstack FAQs

This is a comprehensive list of all the Blockstack FAQs.

* TOC
{:toc}

## General questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'general' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Application user questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appusers' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Stacks Token questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'tokens' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Stacks Wallet questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'wallet' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## DApp developers questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'dappdevs' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Application Miner questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appminers' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Core developer questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'coredevs' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Open source developer questions

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

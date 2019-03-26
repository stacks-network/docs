---
layout: org
permalink: /:collection/:path.html
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

## Application users

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appusers' %}
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


## Stacks tokens

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'tokens' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## DApp developers

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'dappdevs' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

## Application Miners

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appminers' %}
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

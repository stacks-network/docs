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
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Application user questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appusers' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Stacks Token questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'tokens' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Stacks Wallet questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'wallet' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## DApp developers questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'dappdevs' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Application Miner questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appminers' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Core developer questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'coredevs' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Open source developer questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'opensource' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Miscellaneous questions

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'miscquest' %}
### {{ faq.question }}
<div class="faq-answer">
{{ faq.answer }}
</div>
  {% endif %}
{% endfor %}

## Important disclaimer

*The Securities and Exchange Commission (SEC) has qualified the offering statement that we have filed with the SEC under Regulation A for our offering of certain of our Stacks Tokens. The information in that offering statement is more complete than the information we are providing now, and could differ in important ways. You must read the documents filed with the SEC before investing. The offering is being made only by means of its offering statement. This document shall not constitute an offer to sell or the solicitation of an offer to buy, nor shall there be any sale of these securities in any state or jurisdiction in which such offer, solicitation or sale would be unlawful prior to registration or qualification under the securities laws of any such state or jurisdiction.*
  
*An indication of interest involves no obligation or commitment of any kind. Any person interested in investing in any offering of Stacks Tokens should review our disclosures and the publicly filed offering statement and the f<a href='https://stackstoken.com/circular'>final offering circular</a>  that is part of that offering statement. Blockstack is not registered, licensed or supervised as a broker dealer or investment adviser by the SEC, the Financial Industry Regulatory Authority (FINRA) or any other financial regulatory authority or licensed to provide any financial advice or services.*

## Forward-looking statements

*This communication contains forward-looking statements that are based on our beliefs and assumptions and on information currently available to us. In some cases, you can identify forward-looking statements by the following words: “will,” “expect,” “would,” “intend,” “believe,” or other comparable terminology. Forward-looking statements in this document include, but are not limited to, statements about our plans for developing the platform and future utility for the Stacks Token, our Clarity smart contracting language, and potential mining operations. These statements involve risks, uncertainties, assumptions and other factors that may cause actual results or performance to be materially different. More information on the factors, risks and uncertainties that could cause or contribute to such differences is included in our filings with the SEC, including in the “Risk Factors” and “Management’s Discussion & Analysis” sections of our offering statement on Form 1-A. We cannot assure you that the forward-looking statements will prove to be accurate. These forward-looking statements speak only as of the date hereof. We disclaim any obligation to update these forward-looking statements.*

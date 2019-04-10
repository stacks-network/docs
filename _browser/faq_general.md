---
layout: usenew
permalink: /:collection/:path.html
---
# Users Frequently Asked Questions (FAQ)
{:.no_toc}

This is a FAQ intended for users of decentralized applications. A comprehensive list of FAQs that touch on general, technical, and App Mining questions is [also available]({{site.baseurl}}/faqs/allFAQS.html).

* TOC
{:toc}

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appusers' %}
### {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

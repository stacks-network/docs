---
layout: learn
permalink: /:collection/:path.html
---
# App Mining FAQ

* TOC
{:toc}

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appminers' %}
## {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

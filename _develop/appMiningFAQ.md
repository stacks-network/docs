---
layout: learn
permalink: /:collection/:path.html
---
# App Mining FAQ

* TOC
{:toc}


{% for faq in site.data.appFAQ.faqs %}
## {{ faq.question }}
  {{ faq.answer }}
{% endfor %}

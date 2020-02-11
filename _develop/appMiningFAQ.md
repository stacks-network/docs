---
layout: learn
description: Blockstack app mining documentation
permalink: /:collection/:path.html
---
# App Mining FAQ

**This is outdated documentation for the app mining program. App Mining Has Been Paused. 
Thank you to the hundreds of you that participated and congratulations to our winners.**
[More info](https://blog.blockstack.org/the-next-phase-of-app-mining/) & [all apps →](https://app.co/blockstack)



* TOC
{:toc}

{% for faq in site.data.theFAQs.faqs %}
   {% if faq.category == 'appminers' %}
## {{ faq.question }}
{{ faq.answer }}
  {% endif %}
{% endfor %}

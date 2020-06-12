---
layout: learn
permalink: /:collection/:path.html
---
# Community Resources

You can use these community resources to learn more. To add your own resources,
please make a pull request or send us an issue on Github. We are happy to add
other resources.

<table class="uk-table">
<thead>
<tr>
  <th>Resource Links</th>
  <th class="uk-width-1-4">Date</th>
</tr>
</thead>
{% for resource in site.data.community.resources %}
  <tr>
    <td><p><a href="{{ resource.url }}" target="\_blank">{{ resource.title }}</a> {{resource.description}} (<em>{{resource.type}}</em>)</p></td>
    <td>{{resource.date}}</td>
  </tr>
{% endfor %}
</table>

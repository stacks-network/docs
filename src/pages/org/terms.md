---
description: 'Blockstack Network documentation'
---

export { convertGlossaryToJson as getStaticProps } from '@common/glossary'
import { Glossary } from '@components/glossary'

# Glossary

<Glossary data={props.glossary} />

<!-- <table class="uk-table uk-table-large uk-table-striped"> -->
<!-- {% for member in site.data.glossary %} -->
<!-- <tr> -->
<!--     <th>{{ member.Term }}</th> -->
<!--     <td>{{ member.Definition }}</td> -->
<!-- </tr> -->
<!-- {% endfor %} -->
<!-- </table> -->

import { renderMdx } from '@common/data/mdx';
import CLARITY_REFERENCE from '../../_data/clarity-reference.json';
import { slugify } from '@common/utils';

const wrapInClarityTicks = (string: string) => {
  let newString = '```clarity';
  newString += `
`;
  newString += string.trim();
  newString += `
`;
  newString += '```';
  return newString;
};

const inlineCode = (string: string) => {
  let newString = '`';
  newString += string.trim();
  newString += '`';
  return newString;
};

const generateMarkdown = () => {
  let keywords = '';
  let functions = '';

  CLARITY_REFERENCE.functions
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(entry => {
      functions += `
### ${entry.name}

**Signature:** ${inlineCode(entry.signature)}


**Input:** ${inlineCode(entry.input_type)}


**Output:** ${inlineCode(entry.output_type)}

${entry.description.trim()}

#### Example {#${slugify(entry.name)}-example}

${wrapInClarityTicks(entry.example)}
`;
    });

  CLARITY_REFERENCE.keywords
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(entry => {
      keywords += `### ${entry.name}

**Output:** ${inlineCode(entry.output_type)}

${entry.description.trim()}

#### Example {#${slugify(entry.name)}-example}

${wrapInClarityTicks(entry.example)}

`;
    });

  return {
    keywords,
    functions,
  };
};

const getHeadings = arr =>
  arr.map(entry => ({
    content: entry.name,
    level: 1,
  }));

export const convertClarityRefToMdx = async () => {
  const markdown = generateMarkdown();
  const [_functions, _keywords] = await Promise.all([
    renderMdx(markdown.functions),
    renderMdx(markdown.keywords),
  ]);

  const functions = {
    content: _functions,
    headings: getHeadings(CLARITY_REFERENCE.functions),
  };

  const keywords = {
    content: _keywords,
    headings: getHeadings(CLARITY_REFERENCE.keywords),
  };

  return {
    props: {
      mdx: {
        functions,
        keywords,
      },
    },
  };
};

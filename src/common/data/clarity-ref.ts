import { renderMdx } from '@common/data/mdx';
import CLARITY_REFERENCE from '../../_data/clarityRef.json';
import { slugify } from '@common/utils';

const wrapInClarityTicks = (string: string) => {
  let newString = '';
  newString += '```clarity\n';
  newString += string.trim() + '\n';
  newString += '```';
  return newString;
};

const inlineCode = (string: string) => {
  let newString = '';
  newString += '`';
  newString += string.trim();
  newString += '`';
  return newString;
};

const generateMarkdown = () => {
  let keywords = '';
  let functions = '';

  CLARITY_REFERENCE.functions.forEach(entry => {
    functions += `### ${entry.name}

**Signature:** ${inlineCode(entry.signature)}\n


**Input:** ${inlineCode(entry.input_type)}\n


**Output:** ${inlineCode(entry.output_type)}\n

${entry.description}

#### Example {#${slugify(entry.name)}-example}

${wrapInClarityTicks(entry.example)}
`;
  });

  CLARITY_REFERENCE.keywords.forEach(entry => {
    keywords += `### ${entry.name}

**Output:** ${inlineCode(entry.output_type)}

${entry.description}

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

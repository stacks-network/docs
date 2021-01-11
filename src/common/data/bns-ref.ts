import { renderMdx } from '@common/data/mdx';
import BNS_REFERENCE from '../../_data/boot-contracts-reference.json';

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

  if (newString === '``') {
    newString = '';
  }

  return newString;
};

const generateMarkdown = () => {
  let publicFunctions = '';
  let readonlyFunctions = '';
  let errorCodes = '';

  BNS_REFERENCE.bns.public_functions.forEach(entry => {
    publicFunctions += `
### ${entry.name}

**Signature:** ${inlineCode(entry.signature)}


**Input:** ${inlineCode(entry.input_type)}


**Output:** ${inlineCode(entry.output_type)}

${entry.description.trim()}
`;
  });

  BNS_REFERENCE.bns.read_only_functions.forEach(entry => {
    readonlyFunctions += `
### ${entry.name}

**Signature:** ${inlineCode(entry.signature)}


**Input:** ${inlineCode(entry.input_type)}


**Output:** ${inlineCode(entry.output_type)}

${entry.description.trim()}
`;
  });

  BNS_REFERENCE.bns.error_codes.forEach(entry => {
    errorCodes += `### ${entry.name}

**Type:** ${inlineCode(entry.type)}

**Value:** ${inlineCode(entry.value)}
`;
  });

  return {
    publicFunctions,
    readonlyFunctions,
    errorCodes,
  };
};

const getHeadings = arr =>
  arr.map(entry => ({
    content: entry.name,
    level: 1,
  }));

export const convertBNSRefToMdx = async () => {
  const markdown = generateMarkdown();
  const [_publicFunctions, _readonlyFunctions, _errorCodes] = await Promise.all([
    renderMdx(markdown.publicFunctions),
    renderMdx(markdown.readonlyFunctions),
    renderMdx(markdown.errorCodes),
  ]);

  const publicFunctions = {
    content: _publicFunctions,
    headings: getHeadings(BNS_REFERENCE.bns.public_functions),
  };

  const readonlyFunctions = {
    content: _readonlyFunctions,
    headings: getHeadings(BNS_REFERENCE.bns.read_only_functions),
  };

  const errorCodes = {
    content: _errorCodes,
    headings: getHeadings(BNS_REFERENCE.bns.error_codes),
  };

  return {
    props: {
      mdx: {
        publicFunctions,
        readonlyFunctions,
        errorCodes,
      },
    },
  };
};

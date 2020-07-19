import React from 'react';
import { MDXComponents } from '@components/mdx/mdx-components';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { remarkPlugins, wrapValueInTicks } from '@common/mdx';
import clarityRefData from '@common/_data/clarityRef.json';

const wrapInClarityCodes = value => '```clarity' + `\n` + value.trim() + `\n` + '```';

const convertKeywordsToMdx = entry => {
  return `
  ### ${entry.name}
  
  ${wrapValueInTicks(entry.output_type)}
  
  ${entry.description}
  
  #### Example
  
  ${wrapInClarityCodes(entry.example)}

  `;
};

const convertFunctionsToMdx = entry => {
  return `
  ### ${entry.name}
  
  ${wrapInClarityCodes(entry.signature)}
  
  **Input:** ${wrapValueInTicks(entry.input_type)}
  
  **Output:** ${wrapValueInTicks(entry.output_type)}
  
  ${entry.description}
  
  #### Example
  
  ${wrapInClarityCodes(entry.example)}

  `;
};

const makeMdxDocument = (data, converter) => {
  let mdx = ``;
  data.forEach(entry => {
    mdx += converter(entry);
  });
  return mdx;
};

// getStaticProps
export async function convertClarityRefToMdx() {
  const functionsMdx = makeMdxDocument(clarityRefData.functions, convertFunctionsToMdx);
  const keywordsMdx = makeMdxDocument(clarityRefData.keywords, convertKeywordsToMdx);

  const functions = await renderToString(functionsMdx, MDXComponents, {
    remarkPlugins: remarkPlugins('clarity'),
  });
  const keywords = await renderToString(keywordsMdx, MDXComponents, {
    remarkPlugins: remarkPlugins('clarity'),
  });
  return {
    props: {
      reference: {
        functions,
        keywords,
      },
    },
  };
}

export const ClarityKeywordReference = ({ reference }) =>
  hydrate(reference.keywords, MDXComponents);
export const ClarityFunctionReference = ({ reference }) =>
  hydrate(reference.functions, MDXComponents);

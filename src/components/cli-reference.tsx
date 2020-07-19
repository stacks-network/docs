import React from 'react';
import { cliReferenceData } from '@common/_data/cliRef';
import { MDXComponents } from '@components/mdx/mdx-components';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import { remarkPlugins, wrapValueInTicks } from '@common/mdx';

const wrapInCode = value => value && '<inlineCode>' + value + '</inlineCode>';

const makeMdxTableRow = ({ name: _name, type: _type, value: _value, format: _format }) => {
  const name = wrapValueInTicks(_name);
  const type = wrapValueInTicks(_type);
  const value = wrapValueInTicks(_value);
  const format = wrapValueInTicks(_format);

  return `
  ##### Name
  ${wrapValueInTicks(name)}
  
  ##### Type
  ${wrapValueInTicks(type)}  
  
  ##### Value
  ${wrapValueInTicks(value)}
  
  ##### Format
  ${wrapValueInTicks(format)}
  `;
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  // return '  | ' + name + '   | ' + type + ' | ' + value + ' | ' + wrapValueInTicks(format) + '`  |';
};

const convertEntryToMarkdown = entry => {
  return `
  ## ${entry.command}

  **Group:**: ${entry.group}

  ${entry.usage}

  ### Arguments

  | Name         | Type        | Value   | Format  |
  | ------------ | ----------- | ------- | ------- |
  
  ${entry.args.map(makeMdxTableRow)}
  `;
};

const makeMdxDocument = data => {
  let mdx = ``;
  data.forEach(entry => {
    mdx += convertEntryToMarkdown(entry);
  });
  return mdx;
};

export async function convertCliRefToMdx() {
  const mdx = makeMdxDocument(cliReferenceData);
  const reference = await renderToString(mdx, MDXComponents, {
    remarkPlugins: remarkPlugins('bash'),
  });
  return { props: { reference } };
}

export const CLIReferenceTable = ({ reference }) => hydrate(reference, MDXComponents);

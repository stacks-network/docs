import React from 'react';
import { MDXComponents } from '@components/mdx/mdx-components';
import { TableOfContents } from '@components/toc';
import { hydrate } from '@common/hydrate-mdx';

export const ClarityKeywordReference = ({ content, headings }) => {
  return (
    <>
      <TableOfContents label="Contents" headings={headings} />
      {hydrate(content, MDXComponents)}
    </>
  );
};
export const ClarityFunctionReference = ({ content, headings }) => (
  <>
    <TableOfContents columns={[2, 2, 3]} label="Contents" headings={headings} />
    {hydrate(content, MDXComponents)}
  </>
);

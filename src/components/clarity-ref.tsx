import React from 'react';
import { MDXComponents } from '@components/mdx/mdx-components';
import { TableOfContents } from '@components/toc';
import { hydrate } from '@common/data/hydrate-mdx';
import { space } from '@blockstack/ui';

export const ClarityKeywordReference = ({ content, headings }) => {
  return (
    <>
      <TableOfContents mb={space('extra-loose')} label="Contents" headings={headings} />
      {hydrate(content, MDXComponents)}
    </>
  );
};
export const ClarityFunctionReference = ({ content, headings }) => (
  <>
    <TableOfContents
      mb={space('extra-loose')}
      columns={[2, 2, 3]}
      label="Contents"
      headings={headings}
    />
    {hydrate(content, MDXComponents)}
  </>
);

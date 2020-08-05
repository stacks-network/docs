import React from 'react';
import { Components } from '@components/mdx/mdx-components';
import { TableOfContents } from '@components/toc';
import hydrate from 'next-mdx-remote/hydrate';
import { space } from '@blockstack/ui';

export const ClarityKeywordReference = ({ content, headings }) => {
  return (
    <>
      <TableOfContents mb={space('extra-loose')} label="Contents" headings={headings} />
      {hydrate(content, Components)}
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
    {hydrate(content, Components)}
  </>
);

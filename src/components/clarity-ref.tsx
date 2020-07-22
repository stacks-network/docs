import React from 'react';
import { MDXComponents } from '@components/mdx/mdx-components';
import { Box } from '@blockstack/ui';
import { TableOfContents } from '@components/toc';
import { hydrate } from '@common/hydrate-mdx';

const renderFunctionsSection = entry => (
  <>
    <MDXComponents.h3>{entry.name}</MDXComponents.h3>

    <MDXComponents.p>
      <strong>Signature:</strong>{' '}
      <MDXComponents.inlineCode>{entry.signature}</MDXComponents.inlineCode>
    </MDXComponents.p>

    <MDXComponents.p>
      <strong>Input:</strong>{' '}
      <MDXComponents.inlineCode>{entry.input_type}</MDXComponents.inlineCode>
    </MDXComponents.p>

    <MDXComponents.p>
      <strong>Output:</strong>{' '}
      <MDXComponents.inlineCode>{entry.output_type}</MDXComponents.inlineCode>
    </MDXComponents.p>

    {hydrate(entry.description, {
      ...MDXComponents,
      p: (props: any) => (
        <MDXComponents.p
          {...props}
          style={{ display: 'block', wordBreak: 'break-word', hyphens: 'auto' }}
        />
      ),
    })}

    <MDXComponents.h4>Example</MDXComponents.h4>

    {/* @ts-ignore */}
    <MDXComponents.code>{entry.example}</MDXComponents.code>
  </>
);

const renderKeywordsSection = entry => (
  <>
    <MDXComponents.h3>{entry.name}</MDXComponents.h3>

    <MDXComponents.p>
      <strong>Output:</strong>{' '}
      <MDXComponents.inlineCode>{entry.output_type}</MDXComponents.inlineCode>
    </MDXComponents.p>

    {hydrate(entry.description, MDXComponents)}

    <MDXComponents.h4>Example</MDXComponents.h4>

    {/* @ts-ignore */}
    <MDXComponents.code>{entry.example}</MDXComponents.code>
  </>
);

export const ClarityKeywordReference = ({ entries }) => {
  return (
    <>
      <Box>
        <TableOfContents
          label="Contents"
          headings={entries.map(entry => ({
            content: entry.name,
            level: 1,
          }))}
        />
      </Box>
      {entries.map(renderKeywordsSection)}
    </>
  );
};
export const ClarityFunctionReference = ({ entries }) => (
  <>
    <Box>
      <TableOfContents
        columns={[2, 2, 3]}
        label="Contents"
        headings={entries.map(entry => ({
          content: entry.name,
          level: 1,
        }))}
      />
    </Box>
    {entries.map(renderFunctionsSection)}
  </>
);

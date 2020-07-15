import React from 'react';
import clarityRefData from '@common/_data/clarityRef.json';
import MDX from '@mdx-js/runtime';
import { MDXComponents } from '@components/mdx/mdx-components';
import { slugify } from '@common/utils';

export const ClarityKeywordReference = () =>
  clarityRefData.keywords.map((entry, key) => {
    return (
      <React.Fragment key={key}>
        <MDXComponents.h3 id={slugify(entry.name)}>{entry.name}</MDXComponents.h3>
        <MDXComponents.p>
          <MDXComponents.inlineCode>{entry.output_type}</MDXComponents.inlineCode>
        </MDXComponents.p>
        <MDXComponents.p>
          <MDX components={MDXComponents}>{entry.description}</MDX>
        </MDXComponents.p>
        <MDXComponents.h4 id={slugify(entry.name) + '-example'}>Example</MDXComponents.h4>
        <MDXComponents.pre>
          {/* @ts-ignore*/}
          <MDXComponents.code children={entry.example.toString()} />
        </MDXComponents.pre>
      </React.Fragment>
    );
  });
export const ClarityFunctionReference = () =>
  clarityRefData.functions.map((entry, key) => {
    return (
      <React.Fragment key={key}>
        <MDXComponents.h3 id={slugify(entry.name)}>{entry.name}</MDXComponents.h3>
        <MDXComponents.p>
          <MDXComponents.inlineCode>{entry.signature}</MDXComponents.inlineCode>
        </MDXComponents.p>
        <MDXComponents.p>
          <strong>INPUT:</strong>{' '}
          <MDXComponents.inlineCode>{entry.input_type}</MDXComponents.inlineCode>
        </MDXComponents.p>
        <MDXComponents.p>
          <strong>OUTPUT:</strong>{' '}
          <MDXComponents.inlineCode>{entry.output_type}</MDXComponents.inlineCode>
        </MDXComponents.p>
        <MDXComponents.p>
          <MDX components={MDXComponents}>{entry.description}</MDX>
        </MDXComponents.p>
        <MDXComponents.h4 id={slugify(entry.name) + '-example'}>Example</MDXComponents.h4>
        <MDXComponents.pre>
          {/* @ts-ignore*/}
          <MDXComponents.code children={entry.example.toString() as string} />
        </MDXComponents.pre>
      </React.Fragment>
    );
  });

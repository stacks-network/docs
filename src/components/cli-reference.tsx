import React from 'react';
import { cliReferenceData } from '@common/_data/cliRef';
import { Text } from '@components/typography';
import MDX from '@mdx-js/runtime';
import { MDXComponents } from '@components/mdx/mdx-components';
import GithubSlugger from 'github-slugger';

const Item = React.memo(({ entry, index }: any) => {
  const slugger = new GithubSlugger();

  return (
    <React.Fragment key={index}>
      <MDXComponents.h2 id={slugger.slug(entry.command)}>{entry.command}</MDXComponents.h2>
      <MDXComponents.p>
        <Text fontWeight="bold">Group</Text>: {entry.group}
      </MDXComponents.p>
      <MDX components={MDXComponents}>{entry.usage}</MDX>
      <MDXComponents.h3 id={slugger.slug(entry.command + ' Arguments')}>Arguments</MDXComponents.h3>
      <MDXComponents.table>
        <tr>
          <MDXComponents.th>Name</MDXComponents.th>
          <MDXComponents.th>Type</MDXComponents.th>
          <MDXComponents.th>Value</MDXComponents.th>
          <MDXComponents.th>Format</MDXComponents.th>
        </tr>

        {entry.args.map((arg, argKey) => (
          <tr key={argKey}>
            <MDXComponents.td>{arg.name}</MDXComponents.td>
            <MDXComponents.td>{arg.type}</MDXComponents.td>
            <MDXComponents.td>{arg.value}</MDXComponents.td>
            <MDXComponents.td>
              <MDXComponents.inlineCode>{arg.format}</MDXComponents.inlineCode>
            </MDXComponents.td>
          </tr>
        ))}
      </MDXComponents.table>
    </React.Fragment>
  );
});

export const CLIReferenceTable = () =>
  cliReferenceData.map((entry, key) => {
    return <Item entry={entry} index={key} />;
  });

import React from 'react';
import { cliReferenceData } from '@common/_data/cliRef';
import { H2, P } from '@components/mdx/mdx-components';
import { Text } from '@components/typography';
import MDX from '@mdx-js/runtime';
import { MDXComponents } from '@components/mdx/mdx-components';

export const CLIReferenceTable = () => {
  return (
    <>
      {cliReferenceData.map((entry, key) => {
        return (
          <React.Fragment key={key}>
            <H2>{entry.command}</H2>
            <P>
              <Text fontWeight="bold">Group</Text>: {entry.group}
            </P>
            <MDX components={MDXComponents}>{entry.usage}</MDX>
            <MDXComponents.h3>Arguments</MDXComponents.h3>

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
      })}
    </>
  );
};

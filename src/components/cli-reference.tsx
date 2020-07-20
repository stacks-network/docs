import React from 'react';
import { cliReferenceData } from '@common/_data/cliRef';
import { MDXComponents } from '@components/mdx/mdx-components';
import { Grid, Box } from '@blockstack/ui';
import { border } from '@common/utils';
import hydrate from 'next-mdx-remote/hydrate';

const styles = {
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'pre',
};
const InlineCode = props => <MDXComponents.inlineCode {...styles} {...props} />;

const ReferenceEntry = ({ entry, usage }) => (
  <>
    <MDXComponents.h2>{entry.command}</MDXComponents.h2>

    <MDXComponents.p>
      <strong>Group:</strong> {entry.group}
    </MDXComponents.p>

    {hydrate(usage, MDXComponents)}
    <MDXComponents.h3>Arguments</MDXComponents.h3>
    <Grid
      mb="tight"
      pb="base-tight"
      borderBottom={border()}
      gridGap="base"
      gridTemplateColumns="repeat(4, minmax(0,25%))"
    >
      <Box fontSize="14px" fontWeight="bold">
        Name
      </Box>
      <Box fontSize="14px" fontWeight="bold">
        Type
      </Box>
      <Box fontSize="14px" fontWeight="bold">
        Value
      </Box>
      <Box fontSize="14px" fontWeight="bold">
        Format
      </Box>
    </Grid>
    {entry.args.map((arg, index) => {
      const { name, type, value, format } = arg;
      return (
        <Grid
          borderBottom={border()}
          py="tight"
          mb="tight"
          gridGap="base"
          gridTemplateColumns="repeat(4, minmax(0,25%))"
          key={index}
        >
          <Box>
            <InlineCode>${name}</InlineCode>
          </Box>
          <Box>
            <InlineCode>${type}</InlineCode>
          </Box>
          <Box>
            <InlineCode>${value}</InlineCode>
          </Box>
          <Box>
            <InlineCode>${format}</InlineCode>
          </Box>
        </Grid>
      );
    })}
  </>
);

export const CLIReferenceTable = ({ mdx }) =>
  cliReferenceData.map((entry, index) => <ReferenceEntry usage={mdx[index]} entry={entry} />);

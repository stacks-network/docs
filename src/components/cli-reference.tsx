import React from 'react';
import { cliReferenceData } from '@common/../_data/cliRef';
import { Components } from '@components/mdx/mdx-components';
import { Grid, Box, color } from '@blockstack/ui';
import { border } from '@common/utils';
import hydrate from 'next-mdx-remote/hydrate';

const styles = {
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'pre',
};
const InlineCode = props => <Components.inlineCode {...styles} {...props} />;

const ReferenceEntry = ({ entry, usage }) => (
  <>
    <Components.h4>{entry.command}</Components.h4>

    <Components.p>
      <strong>Group:</strong> {entry.group}
    </Components.p>

    {hydrate(usage, {
      ...Components,
      p: (props: any) => (
        <Components.p
          {...props}
          style={{ display: 'block', wordBreak: 'break-word', hyphens: 'auto' }}
        />
      ),
    })}
    <Components.h3>Arguments</Components.h3>
    <Grid
      mb="tight"
      pb="base-tight"
      borderBottom={border()}
      gridGap="base"
      gridTemplateColumns="repeat(4, minmax(0,25%))"
      color={color('text-caption')}
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
          color={color('text-body')}
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

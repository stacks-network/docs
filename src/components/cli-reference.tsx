import React from 'react';
import cliReferenceData from '../_data/cli-reference.json';
import { Components } from '@components/mdx/mdx-components';
import { Grid, Box, color } from '@stacks/ui';
import { border, onlyText, slugify } from '@common/utils';
import hydrate from 'next-mdx-remote/hydrate';

const styles = {
  maxWidth: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'pre',
  display: 'inline-block',
};
const cleanTheChildren = (children: any) => {
  const text = onlyText(children).trim();
  if (text.startsWith('$')) {
    return text.replace('$', '');
  }
  return text;
};
const InlineCode = ({ children, ...rest }: any) => (
  <Components.inlineCode {...styles} {...rest}>
    {cleanTheChildren(children)}
  </Components.inlineCode>
);

const ReferenceEntry = ({ entry, usage }) => (
  <Components.section>
    <Components.h4 id={slugify(entry.command)}>{entry.command}</Components.h4>

    <Components.p>
      <strong>Group:</strong> {entry.group}
    </Components.p>

    {hydrate(usage, {
      components: {
        ...Components,
        p: (props: any) => (
          <Components.p
            {...props}
            style={{ display: 'block', wordBreak: 'break-word', hyphens: 'auto' }}
          />
        ),
      },
    })}
    <Components.h3 id={`${slugify(entry.command)}-arguments`}>Arguments</Components.h3>
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
  </Components.section>
);

export const CLIReferenceTable = ({ mdx }) =>
  cliReferenceData.map((entry, index) => <ReferenceEntry usage={mdx[index]} entry={entry} />);

import React from 'react';
import { Box, Stack, space } from '@blockstack/ui';
import { MDContents } from '@components/mdx/md-contents';
import { H1 } from '@components/mdx';
import Head from 'next/head';
import { Caption, Text } from '@components/typography';
const getTitle = ({ title, headings }) => title || (headings?.length && headings[0].content);

const PageTop = props => {
  return (
    <Box px={space('extra-loose')} mb="64px">
      <H1 mb="0 !important">{getTitle(props)}</H1>
      {props.description ? (
        <Box mt="24px !important">
          <Text>{props.description}</Text>{' '}
        </Box>
      ) : null}

      <Stack isInline spacing={space('base')} mt={space('base')}>
        {props.experience ? <Caption textTransform="capitalize">{props.experience}</Caption> : null}
        {props.duration ? <Caption>{props.duration}</Caption> : null}
      </Stack>
    </Box>
  );
};

export const MDWrapper = ({ frontmatter, dynamicHeadings = [], ...props }) => {
  const { headings, description } = frontmatter;

  return (
    <>
      <Head>
        <title>{getTitle(frontmatter)} | Blockstack</title>
        <meta name="description" content={description} />
      </Head>
      <MDContents
        pageTop={() => <PageTop {...frontmatter} />}
        headings={[...headings, ...dynamicHeadings]}
      >
        {props.children}
      </MDContents>
    </>
  );
};

export default MDWrapper;

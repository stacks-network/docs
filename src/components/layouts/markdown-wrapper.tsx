import React from 'react';
import { Box, Flex, Stack, space } from '@blockstack/ui';
import { MDContents } from '@components/mdx/md-contents';
import { H1 } from '@components/mdx';
import Head from 'next/head';
import { Caption, Text } from '@components/typography';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getTitle } from '@common/utils';
import { css } from '@styled-system/css';
import { getHeadingStyles } from '@components/mdx/typography';
const Search = dynamic(() => import('@components/search'));

const PageTop = props => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  return (
    <Box
      mb={['extra-loose', 'extra-loose', '64px']}
      px={space(['extra-loose', 'extra-loose', 'none', 'none'])}
    >
      <Flex>
        <H1 mb="0 !important">{getTitle(props)}</H1>
        {isHome ? (
          <Box width="100%" maxWidth="208px">
            <Search />
          </Box>
        ) : null}
      </Flex>
      {props.description ? (
        <Box mt="40px !important">
          <Text
            css={css({
              ...getHeadingStyles('h4'),
            })}
          >
            {props.description}
          </Text>{' '}
        </Box>
      ) : null}

      <Stack isInline spacing={space('base')} mt={space('extra-loose')}>
        {props.experience ? <Caption textTransform="capitalize">{props.experience}</Caption> : null}
        {!isHome && props.duration ? <Caption>{props.duration}</Caption> : null}
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

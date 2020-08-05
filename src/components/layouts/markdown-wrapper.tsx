import React from 'react';
import { Box, Flex, Stack, space, BoxProps, color } from '@blockstack/ui';
import { MDContents } from '@components/mdx/md-contents';
import { H1 } from '@components/mdx';
import Head from 'next/head';
import { Text } from '@components/typography';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getTitle } from '@common/utils';
import { css } from '@styled-system/css';
import { getHeadingStyles } from '@components/mdx/typography';
import { ToolsIcon } from '@components/icons/tools';
import { ClockIcon } from '@components/icons/clock';
const Search = dynamic(() => import('@components/search'));

const Experience: React.FC<BoxProps & { level?: 'beginner' | 'intermediate' | 'advanced' }> = ({
  level,
  ...rest
}) => (
  <Flex align="center" {...rest}>
    <Box mr={space('extra-tight')} color={color('text-caption')}>
      <ToolsIcon size="20px" />
    </Box>
    <Text textTransform="capitalize">{level}</Text>
  </Flex>
);
const Duration: React.FC<BoxProps & { value?: string }> = ({ value, ...rest }) => (
  <Flex align="center" {...rest}>
    <Box mr={space('extra-tight')} color={color('text-caption')}>
      <ClockIcon size="20px" />
    </Box>
    <Text>{value}</Text>
  </Flex>
);

const PageTop: React.FC<any> = props => {
  const router = useRouter();
  const isHome = router?.pathname === '/';
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
        {props.experience ? <Experience level={props.experience} /> : null}
        {!isHome && props.duration ? <Duration value={props.duration} /> : null}
      </Stack>
    </Box>
  );
};

const defaultFrontmatter = {
  headings: [],
  description:
    'Blockstack is an open-source and developer-friendly network for building decentralized apps and smart contracts.',
};

export const MDWrapper: React.FC<any> = React.memo(
  ({ frontmatter = defaultFrontmatter, dynamicHeadings = [], ...props }) => {
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
  }
);

export default MDWrapper;

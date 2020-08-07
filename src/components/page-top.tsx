import React from 'react';
import { Box, Flex, Stack, space, BoxProps } from '@blockstack/ui';
import { H1 } from '@components/mdx/index';
import { Text } from '@components/typography';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getTitle } from '@common/utils';
import { css } from '@styled-system/css';
import { getHeadingStyles } from '@components/mdx/typography';
const Search = dynamic(() => import('@components/search'));
import { PageMeta } from '@components/page-meta';

export const PageTop: React.FC<BoxProps> = props => {
  const router = useRouter();
  const isHome = router?.pathname === '/';
  return (
    <Box
      as="section"
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
      <PageMeta duration={props.duration} experience={props.experience} isHome={isHome} />
    </Box>
  );
};

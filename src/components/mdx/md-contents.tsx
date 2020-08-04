import React from 'react';
import { Box, space } from '@blockstack/ui';

import { ContentWrapper } from '../content-wrapper';
import { TableOfContents } from '@components/toc';

import { css } from '@styled-system/css';
import { TOC_WIDTH } from '@common/constants';
import { styleOverwrites } from '@components/mdx/styles';
import { border } from '@common/utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Search = dynamic(() => import('@components/search'));

export const MDContents: React.FC<any> = React.memo(
  ({ pageTop: PageTop = null, headings, children }) => {
    const router = useRouter();
    const isHome = router.pathname === '/';
    return (
      <>
        <ContentWrapper
          pl={space(['none', 'none', 'extra-loose', 'extra-loose'])}
          pr={
            isHome ? ['0px', '0px', 'base-loose'] : space(['0', '0', 'extra-loose', 'extra-loose'])
          }
          width={['100%', '100%', '100%', `calc(100% - ${isHome ? 0 : TOC_WIDTH + 20}px)`]}
          mx="unset"
          pt="unset"
          css={css(styleOverwrites as any)}
        >
          {PageTop && <PageTop />}
          {children}
        </ContentWrapper>
        {!isHome ? (
          <Box
            maxWidth={['100%', `${TOC_WIDTH + 20}px`, `${TOC_WIDTH + 20}px`]}
            width="100%"
            display={['none', 'none', 'none', 'block']}
            pr="base-loose"
          >
            <Box position="sticky" top={0} pt="64px">
              <Search mb={space('extra-loose')} />
              {headings?.length > 1 ? (
                <TableOfContents
                  pl={space('base')}
                  borderLeft={border()}
                  headings={headings}
                  limit={2}
                />
              ) : null}
            </Box>
          </Box>
        ) : null}
      </>
    );
  }
);

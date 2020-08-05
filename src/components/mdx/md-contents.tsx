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

export const MDContents: React.FC<any> = ({ pageTop: PageTop = null, headings, children }) => {
  const router = useRouter();
  const isHome = router?.pathname === '/';

  const TOCShowing = !isHome && headings && headings?.length > 1;
  return (
    <>
      <ContentWrapper
        width={['100%', '100%', '100%', `calc(100% - ${!TOCShowing ? 0 : TOC_WIDTH}px)`]}
        mx="unset"
        pt="unset"
        css={css(styleOverwrites as any)}
        pr={TOCShowing && ['0', '0', '0', 'extra-loose']}
      >
        {PageTop && <PageTop />}
        {children}
      </ContentWrapper>
      {!isHome ? (
        <Box
          maxWidth={['100%', `${TOC_WIDTH}px`, `${TOC_WIDTH}px`]}
          width="100%"
          display={['none', 'none', 'none', 'block']}
        >
          <Box position="sticky" top={0} pt="64px">
            <Search mb={space('extra-loose')} />
            {TOCShowing ? null : null}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

import React from 'react';
import { Box, space } from '@blockstack/ui';

import { ContentWrapper } from '../content-wrapper';
import { TableOfContents } from '@components/toc';

import { css } from '@styled-system/css';
import { TOC_WIDTH } from '@common/constants';
import { styleOverwrites } from '@components/mdx/styles';
import dynamic from 'next/dynamic';
import { border } from '@common/utils';
const Search = dynamic(() => import('@components/search'));
export const MDContents: React.FC<any> = React.memo(({ headings, children }) => (
  <>
    <ContentWrapper
      width={
        headings?.length > 1 ? ['100%', '100%', '100%', `calc(100% - ${TOC_WIDTH}px)`] : '100%'
      }
      mx="unset"
      pt="unset"
      css={css(styleOverwrites as any)}
    >
      {children}
    </ContentWrapper>
    <Box>
      <Box position="sticky" top={0} pt="64px" pl={space('extra-loose')}>
        <Search mb={space('base')} />
        {headings?.length > 1 ? (
          <TableOfContents
            pl={space('base')}
            borderLeft={border()}
            display={['none', 'none', 'none', 'block']}
            headings={headings}
            limit={2}
          />
        ) : null}
      </Box>
    </Box>
  </>
));

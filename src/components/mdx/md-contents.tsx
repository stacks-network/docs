import React from 'react';
import { space } from '@blockstack/ui';

import { ContentWrapper } from '../content-wrapper';
import { TableOfContents } from '@components/toc';

import { css } from '@styled-system/css';
import { TOC_WIDTH } from '@common/constants';
import { styleOverwrites } from '@components/mdx/overrides';

export const MDContents: React.FC<any> = React.memo(({ headings, children }) => (
  <>
    <ContentWrapper
      width={
        headings?.length > 1 ? ['100%', '100%', '100%', `calc(100% - ${TOC_WIDTH}px)`] : '100%'
      }
      mx="unset"
      pt="unset"
      px="unset"
      css={css(styleOverwrites)}
    >
      {children}
    </ContentWrapper>
    {headings?.length > 1 ? (
      <TableOfContents
        display={['none', 'none', 'none', 'block']}
        position="sticky"
        top="195px"
        pl={space('extra-loose')}
        headings={headings}
      />
    ) : null}
  </>
));

import React from 'react';
import { Box, space, themeColor, color } from '@stacks/ui';
import { ContentWrapper } from '../content-wrapper';
import { TableOfContents } from '@components/toc';
import { TOC_WIDTH } from '@common/constants';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getHeadingStyles } from '@components/mdx/typography';
import { border } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@components/mdx';
import { css, Theme, ThemeUICSSObject } from '@stacks/ui-core';

export const styleOverwrites: ThemeUICSSObject = {
  '& > section': {
    '&:nth-child(2)': {
      '& > *:first-child, & > section:first-child > *:first-child': {
        mt: 0,
      },
    },
  },
  '.custom-block + *': {
    mt: space('extra-loose'),
  },
  section: {
    '& > *:not(pre):not(ul):not(ol):not(img):not([data-reach-accordion]):not(section):not(hr)': {
      px: space(['extra-loose', 'extra-loose', 'none', 'none']),
    },
    'ul, ol': {
      // pr: space('extra-loose'),
      px: space(['64px', '64px', 'extra-loose', 'extra-loose']),
      // pl: '64px',
      'ul, ol': {
        pl: space('extra-loose'),
      },
    },
    '*:not(pre) a > code': {
      color: color('accent'),
      textDecoration: 'inherit',
    },
    pre: {
      // px: space(['none', 'none', 'extra-loose', 'extra-loose']),
    },
    '.img': {
      mx: 'auto',
    },
  },
  pre: {
    display: 'block',
    my: space('extra-loose'),
    '& > div': {
      borderRight: [0, 0, border()],
      borderLeft: [0, 0, border()],
      borderBottom: border(),
      borderTop: border(),
      borderRadius: [0, 0, '12px'],
      bg: themeColor('ink'),
    },
    '& > div > div > code': {
      whiteSpace: 'pre',
      overflowX: 'auto',
      maxWidth: '100%',
      '& + h2, & + h3': {
        mt: space('extra-loose'),
      },
      '& + h4, & + h5, & + h6, & + blockquote, & + ul, & + ol': {
        mt: 0,
      },
      boxShadow: 'none',
    },
  },
  p: {
    width: '100%',
    a: {
      display: 'inline',
    },
  },
  'p, li': {
    overflowWrap: 'break-word',
    display: 'inline-block',
    ...getCapsizeStyles(16, 26, ':'),
  },
  li: {
    '& > p': {
      display: 'inline',
    },
    display: 'list-item',
    pb: space('base-tight'),
    ':last-child': {
      mb: 0,
      pb: 0,
    },
    '*:last-child:not(pre):not(blockquote)': {
      mb: 0,
    },
    'ol, ul': {
      mt: space('base-loose'),
    },
    ':before': {
      verticalAlign: 'top',
    },
    ':marker': {
      verticalAlign: 'top',
    },
    mb: space('base'),
    'p + p': {
      mt: space('extra-loose'),
    },
    'p + p, ul + p, ol + p': {
      display: 'inline-block',
      mt: space('extra-loose'),
    },
  },
  'p + p, ul + p, ol + p': {
    display: 'inline-block',
    mt: space('extra-loose'),
  },
  'li pre': {
    '& > div': {
      border: border(),
      borderRadius: '12px',
    },
  },
  '*:not(pre) code': {
    fontFamily: '"Soehne Mono", "Fira Code", monospace',
  },
  'pre code': {
    fontFamily: '"Soehne Mono", "Fira Code", monospace',
    fontSize: '14px',
    lineHeight: '24px',
  },
  h2: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h2', ':'),
    },
    '& > code': {
      px: space('tight'),
      py: space('extra-tight'),
      mr: '2px',
      fontSize: '22px',
    },
    '& + section > h3': {
      mt: 0,
    },
  },
  h3: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h3', ':'),
    },
    '& + section > h4': {
      mt: 0,
    },
  },
  h4: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h4', ':'),
    },
    '& + section > h5': {
      mt: 0,
    },
  },
  h5: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h5', ':'),
    },
  },
  h6: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h6', ':'),
    },
  },
  h1: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h1', ':'),
    },
    '& + *': {
      mt: space('extra-loose'),
    },
  },
  'h1, h2, h3, h4, h5, h6': {
    mb: space('extra-loose'),
    '& + pre': {
      mt: '0',
    },
    '& + ul, & + ol': {
      mt: '0',
    },
    '& + blockquote': {
      mt: '0',
    },
  },
  'ol, ul': {
    mb: 0,
    mt: space('extra-loose'),
  },
  blockquote: {
    '& + blockquote': {
      mt: space('extra-tight'),
    },
    '& > div > div > *:first-child': {
      mt: 0,
    },
    '& + pre': {
      mt: '0',
    },
    '& + h3, & + h4': {
      mt: space('extra-loose'),
    },
  },
  '.img': {
    my: space('extra-loose'),
  },
  table: {
    '*': {
      fontSize: '14px',
      lineHeight: '24px',
      '::before': {
        display: 'none',
      },
      '::after': {
        display: 'none',
      },
      '& code': {
        fontSize: '10px',
        lineHeight: '12px',
        transform: 'translateY(4px)',
      },
    },
    '& code': {
      maxWidth: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      whiteSpace: 'pre',
    },
    'td:last-child, th:last-child': {
      borderRight: 0,
    },
  },
};

const Search = dynamic(() => import('@components/search'));

export const MDContents: React.FC<any> = ({ pageTop: PageTop = null, headings, children }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  return (
    <>
      <ContentWrapper
        width={['100%', '100%', '100%', `calc(100% - ${isHome ? 0 : TOC_WIDTH}px)`]}
        mx="0"
        pt="0"
        css={(theme: Theme) => css(styleOverwrites)(theme)}
        pr={!isHome && ['0', '0', '0', 'extra-loose']}
      >
        {PageTop && <PageTop />}
        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      </ContentWrapper>
      {!isHome ? (
        <Box
          maxWidth={['100%', `${TOC_WIDTH}px`, `${TOC_WIDTH}px`]}
          width="100%"
          display={['none', 'none', 'none', 'block']}
        >
          <Box position="sticky" top={0} pt={space('extra-loose')}>
            <Search mb={space('extra-loose')} />
            {headings?.length ? <TableOfContents limit headings={headings} /> : null}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

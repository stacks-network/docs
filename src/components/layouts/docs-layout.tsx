import React from 'react';
import { Flex, color, space, themeColor } from '@blockstack/ui';
import { SideNav } from '../side-nav';
import { Header } from '../header';
import { Main } from '../main';
import { Footer } from '../footer';
import { useRouter } from 'next/router';
import { ContentWrapper } from '../content-wrapper';
import NotFoundPage from '@pages/404';
import { createGlobalStyle } from 'styled-components';
import { TableOfContents } from '@components/toc';
import { getHeadingStyles } from '@components/mdx/typography';
import { css } from '@styled-system/css';
import { SIDEBAR_WIDTH, TOC_WIDTH } from '@common/constants';
export const MdxOverrides = createGlobalStyle`
.DocSearch-Container{
z-index: 99999;
}
:root{
--docsearch-modal-background:  ${color('bg')};
--docsearch-primary-color-R: 84;
--docsearch-primary-color-G: 104;
--docsearch-primary-color-B: 255;
--docsearch-primary-color: ${color('accent')};
--docsearch-input-color: ${color('text-title')};
--docsearch-highlight-color: var(--docsearch-primary-color);
--docsearch-placeholder-color: ${color('text-caption')};
--docsearch-container-background: rgba(22,22,22,0.75);
--docsearch-modal-shadow: inset 1px 1px 0px 0px hsla(0,0%,100%,0.5),0px 3px 8px 0px #555a64;
--docsearch-searchbox-background: var(--ifm-color-emphasis-300);
--docsearch-searchbox-focus-background: #fff;
--docsearch-searchbox-shadow: inset 0px 0px 0px 2px rgba(var(--docsearch-primary-color-R),var(--docsearch-primary-color-G),var(--docsearch-primary-color-B),0.5);
--docsearch-hit-color: var(--ifm-color-emphasis-800);
--docsearch-hit-active-color: #fff;
--docsearch-hit-background: #fff;
--docsearch-hit-shadow: 0px 1px 3px 0px #d4d9e1;
--docsearch-key-gradient: linear-gradient(-225deg,#d5dbe4,#f8f8f8);
--docsearch-key-shadow: inset 0px -2px 0px 0px #cdcde6,inset 0px 0px 1px 1px #fff,0px 1px 2px 1px rgba(30,35,90,0.4);
--docsearch-footer-background: #fff;
--docsearch-footer-shadow: 0px -1px 0px 0px #e0e3e8;
--docsearch-logo-color: #5468ff;
--docsearch-muted-color: #969faf;
--docsearch-modal-width: 560px;
--docsearch-modal-height: 600px;
--docsearch-searchbox-height: 56px;
--docsearch-hit-height: 56px;
--docsearch-footer-height: 44px;
--docsearch-spacing: 12px;
--docsearch-icon-stroke-width: 1.4;
}

pre{
  display: inline-block;
}
p, ul, ol, table {
  color: ${color('text-body')};
  a > pre {
    color: ${color('accent')} !important;
  }
}
`;

const styleOverwrites = {
  '& > *:not(pre):not(ul):not(ol):not(img)': {
    px: space('extra-loose'),
  },
  '& > ul, & > ol': {
    pr: space('extra-loose'),
    pl: '64px ',
  },
  p: {
    display: 'inline-block',
    fontSize: '16.5px',
    lineHeight: '28px',
    ':before': {
      content: "''",
      marginTop: '-0.4878787878787879em',
      display: 'block',
      height: 0,
    },
    ':after': {
      content: "''",
      marginBottom: '-0.4878787878787879em',
      display: 'block',
      height: 0,
    },
  },
  li: {
    pb: 0,
    ':last-child': {
      mb: 0,
      pb: 0,
    },
    '*:last-child': {
      mb: 0,
    },
    pre: {
      display: 'block',
      my: space('extra-loose'),
    },
    p: {
      display: 'inline',
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

  '& > *:not(pre) a > code': {
    color: color('accent'),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  pre: {
    '& + h2, & + h3': {
      mt: space('extra-loose'),
    },
    '& + h4, & + h5, & + h6, & + blockquote, & + ul, & + ol': {
      mt: 0,
    },
  },
  h2: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h2'),
    },
    '& > code': {
      px: space('tight'),
      py: space('extra-tight'),
      mr: '2px',
      fontSize: '22px',
    },
    '& + h3': {
      mt: 0,
    },
  },
  h3: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h3'),
    },
    '& + h4': {
      mt: 0,
    },
  },
  h4: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h4'),
    },
    '& + h5': {
      mt: 0,
    },
  },
  h5: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h5'),
    },
  },
  h6: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h6'),
    },
  },
  h1: {
    mt: space('extra-loose'),
    '&, & > *': {
      ...getHeadingStyles('h1'),
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
    '& + blockquote, & + pre': {
      // mt: space('extra-tight'),
    },
  },
  blockquote: {
    '& > div > div > *:first-child': {
      mt: 0,
    },
    '& + pre': {
      mt: '0',
    },
    '& + h2': {
      mt: '0',
    },
  },
  img: {
    my: space('extra-loose'),
  },
  '& > pre > *:not(pre)': {
    border: 'none',
    px: space(['extra-loose', 'extra-loose', 'none', 'none']),
  },
  '& > pre > div[style]': {
    px: space(['base-loose', 'base-loose', 'none', 'none']),
  },
  '& > pre > .code-editor': {
    pl: space(['base', 'base', 'none', 'none']),
  },
  '& > pre': {
    px: space(['none', 'none', 'extra-loose', 'extra-loose']),
    border: 'none',
    boxShadow: 'none',
    my: space('extra-loose'),
  },
};

export const Contents = ({ headings, children }) => (
  <>
    <ContentWrapper
      width={
        headings?.length
          ? ['100%', '100%', `calc(100% - ${TOC_WIDTH}px)`, `calc(100% - ${TOC_WIDTH}px)`]
          : '100%'
      }
      mx="unset"
      pt="unset"
      pr={space('base-tight')}
      css={css(styleOverwrites)}
    >
      {children}
    </ContentWrapper>
    {headings?.length && headings.length > 1 ? (
      <TableOfContents
        display={['none', 'none', 'block', 'block']}
        position="sticky"
        top="105px"
        pl={space('extra-loose')}
        headings={headings}
      />
    ) : null}
  </>
);

const DocsLayout: React.FC<{ isHome?: boolean }> = ({ children, isHome }) => {
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Header />
      <Flex width="100%" flexGrow={1}>
        {!isHome && <SideNav display={['none', 'none', 'block']} />}
        <Flex
          flexGrow={1}
          maxWidth={[
            '100%',
            '100%',
            `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
            `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
          ]}
          mt={'50px'}
          flexDirection="column"
        >
          <Main mx="unset" width={'100%'}>
            <Flex
              flexDirection={['column', 'column', 'row', 'row']}
              maxWidth="108ch"
              mx="auto"
              flexGrow={1}
            >
              {children}
            </Flex>
          </Main>
          {isErrorPage || isHome ? null : <Footer justifySelf="flex-end" />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export { DocsLayout };

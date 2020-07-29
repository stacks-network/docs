import React from 'react';
import { color, space, themeColor } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { getHeadingStyles } from '@components/mdx/typography';
import { border } from '@common/utils';

export const MdxOverrides = createGlobalStyle`
@counter-style list {
 pad: "0";
}
.headroom {
  top: 0;
  left: 0;
  right: 0;
  zIndex: 1;
}
.headroom--unfixed {
  position: relative;
  transform: translateY(0);
}
.headroom--scrolled {
  transition: transform 200ms ease-in-out;
}
.headroom--unpinned {
  position: fixed;
  transform: translateY(-100%);
}
.headroom--pinned {
  position: fixed;
  transform: translateY(0%);
}
:root{
--docsearch-modal-background:  ${color('bg')};
--docsearch-text-color:  ${color('text-title')};
--docsearch-icon-color:  ${color('text-caption')};
--docsearch-primary-color: ${color('accent')};
--docsearch-input-color: ${color('text-title')};
--docsearch-highlight-color: ${color('bg-alt')};
--docsearch-placeholder-color: ${color('text-caption')};
--docsearch-container-background: rgba(22,22,22,0.75);
--docsearch-modal-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-searchbox-background: var(--ifm-color-emphasis-300);
--docsearch-searchbox-focus-background: ${color('bg')};;
--docsearch-searchbox-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-hit-color: var(--ifm-color-emphasis-800);
--docsearch-hit-active-color: ${color('text-title')};
--docsearch-hit-background: ${color('bg')};
--docsearch-hit-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-key-gradient: transparent;
--docsearch-key-shadow: inset 0px -2px 0px 0px transparent,inset 0px 0px 1px 1px transparent,0px 1px 2px 1px transparent;
--docsearch-footer-background: ${color('bg')};
--docsearch-footer-shadow: inset 0px 0px 1px 1px ${color('border')};
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
.DocSearch-Container{
  z-index: 99999;
}
.DocSearch-SearchBar{
  padding: var(--docsearch-spacing);
}
.DocSearch-Reset:hover{
  color: ${color('accent')};
}
.DocSearch-Form{
  input{
    color: ${color('text-title')};
  }
  &:focus-within{
    box-shadow: 0 0 0 3px rgba(170, 179, 255, 0.75);
  }
}
.DocSearch-Help{
  text-align: center;
}
.DocSearch-Prefill{
  color: ${color('accent')} !important;
}
.DocSearch-Hit{
  mark{
    color: ${color('accent')} !important;
  }
}
.DocSearch-Hit-source{
  color: ${color('text-caption')};
}
.DocSearch-MagnifierLabel{
  color: ${color('accent')};
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

export const styleOverwrites = {
  '& > *:not(pre):not(ul):not(ol):not(img):not([data-reach-accordion])': {
    px: space('extra-loose'),
  },
  '& > ul, & > ol': {
    pr: space('extra-loose'),
    pl: '64px ',
  },
  'p, li': {
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
    display: 'list-item',
    pb: 0,
    ':last-child': {
      mb: 0,
      pb: 0,
    },
    '*:last-child:not(pre):not(blockquote)': {
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
    textDecoration: 'inherit',
  },
  'li pre': {
    '& > div': {
      border: border(),
      borderRadius: '12px',
    },
  },
  pre: {
    my: space('extra-loose'),
    '& > div': {
      borderRight: [0, 0, border()],
      borderLeft: [0, 0, border()],
      borderBottom: border(),
      borderTop: border(),
      borderRadius: [0, 0, '12px'],
      bg: themeColor('ink'),
    },
    '& > div > code': {
      whiteSpace: 'pre',
      overflowX: 'auto',
      maxWidth: '100%',
      '& + h2, & + h3': {
        mt: space('extra-loose'),
      },
      '& + h4, & + h5, & + h6, & + blockquote, & + ul, & + ol': {
        mt: 0,
      },
      counterReset: 'line',
      '& .token-line': {
        '.comment': {
          color: 'rgba(255,255,255,0.5) !important',
        },
        display: 'flex',
        fontSize: '14px',
        '&::before': {
          counterIncrement: 'line',
          content: 'counter(line, decimal-leading-zero)',
          display: 'grid',
          placeItems: 'center',
          color: themeColor('ink.400'),
          mr: '16px',
          width: '42px',
          fontSize: '12px',
          borderRight: '1px solid rgb(39,41,46)',
        },
        pr: space(['base-loose', 'base-loose', 'extra-loose', 'extra-loose']),
      },
      boxShadow: 'none',
    },
  },
  '& > pre': {
    px: space(['none', 'none', 'extra-loose', 'extra-loose']),
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
    mt: '64px',
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
  img: {
    my: space('extra-loose'),
  },
  '& > img': {
    mx: 'auto',
  },
  table: {
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

import React from 'react';
import { color, space, themeColor } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { getHeadingStyles } from '@components/mdx/typography';
import { border } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';

export const MdxOverrides = createGlobalStyle`
* {
  font-feature-settings: 'ss01' on;
}
html, body {
  font-family: 'Soehne', Inter, sans-serif;
}
@counter-style list {
 pad: "0";
}
img{
  image-rendering: crisp-edges;
  will-change: transform;
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
  section: {
    '&:first-child > h2:first-child': {
      mt: 0,
    },
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
    img: {
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
      boxShadow: 'none',
    },
  },
  p: {
    width: '100%',
  },
  'p, li, a': {
    display: 'inline-block',
    ...getCapsizeStyles(16, 28),
  },
  li: {
    display: 'list-item',
    pb: space('base-tight'),
    ':last-child': {
      mb: 0,
      pb: 0,
    },
    '*:last-child:not(pre):not(blockquote)': {
      mb: 0,
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
  'li pre': {
    '& > div': {
      border: border(),
      borderRadius: '12px',
    },
  },
  '*:not(pre) code': {
    fontFamily: '"Soehne Mono", "Fira Code", monospace',
    // ...getCapsizeStyles(14, 24),
    // padding: '3px 2px',
  },
  'pre code': {
    fontFamily: '"Soehne Mono", "Fira Code", monospace',
    fontSize: '14px',
    lineHeight: '24px',
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
    '& + section > h3': {
      mt: 0,
    },
  },
  h3: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h3'),
    },
    '& + section > h4': {
      mt: 0,
    },
  },
  h4: {
    mt: '64px',
    '&, & > *': {
      ...getHeadingStyles('h4'),
    },
    '& + section > h5': {
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

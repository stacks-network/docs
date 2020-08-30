import React from 'react';
import { color, space, themeColor } from '@stacks/ui';
import { getHeadingStyles } from '@components/mdx/typography';
import { border } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';

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

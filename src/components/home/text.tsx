import React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';
import { Text } from '@components/typography';
import { getCapsizeStyles } from '@components/mdx/typography';

export const H1: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box {...rest}>
    <Text
      {...{
        color: color('text-title'),
        display: 'block',
        fontWeight: 'bolder',
        fontSize: ['44px', '44px', '66px'],
        lineHeight: ['48px', '48px', '68px'],
        padding: '0.05px 0',
        _before: {
          content: "''",
          marginTop: ['-0.18295454545454543em', '-0.18295454545454543em', '-0.15227272727272725em'],
          display: 'block',
          height: 0,
        },
        _after: {
          content: "''",
          marginBottom: [
            '-0.18295454545454545em',
            '-0.18295454545454545em',
            '-0.15227272727272728em',
          ],
          display: 'block',
          height: 0,
        },
      }}
      as="h1"
    >
      {children}
    </Text>
  </Box>
);

export const H2: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box {...rest}>
    <Text
      {...{
        color: color('text-title'),
        display: 'block',
        fontWeight: 'bold',
        fontSize: '38.5px',
        lineHeight: '42px',
        padding: '0.05px 0',
        _before: {
          content: "''",
          marginTop: '-0.1831168831168831em',
          display: 'block',
          height: 0,
        },
        _after: {
          content: "''",
          marginBottom: '-0.18311688311688312em',
          display: 'block',
          height: 0,
        },
      }}
      as="h1"
    >
      {children}
    </Text>
  </Box>
);
export const BodyLarge: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="h2"
    {...{
      color: color('text-body'),
      display: 'block',
      fontSize: '22px',
      lineHeight: '32px',
      padding: '0.05px 0',
      _before: {
        content: "''",
        marginTop: '-0.3659090909090909em',
        display: 'block',
        height: 0,
      },
      _after: {
        content: "''",
        marginBottom: '-0.3659090909090909em',
        display: 'block',
        height: 0,
      },
      ...rest,
    }}
  >
    {children}
  </Text>
);

export const SubHeading = ({ as, children, ...rest }: any) => (
  <Text
    as={as}
    {...{
      display: 'block',
      fontWeight: 600,
      fontSize: '22px',
      lineHeight: '28px',
      padding: '0.05px 0',
      _before: {
        content: "''",
        marginTop: '-0.27499999999999997em',
        display: 'block',
        height: 0,
      },
      _after: {
        content: "''",
        marginBottom: '-0.27499999999999997em',
        display: 'block',
        height: 0,
      },
      ...rest,
    }}
  >
    {children}
  </Text>
);
export const Body = ({ as, children, ...rest }: any) => (
  <Text as={as} {...getCapsizeStyles(16, 26)} {...rest}>
    {children}
  </Text>
);

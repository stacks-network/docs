import React from 'react';

import { Box, BoxProps, color, themeColor } from '@blockstack/ui';
import { border } from '@common/utils';
import { css } from '@styled-system/css';
import { Text } from '@components/typography';
import { useColorMode } from '@pages/_app';

const getHighlightLineNumbers = (str: string): number[] | undefined => {
  if (!str) return;
  let numbers: number[] | undefined = undefined;
  numbers = str.split(',').flatMap(s => {
    if (!s.includes('-')) return +s;

    const [min, max] = s.split('-');
    // @ts-ignore
    const final = Array.from({ length: max - min + 1 }, (_, n) => n + +min);
    return final;
  });
  return numbers;
};

export const Code: React.FC<BoxProps & { highlight?: string }> = React.forwardRef(
  ({ children, highlight, ...rest }, ref) => {
    const [mode] = useColorMode();
    const numbers = getHighlightLineNumbers(highlight);

    const generateCssStylesForHighlightedLines = (numbers: number[] = []) => {
      const record = {};
      const style = {
        bg: 'var(--colors-highlight-line-bg)',
        '&::before': {
          borderRightColor: themeColor('ink.600'),
        },
      };
      numbers.forEach(number => {
        record[`&:nth-of-type(${number})`] = style;
      });
      return record;
    };
    return (
      <Box ref={ref as any} overflowX="auto">
        <Box
          as="code"
          css={css({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 'fit-content',
            '.token-line': {
              display: 'inline-block',
              ...generateCssStylesForHighlightedLines(numbers),
            },
          })}
          {...rest}
        >
          <Box height="16px" width="100%" />
          {children}
          <Box height="16px" width="100%" />
        </Box>
      </Box>
    );
  }
);

const preProps = {
  display: 'inline-block',
  border: border(),
  borderRadius: '4px',
  padding: '2px 6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  bg: color('bg'),
};

export const InlineCode: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="code"
    css={css({
      // @ts-ignore
      fontSize: '14px',
      // @ts-ignore
      lineHeight: '20px',
      ...preProps,
      ...rest,
    })}
  >
    {children}
  </Text>
);

import React from 'react';

import { Box, BoxProps, color, themeColor } from '@blockstack/ui';
import { border } from '@common/utils';
import { css } from '@styled-system/css';
import { Text } from '@components/typography';

export const Code: React.FC<any> = React.memo(
  React.forwardRef(({ children, ...rest }, ref) => {
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
              '&.token-line--highlighted': {
                bg: 'rgba(255,255,255,0.05)',
                '&::before': {
                  borderRightColor: themeColor('ink.600'),
                },
              },
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
  })
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

import { Box, BoxProps, color, space } from '@stacks/ui';
import React from 'react';

import { border } from '@common/utils';
import { css, Theme } from '@stacks/ui-core';

export const Faucet: React.FC<BoxProps> = React.memo(
  React.forwardRef(({ children, className, ...rest }, ref) => {
    const isAlert = className?.includes('alert');
    return (
      <Box
        as="div"
        display="block"
        my={space('extra-loose')}
        className={className}
        ref={ref as any}
        {...rest}
      >
        <Box
          border="1px solid"
          {...{
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            gridTemplateColumns: '1fr',
            alignItems: 'flex-start',
            border: isAlert ? border() : border(),
            bg: isAlert ? color('bg') : color('bg-alt'),
            borderRadius: 'md',
            boxShadow: isAlert ? 'mid' : 'unset',
            py: space('base'),
            px: space('base'),
          }}
          css={(theme: Theme) =>
            css({
              '& p': {
                flexGrow: 1,
                pt: '4px',
              },
            })(theme)
          }
        >
          Faucet
        </Box>
      </Box>
    );
  })
);

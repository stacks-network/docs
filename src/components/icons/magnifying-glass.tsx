import React from 'react';

import { Box, BoxProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export const MagnifyingGlass = forwardRefWithAs<BoxProps, 'svg'>(({ size, ...props }, ref) => (
  <Box
    as="svg"
    position="relative"
    display="block"
    fill="none"
    viewBox="0 0 16 16"
    color="currentColor"
    width={size}
    height={size}
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.818 9.765L2.28 12.303a1.001 1.001 0 001.416 1.416l2.538-2.538A5.005 5.005 0 104.82 9.766l-.001-.001zm4.176.243a3.003 3.003 0 110-6.007 3.003 3.003 0 010 6.007z"
    />
  </Box>
));

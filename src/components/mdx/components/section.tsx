import React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const Section: React.FC<BoxProps> = React.memo(
  React.forwardRef(({ children, ...rest }, ref) => {
    return (
      <Box ref={ref as any} as="section" {...rest}>
        {children}
      </Box>
    );
  })
);

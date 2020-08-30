import { Box, color, space } from '@stacks/ui';
import React from 'react';
import { P } from '@components/mdx/components';
import { border } from '@common/utils';

export const Table = ({ children, ...rest }: any) => (
  <Box my={space('extra-loose')} maxWidth="100%" {...rest}>
    <Box borderRadius={[0, 0, '12px']} border={border()} overflow="hidden">
      <Box overflowX="auto">
        <Box color={color('text-body')} textAlign="left" width="100%" as="table" maxWidth="100%">
          {children}
        </Box>
      </Box>
    </Box>
  </Box>
);

export const THead = (props: any) => {
  return (
    <Box
      as="th"
      color="var(--colors-text-caption)"
      borderRight={border()}
      bg={color('bg-alt')}
      fontSize="12px"
      px={space('base-tight')}
      pt={space('tight')}
      pb={space('extra-tight')}
      {...props}
    />
  );
};

export const TData = (props: any) => (
  <Box
    as="td"
    fontSize="14px"
    p={space('tight')}
    px={space('base-tight')}
    pt={space('base-tight')}
    borderRight={border()}
    borderTop={border()}
    color={color('text-body')}
    whiteSpace="normal"
  >
    <P {...props} />
  </Box>
);

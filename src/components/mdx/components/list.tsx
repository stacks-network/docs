import { Box, BoxProps, color, space } from '@stacks/ui';
import React, { forwardRef, Ref } from 'react';

export const Ol: React.FC<BoxProps> = props => (
  <Box pl={space('base')} mt={space('base')} mb={space('base-tight')} as="ol" {...props} />
);

export const Ul: React.FC<BoxProps> = props => (
  <Box pl={space('base-loose')} mt={space('base')} mb={space('base-tight')} as="ul" {...props} />
);

export const Li: React.FC<BoxProps> = props => (
  <Box as="li" color={color('text-body')} pb={space('tight')} {...props} />
);

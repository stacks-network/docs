import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
export type SvgProps = React.FC<BoxProps>;

export const BaseSvg: SvgProps = props => (
  <Box
    as="svg"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

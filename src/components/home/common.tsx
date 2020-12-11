import React from 'react';
import {
  Box,
  Grid,
  Flex,
  BoxProps,
  transition,
  space,
  GridProps,
  color,
  FlexProps,
} from '@stacks/ui';

export const CircleIcon: React.FC<
  FlexProps & { icon: React.FC<any>; hover?: boolean; dark?: boolean }
> = ({ size = '72px', icon: Icon, hover, dark, ...rest }) => (
  <Flex
    size={size}
    alignItems="center"
    justify="center"
    borderRadius={size}
    bg={color(hover ? 'accent' : 'bg-alt')}
    transition={transition}
    {...rest}
  >
    <Box size="34px" color={color(hover ? 'bg' : 'invert')}>
      <Icon transition={transition} />
    </Box>
  </Flex>
);

export const Section: React.FC<GridProps> = props => (
  <Grid style={{ placeItems: 'center' }} py="64px" position="relative" width="100%" {...props} />
);

export const SectionWrapper: React.FC<BoxProps> = props => (
  <Box
    mx="auto"
    zIndex={99}
    position="relative"
    width="100%"
    overflow="hidden"
    pt={space('extra-loose')}
    {...props}
  />
);

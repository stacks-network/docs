import React from 'react';
import { Box, Grid, Flex, BoxProps, transition, space, themeColor, color } from '@blockstack/ui';
import { GridProps } from '@blockstack/ui/dist/ui/src/grid/types';
import { CONTENT_MAX_WIDTH } from '@common/constants';

export const CircleIcon: React.FC<
  BoxProps & { icon: React.FC<any>; hover?: boolean; dark?: boolean }
> = ({ size = '72px', icon: Icon, hover, dark, ...rest }) => (
  <Flex
    size={size}
    align="center"
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
    maxWidth={`${CONTENT_MAX_WIDTH}px`}
    overflow="hidden"
    px={space('extra-loose')}
    pt={space('extra-loose')}
    {...props}
  />
);

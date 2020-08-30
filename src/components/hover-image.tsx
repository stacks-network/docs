import React from 'react';
import { Box, BoxProps, Grid, space } from '@stacks/ui';
import { transition } from '@common/utils';
import { Img } from '@components/mdx/image';

const Image = ({
  src,
  isHovered,
  size,
  ...rest
}: BoxProps & { src?: string; isHovered?: boolean }) => (
  <Box
    flexShrink={0}
    style={{
      willChange: 'transform',
    }}
    width="100%"
    size={size}
    {...rest}
  >
    <Img
      flexShrink={0}
      borderRadius="12px"
      src={src}
      width="100%"
      minWidth={size}
      size={size}
      mx="0 !important"
      my="0 !important"
    />
  </Box>
);
export const HoverImage: React.FC<BoxProps & { isHovered?: boolean; src?: string }> = React.memo(
  ({ isHovered, src, ...props }) => (
    <Box
      bg="#9985FF"
      position="relative"
      borderRadius="12px"
      mb={space('loose')}
      overflow="hidden"
      {...props}
    >
      <Grid style={{ placeItems: 'center' }} height="0px" paddingTop="56.25%">
        <Image
          width="102%"
          size="102%"
          transition={transition('0.45s')}
          transform={isHovered && 'scale(1.08)'}
          style={{ willChange: 'transform' }}
          src={src}
          position="absolute"
          left={'-2%'}
          top={'-2%'}
        />
      </Grid>
    </Box>
  )
);

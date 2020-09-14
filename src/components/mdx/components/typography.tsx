import { Box, BoxProps, color, space } from '@stacks/ui';
import React from 'react';
import { Text } from '@components/typography';
import { BaseHeading } from '@components/mdx/components/heading';
import { forwardRefWithAs, ForwardRefExoticComponentWithAs } from '@stacks/ui-core';

export const H1: ForwardRefExoticComponentWithAs<BoxProps, 'h1'> = forwardRefWithAs<BoxProps, 'h1'>(
  (props, ref) => <BaseHeading as="h1" ref={ref} {...props} />
);
export const H2: ForwardRefExoticComponentWithAs<BoxProps, 'h2'> = forwardRefWithAs<BoxProps, 'h2'>(
  (props, ref) => <BaseHeading as="h2" ref={ref} {...props} />
);
export const H3: ForwardRefExoticComponentWithAs<BoxProps, 'h3'> = forwardRefWithAs<BoxProps, 'h3'>(
  (props, ref) => <BaseHeading as="h3" ref={ref} {...props} />
);
export const H4: ForwardRefExoticComponentWithAs<BoxProps, 'h4'> = forwardRefWithAs<BoxProps, 'h4'>(
  (props, ref) => <BaseHeading as="h4" ref={ref} {...props} />
);
export const H5: ForwardRefExoticComponentWithAs<BoxProps, 'h5'> = forwardRefWithAs<BoxProps, 'h5'>(
  (props, ref) => <BaseHeading as="h5" ref={ref} {...props} />
);
export const H6: ForwardRefExoticComponentWithAs<BoxProps, 'h6'> = forwardRefWithAs<BoxProps, 'h6'>(
  (props, ref) => <BaseHeading as="h6" ref={ref} {...props} />
);

export const Br: ForwardRefExoticComponentWithAs<BoxProps, 'br'> = forwardRefWithAs<BoxProps, 'br'>(
  props => <Box height="24px" {...props} />
);
export const Hr: ForwardRefExoticComponentWithAs<BoxProps, 'hr'> = forwardRefWithAs<BoxProps, 'hr'>(
  props => <Box as="hr" borderTopWidth="1px" borderColor={color('border')} my={'64px'} {...props} />
);

export const P: ForwardRefExoticComponentWithAs<BoxProps, 'p'> = forwardRefWithAs<BoxProps, 'p'>(
  (props, ref) => <Text as="p" ref={ref} {...props} />
);

export const Pre: ForwardRefExoticComponentWithAs<BoxProps, 'pre'> = forwardRefWithAs<
  BoxProps,
  'pre'
>((props, ref) => <Text as="pre" ref={ref} {...props} />);
export const Sup: ForwardRefExoticComponentWithAs<BoxProps, 'sup'> = forwardRefWithAs<
  BoxProps,
  'sup'
>((props, ref) => <Text as="sup" ref={ref} mr={space('extra-tight')} {...props} />);

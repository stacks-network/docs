import * as React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';
import { getCapsizeStyles } from '@components/mdx/typography';
import { forwardRefWithAs, ForwardRefExoticComponentWithAs } from '@stacks/ui-core';

export const Text: ForwardRefExoticComponentWithAs<BoxProps, 'span'> = forwardRefWithAs<
  BoxProps,
  'span'
>((props, ref) => <Box as="span" ref={ref} color={color('text-body')} {...props} />);

export const Caption: ForwardRefExoticComponentWithAs<
  BoxProps,
  'span'
> = forwardRefWithAs((props, ref) => (
  <Text
    style={{ userSelect: 'none' }}
    color={color('text-caption')}
    display="inline-block"
    ref={ref}
    {...getCapsizeStyles(14, 22)}
    {...props}
  />
));

export const Title: ForwardRefExoticComponentWithAs<
  BoxProps,
  'span'
> = React.forwardRef((props, ref) => (
  <Text ref={ref} display="inline-block" color={color('text-title')} {...props} />
));

export type LinkProps = BoxProps & Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export const Link: ForwardRefExoticComponentWithAs<LinkProps, 'a'> = forwardRefWithAs(
  ({ _hover = {}, ...props }: LinkProps, ref) => (
    <Text
      display="inline-block"
      _hover={{
        textDecoration: 'underline',
        cursor: 'pointer',
        ..._hover,
      }}
      ref={ref}
      {...props}
    />
  )
);

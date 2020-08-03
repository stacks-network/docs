import * as React from 'react';
import { Text as BaseText, BoxProps, color } from '@blockstack/ui';
import { getCapsizeStyles } from '@components/mdx/typography';

export const Text = React.forwardRef((props: BoxProps, ref) => (
  <BaseText ref={ref} color={color('text-body')} {...getCapsizeStyles(16, 26)} {...props} />
));

export const Caption: React.FC<BoxProps> = props => (
  <Text
    style={{ userSelect: 'none' }}
    color={color('text-caption')}
    display="inline-block"
    {...getCapsizeStyles(14, 22)}
    {...props}
  />
);

export const Title: React.FC<BoxProps> = React.forwardRef((props, ref) => (
  <Text ref={ref} display="inline-block" color={color('text-title')} {...props} />
));

export type LinkProps = BoxProps & Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export const Link = React.forwardRef(({ _hover = {}, ...props }: LinkProps, ref) => (
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
));

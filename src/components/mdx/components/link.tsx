import { Box, BoxProps } from '@blockstack/ui';
import NextLink from 'next/link';
import React, { forwardRef, Ref } from 'react';

export const SmartLink = ({ href, ...rest }: { href: string }) => {
  const isExternal = !href || href?.includes('http') || href?.includes('mailto');
  const link = <Link href={href} {...rest} />;

  return isExternal ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
};

export const Link = forwardRef(
  (
    props: { href?: string; target?: string; rel?: string } & BoxProps,
    ref: Ref<HTMLDivElement>
  ) => (
    <Box
      as={props.href ? 'a' : 'span'}
      ref={ref}
      color="var(--colors-accent)"
      cursor="pointer"
      textDecoration="underline"
      _hover={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'outline' }}
      {...props}
    />
  )
);

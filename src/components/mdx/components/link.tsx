import { Box, BoxProps, color, space, Fade } from '@stacks/ui';
import NextLink from 'next/link';
import React, { forwardRef, Ref } from 'react';
import { useAppState } from '@common/hooks/use-app-state';
import { border, transition } from '@common/utils';
import { Text } from '@components/typography';
import { useTouchable } from '@common/hooks/use-touchable';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import { getHeadingStyles } from '@components/mdx/typography';
import { PageMeta } from '@components/page-meta';

export const MarkdownLink = ({ href, ...rest }: { href: string }) => {
  const isExternal = !href || href?.includes('http') || href?.includes('mailto');
  const link = <LinkWithHover href={href || undefined} {...rest} />;

  return isExternal ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
};

export const SmartLink: ForwardRefExoticComponentWithAs<{ href?: string }, 'a'> = forwardRefWithAs<
  { href?: string },
  'a'
>(({ href, ...rest }, ref) => {
  const isExternal = !href || href?.includes('http') || href?.includes('mailto');
  const link = <Link ref={ref} href={href || undefined} {...rest} />;

  return isExternal ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
});

const Card = ({ route, styles, ...rest }) => {
  const { description } = route;
  return (
    <Box
      style={{ userSelect: 'none', pointerEvents: 'none', ...styles }}
      transition={transition()}
      pt={space('tight')}
      as="span"
      display="block"
      {...rest}
    >
      <Box
        bg={color('bg')}
        minWidth="280px"
        border={border()}
        borderRadius="12px"
        overflow="hidden"
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.02), 0px 24px 40px rgba(0, 0, 0, 0.08)"
        as="span"
        display="block"
      >
        <Box as="span" display="block" bg={color('bg-light')} p={space('base')}>
          <Text
            {...{
              ...getHeadingStyles('h5'),
              display: 'block',
            }}
          >
            {description}
          </Text>
          <PageMeta small {...route} />
        </Box>
      </Box>
    </Box>
  );
};

export const LinkWithHover = forwardRef(
  (
    props: { href?: string; target?: string; rel?: string } & BoxProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const { bind, hover } = useTouchable();

    const { routes } = useAppState();
    const isExternal =
      props.href && (props.href?.includes('http') || props.href?.includes('mailto'));

    const previewData =
      !isExternal && props.href && props.href.startsWith('/')
        ? routes.find(r => r.path.endsWith(props.href))
        : undefined;

    return (
      <Box as="span" display="inline" position="relative" {...bind}>
        <Box
          as={props.href ? 'a' : 'span'}
          ref={ref}
          color="var(--colors-accent)"
          cursor="pointer"
          textDecoration="underline"
          _hover={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'outline' }}
          rel="nofollow noopener noreferrer"
          {...props}
        />
        {previewData ? (
          <Fade in={hover}>
            {styles => (
              <Card
                route={previewData}
                position="absolute"
                left={0}
                top="100%"
                styles={styles}
                zIndex={999}
              />
            )}
          </Fade>
        ) : null}
      </Box>
    );
  }
);

export const Link: ForwardRefExoticComponentWithAs<BoxProps, 'a'> = forwardRefWithAs<BoxProps, 'a'>(
  ({ as = 'a', ...props }, ref) => (
    <Box
      as={props.href ? as : 'span'}
      ref={ref}
      color="var(--colors-accent)"
      cursor="pointer"
      textDecoration="none"
      _hover={{ textDecoration: 'underline' }}
      _focus={{ boxShadow: 'outline' }}
      rel="nofollow noopener noreferrer"
      {...props}
    />
  )
);

import { Box, Flex, FlexProps, BoxProps, color, useClipboard, space } from '@stacks/ui';

import React from 'react';
import LinkIcon from 'mdi-react/LinkVariantIcon';
import HashtagIcon from 'mdi-react/HashtagIcon';
import { useTouchable } from '@common/hooks/use-touchable';
import { Tooltip } from '@components/tooltip';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { Title } from '@components/typography';
import { getHeadingStyles, baseTypeStyles } from '@components/mdx/typography';
import { useRouter } from 'next/router';
import { Link } from '@components/mdx/components/link';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

const LinkButton = React.memo(({ link, onClick, ...rest }: BoxProps & { link: string }) => {
  const url =
    typeof document !== 'undefined' && document.location.origin + document.location.pathname + link;

  const { hasCopied, onCopy } = useClipboard(url);
  const label = hasCopied ? 'Copied!' : 'Copy url';
  return (
    <Box
      as="span"
      display={['none', 'none', 'block', 'block']}
      onClick={e => {
        onClick && onClick(e);
        onCopy?.();
      }}
      transform="translateY(1px)"
      {...rest}
    >
      <Tooltip label={label} aria-label={label}>
        <Link
          opacity={0.5}
          _hover={{
            opacity: 1,
          }}
          color={color('text-title')}
          as="a"
          href={link}
          display="block"
          ml={space('tight')}
        >
          <LinkIcon size="1rem" />
        </Link>
      </Tooltip>
    </Box>
  );
});

// this is to adjust the offset of where the page scrolls to when an anchor is present
const AnchorOffset: React.FC<BoxProps & { id?: string }> = ({ id }) =>
  id ? (
    <Box
      as="span"
      display="block"
      position="absolute"
      style={{ userSelect: 'none', pointerEvents: 'none' }}
      top={`-64px`}
      id={id}
    />
  ) : null;

const Hashtag = () => (
  <Flex
    position="absolute"
    as="span"
    alignItems="center"
    size="20px"
    left={['12px', '12px', '-20px', '-20px']}
    color={color('text-caption')}
  >
    <HashtagIcon size="1rem" />
  </Flex>
);

export const Heading: ForwardRefExoticComponentWithAs<
  FlexProps,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> = forwardRefWithAs<FlexProps, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>(
  ({ as, children, id, ...rest }, ref) => {
    const { isActive, doChangeActiveSlug } = useActiveHeading(id);

    const { bind: _bind, hover, active } = useTouchable();
    const router = useRouter();

    const link = `#${id}`;

    const handleLinkClick = () => {
      void router.push(router.pathname, router.pathname + link, { shallow: true });
      doChangeActiveSlug(id);
    };
    const styles = getHeadingStyles(as as any);

    const bind = id ? _bind : {};

    return (
      <Title
        as={as}
        {...bind}
        {...{
          ...baseTypeStyles,
          ...styles,
          color: isActive ? color('accent') : (color('text-title') as any),
          alignItems: 'center',
          position: 'relative',
          display: 'flex',
          justifyContent: 'flex-start',
          cursor: id && hover ? 'pointer' : 'unset',
        }}
        ref={ref}
        {...rest}
      >
        <Box as="span">{children}</Box>
        <AnchorOffset id={id} />
        {id && isActive && <Hashtag />}
        {id && <LinkButton opacity={hover ? 1 : 0} link={link} />}
      </Title>
    );
  }
);

export const BaseHeading: React.FC<BoxProps> = React.memo(({ ...props }) => (
  <Heading width="100%" mt={space('base-loose')} {...(props as any)} />
));

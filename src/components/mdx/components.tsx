import { Box, Flex, FlexProps, BoxProps, color, useClipboard, space } from '@blockstack/ui';
import NextLink from 'next/link';
import React, { forwardRef, Ref } from 'react';
import LinkIcon from 'mdi-react/LinkVariantIcon';
import HashtagIcon from 'mdi-react/HashtagIcon';
import { useHover } from 'use-events';
import { Tooltip } from '@components/tooltip';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { Text, Title } from '@components/typography';
import { border } from '@common/utils';
import { css } from '@styled-system/css';
import { getHeadingStyles, baseTypeStyles } from '@components/mdx/typography';
import { useRouter } from 'next/router';

const preProps = {
  display: 'inline-block',
  border: border(),
  borderRadius: '4px',
  padding: '2px 6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  bg: color('bg'),
};
export const InlineCode: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="code"
    css={css({
      // @ts-ignore
      fontSize: '14px',
      // @ts-ignore
      lineHeight: '20px',
      ...preProps,
      ...rest,
    })}
  >
    {children}
  </Text>
);

export const Pre = (props: any) => <Text as="pre" {...props} />;

export const SmartLink = ({ href, ...rest }: { href: string }) => {
  const isExternal = href.includes('http') || href.includes('mailto');
  const link = <Link href={href} {...rest} />;

  return isExternal ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
};

export const Table = ({ children, ...rest }: any) => (
  <Box maxWidth="100%" overflow="auto" {...rest}>
    <Box
      color={color('text-body')}
      textAlign="left"
      my={space('extra-loose')}
      width="100%"
      as="table"
      maxWidth="100%"
    >
      {children}
    </Box>
  </Box>
);

export const THead = (props: any) => {
  return (
    <Box
      as="th"
      color="var(--colors-text-caption)"
      bg="blue.50"
      p={2}
      textStyle={'body.small.medium'}
      {...props}
    />
  );
};

export const TData = (props: any) => (
  <Box
    as="td"
    p={2}
    borderTopWidth="1px"
    borderColor="var(--colors-border)"
    textStyle="body.small"
    whiteSpace="normal"
    {...props}
  />
);

export const Link = forwardRef((props: { href: string } & BoxProps, ref: Ref<HTMLDivElement>) => (
  <Box
    as="a"
    ref={ref}
    color="var(--colors-accent)"
    cursor="pointer"
    textDecoration="underline"
    _hover={{ textDecoration: 'none' }}
    _focus={{ boxShadow: 'outline' }}
    {...props}
  />
));

export const TextItem = (props: any) => (
  <Text
    mb="1em"
    mt="2em"
    css={{
      '&[id]': {
        pointerEvents: 'none',
      },
      '&[id]:before': {
        display: 'block',
        height: ' 6rem',
        marginTop: '-6rem',
        visibility: 'hidden',
        content: `""`,
      },
      '&[id]:hover a': { opacity: 1 },
    }}
    {...props}
  >
    <Box
      // @ts-ignore
      pointerEvents="auto"
    >
      {props.children}
      {props.id && (
        <Box
          aria-label="anchor"
          as="a"
          color="teal.500"
          fontWeight="normal"
          _focus={{ opacity: 1, boxShadow: 'outline' }}
          opacity={0}
          ml="0.375rem"
          // @ts-ignore
          href={`#${props.id}`}
        >
          #
        </Box>
      )}
    </Box>
  </Text>
);

const LinkButton = React.memo(({ link, onClick, ...rest }: BoxProps & { link: string }) => {
  const url =
    typeof document !== 'undefined' && document.location.origin + document.location.pathname + link;

  const { onCopy } = useClipboard(url);
  const label = 'Copy url';
  return (
    <Box
      as="span"
      display={['none', 'none', 'block', 'block']}
      onClick={e => {
        onClick && onClick(e);
        onCopy?.();
      }}
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
const AnchorOffset = ({ id }: BoxProps) =>
  id ? (
    <Box
      as="span"
      display="block"
      position="absolute"
      style={{ userSelect: 'none', pointerEvents: 'none' }}
      top="-120px"
      id={id}
    />
  ) : null;

const Hashtag = () => (
  <Box position="absolute" as="span" left="10px" color={color('text-caption')}>
    <HashtagIcon size="1rem" />
  </Box>
);

export const Heading = ({ as, children, id, ...rest }: FlexProps) => {
  const { isActive, doChangeActiveSlug } = useActiveHeading(id);
  const [isHovered, bind] = useHover();
  const router = useRouter();

  const link = `#${id}`;

  const handleLinkClick = () => {
    void router.push(router.pathname, router.pathname + link, { shallow: true });
    doChangeActiveSlug(id);
  };
  const styles = getHeadingStyles(as as any);

  return (
    <Title
      as={as}
      {...bind}
      css={css({
        ...baseTypeStyles,
        ...styles,
        color: isActive ? color('accent') : (color('text-title') as any),
        // @ts-ignore
        alignItems: 'center',
        // @ts-ignore
        position: 'relative',
        // @ts-ignore
        display: 'flex',
        // @ts-ignore
        justifyContent: 'flex-start',
        ...rest,
      })}
    >
      <Box as="span" display="inline-block">
        {children}
      </Box>
      <AnchorOffset id={id} />
      {id && isActive && <Hashtag />}
      {id && <LinkButton opacity={isHovered ? 1 : 0} onClick={handleLinkClick} link={link} />}
    </Title>
  );
};

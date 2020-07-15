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

const preProps = {
  display: 'inline-block',
  border: border(),
  borderRadius: '4px',
  transform: 'translateY(-1px)',
  fontSize: '12px',
  padding: '2px 6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  bg: color('bg'),
};
export const InlineCode: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="code"
    css={css({
      fontSize: '16.5px',
      lineHeight: '28px',
      padding: '0.05px 0',
      ':before': {
        content: "''",
        marginTop: '-0.4878787878787879em',
        display: 'block',
        height: 0,
      },
      ':after': {
        content: "''",
        marginBottom: '-0.4878787878787879em',
        display: 'block',
        height: 0,
      },
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
  <Box {...rest}>
    <Box
      color={color('text-body')}
      textAlign="left"
      my={space('extra-loose')}
      width="100%"
      as="table"
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
const AnchorOffset = ({ id }: BoxProps) => (
  <Box
    as="span"
    display="block"
    position="absolute"
    style={{ userSelect: 'none', pointerEvents: 'none' }}
    top="-120px"
    id={id}
  />
);

const Hashtag = () => (
  <Box position="absolute" as="span" left="10px" color={color('text-caption')}>
    <HashtagIcon size="1rem" />
  </Box>
);

export const Heading = ({ as, children, id, ...rest }: FlexProps) => {
  const { isActive, doChangeActiveSlug, doChangeSlugInView } = useActiveHeading(id);
  const [isHovered, bind] = useHover();

  const link = `#${id}`;

  const handleLinkClick = () => {
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        alignItems: 'center',
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        position: 'relative',
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        display: 'flex',
        justifyContent: 'flex-start',
      })}
    >
      <Box as="span" display="inline-block">
        {children}
      </Box>
      <AnchorOffset id={id} />
      {isActive && <Hashtag />}
      <LinkButton opacity={isHovered ? 1 : 0} onClick={handleLinkClick} link={link} />
    </Title>
  );
};

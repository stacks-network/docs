import {
  Box,
  Flex,
  FlexProps,
  BoxProps,
  color,
  themeColor,
  useClipboard,
  space,
} from '@blockstack/ui';
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
import { HEADER_HEIGHT } from '@components/header';
import { CheckCircleIcon } from '@components/icons/check-circle';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { AlertCircleIcon } from '@components/icons/alert-circle';
import { InfoCircleIcon } from '@components/icons/info-circle';

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
  <Box my={space('extra-loose')} maxWidth="100%" {...rest}>
    <Box borderRadius={[0, 0, '12px']} border={border()} overflow="hidden">
      <Box overflowX="auto">
        <Box color={color('text-body')} textAlign="left" width="100%" as="table" maxWidth="100%">
          {children}
        </Box>
      </Box>
    </Box>
  </Box>
);

export const THead = (props: any) => {
  return (
    <Box
      as="th"
      color="var(--colors-text-caption)"
      borderRight={border()}
      bg={color('bg-alt')}
      fontSize="12px"
      px={space('base-tight')}
      pt={space('tight')}
      pb={space('extra-tight')}
      {...props}
    />
  );
};

export const TData = (props: any) => (
  <Box
    as="td"
    fontSize="14px"
    p={space('tight')}
    px={space('base-tight')}
    pt={space('base-tight')}
    borderRight={border()}
    borderTop={border()}
    color={color('text-body')}
    whiteSpace="normal"
    {...props}
  />
);

export const Link = forwardRef(
  (props: { href: string; target?: string; rel?: string } & BoxProps, ref: Ref<HTMLDivElement>) => (
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
  )
);

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
      top={`-${HEADER_HEIGHT + 42}px`}
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

const BaseHeading: React.FC<BoxProps> = React.memo(props => (
  <Heading width="100%" mt={space('base-loose')} {...props} />
));

export const H1: React.FC<BoxProps> = props => <BaseHeading as="h1" {...props} />;
export const H2: React.FC<BoxProps> = props => <BaseHeading as="h2" {...props} />;
export const H3: React.FC<BoxProps> = props => <BaseHeading as="h3" {...props} />;
export const H4: React.FC<BoxProps> = props => <BaseHeading as="h4" {...props} />;
export const H5: React.FC<BoxProps> = props => <BaseHeading as="h5" {...props} />;
export const H6: React.FC<BoxProps> = props => <BaseHeading as="h6" {...props} />;

export const Br: React.FC<BoxProps> = props => <Box height="24px" {...props} />;
export const Hr: React.FC<BoxProps> = props => (
  <Box
    as="hr"
    borderTopWidth="1px"
    borderColor={color('border')}
    my={space('extra-loose')}
    mx={space('extra-loose')}
    {...props}
  />
);

export const P: React.FC<BoxProps> = props => <Text as="p" {...props} />;
export const Ol: React.FC<BoxProps> = props => (
  <Box pl={space('base')} mt={space('base')} mb={space('base-tight')} as="ol" {...props} />
);
export const Ul: React.FC<BoxProps> = props => (
  <Box pl={space('base-loose')} mt={space('base')} mb={space('base-tight')} as="ul" {...props} />
);
export const Li: React.FC<BoxProps> = props => (
  <Box as="li" color={color('text-body')} pb={space('tight')} {...props} />
);

const getAlertStyles = (className: string) => {
  if (className?.includes('alert-success')) {
    return {
      borderTopColor: themeColor('green'),
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: themeColor('green'),
      icon: CheckCircleIcon,
    };
  }
  if (className?.includes('alert-info')) {
    return {
      border: border(),
      borderRadius: 'md',
      boxShadow: 'mid',
      accent: color('accent'),
      icon: InfoCircleIcon,
    };
  }
  if (className?.includes('alert-warning')) {
    return {
      borderTopColor: '#F7AA00',
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: '#F7AA00',
      icon: AlertTriangleIcon,
    };
  }
  if (className?.includes('alert-danger')) {
    return {
      borderTopColor: themeColor('red'),
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: themeColor('red'),
      icon: AlertCircleIcon,
    };
  }
  return {};
};

export const BlockQuote: React.FC<BoxProps> = ({ children, className, ...rest }) => {
  const isAlert = className?.includes('alert');
  const { accent, icon: Icon, ...styles } = getAlertStyles(className);
  return (
    <Box as="blockquote" display="block" my={space('extra-loose')} className={className} {...rest}>
      <Box
        border="1px solid"
        css={css({
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          gridTemplateColumns: Icon ? '22px 1fr' : '1fr',
          alignItems: 'flex-start',
          border: isAlert ? border() : border(),
          bg: isAlert ? color('bg') : color('bg-alt'),
          borderRadius: 'md',
          boxShadow: isAlert ? 'mid' : 'unset',
          py: space('base'),
          px: space('base'),
          '& p': {
            flexGrow: 1,
            pt: '4px',
          },
          ...styles,
        })}
      >
        {Icon && (
          <Flex align="center" height="28x" flexShrink={0} color={accent} width="22px">
            <Box position="absolute" top="16px" size="22px">
              <Icon />
            </Box>
          </Flex>
        )}
        <Box width="100%" pl={Icon && space('tight')} flexGrow={1}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export const Sup: React.FC<any> = props => <Text as="sup" mr={space('extra-tight')} {...props} />;

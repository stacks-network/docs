import React from 'react';
import { Box, Flex, BoxProps, color, Grid, space, StxInline } from '@stacks/ui';
import { BlockstackLogo } from '@components/icons/blockstack-logo';
import { StackIcon } from '@components/icons/stack';
import { SitemapIcon } from '@components/icons/sitemap';
import { border, onlyText, transition } from '@common/utils';
import { useTouchable } from '@common/hooks/use-touchable';
import { Text } from '@components/typography';
import Link from 'next/link';
import { useAppState } from '@common/hooks/use-app-state';
import { Img } from '@components/mdx/image';
import { getCapsizeStyles, getHeadingStyles } from '@components/mdx/typography';

const Image = ({
  src,
  isHovered,
  size,
  alt,
  ...rest
}: BoxProps & { src?: string; isHovered?: boolean; alt?: string }) => (
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
      alt={alt}
      mx="0 !important"
      my="0 !important"
    />
  </Box>
);

const Title: React.FC<BoxProps> = ({ children, ...props }) => (
  <Text {...getHeadingStyles('h3')} {...props}>
    {children}
  </Text>
);

const Description = ({ children, ...props }) => (
  <Text
    {...props}
    {...getCapsizeStyles(16, 26)}
    mt={space('base-tight')}
    color={color('text-body')}
  >
    {children}
  </Text>
);

const FloatingLink = ({ href, contents, ...props }: any) => (
  <Link href={href} passHref>
    <Box
      as="a"
      position="absolute"
      size="100%"
      opacity={0}
      color="transparent"
      style={{
        userSelect: 'none',
      }}
      left={0}
      top={0}
    >
      {contents}
    </Box>
  </Link>
);
const InlineCard = ({ page }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Flex
      border={border()}
      flexDirection={['column', 'row', 'row', 'row']}
      p={space('base-loose')}
      borderRadius="12px"
      alignItems="center"
      transition={transition()}
      boxShadow={hover ? 'mid' : 'none'}
      position="relative"
      {...bind}
    >
      <Box
        flexShrink={0}
        position="relative"
        size="64px"
        overflow="hidden"
        bg="#9985FF"
        borderRadius={'12px'}
      >
        <Image
          size="102%"
          left={'-2%'}
          top={'-2%'}
          position="absolute"
          transition={transition('0.45s')}
          transform={(hover || active) && 'scale(1.18)'}
          style={{ willChange: 'transform' }}
          src={page?.images?.sm}
          alt={`Graphic for: ${page.title || page.headings[0]}`}
        />
      </Box>
      <Flex
        flexDirection="column"
        ml={space(['none', 'base', 'base', 'base'])}
        mt={space(['base', 'none', 'none', 'none'])}
        textAlign={['center', 'left', 'left', 'left']}
      >
        <Flex alignItems="baseline">
          <Title
            width={['100%', 'unset', 'unset', 'unset']}
            color={hover ? color('accent') : color('text-title')}
            mb={space('extra-tight')}
          >
            {page.title || page.headings[0]}
          </Title>
          {page.tags?.length ? (
            <Flex
              position={['absolute', 'static', 'static', 'static']}
              top={space('base-loose')}
              right={space('base-loose')}
            >
              {page.tags.map((tag, key) => (
                <Flex
                  ml={space('tight')}
                  borderRadius="18px"
                  px={space('base-tight')}
                  height="20px"
                  alignItems="center"
                  justify="center"
                  fontSize="12px"
                  bg={color('border')}
                  textTransform="capitalize"
                  color={color('invert')}
                  transition={transition()}
                  key={key}
                >
                  {tag}
                </Flex>
              ))}
            </Flex>
          ) : null}
        </Flex>
        <Description>{page.description}</Description>
      </Flex>
      <FloatingLink href={`${page.path}`} />
    </Flex>
  );
};

const GridCardImage: React.FC<
  BoxProps & { isHovered?: boolean; src?: string; alt?: string }
> = React.memo(({ isHovered, src, alt, ...props }) => (
  <Box
    bg="#9985FF"
    position="relative"
    borderRadius="12px"
    marginBottom="base"
    overflow="hidden"
    {...props}
  >
    <Grid style={{ placeItems: 'center' }} height="0px" paddingTop="56.25%">
      <Image
        size="102%"
        left={'-2%'}
        top={'-2%'}
        position="absolute"
        transition={transition('0.45s')}
        transform={isHovered && 'scale(1.08)'}
        style={{ willChange: 'transform' }}
        src={src}
        alt={alt}
      />
    </Grid>
  </Box>
));

const GridItemDetails: React.FC<BoxProps & { isHovered?: boolean; page: any }> = React.memo(
  ({ isHovered, page, ...props }) => (
    <>
      <Flex alignItems="flex-start" justifyContent="flex-start" flexDirection="column">
        <Title color="currentColor" mb={space('tight')}>
          {page.title || page.headings[0]}
        </Title>
        <Description>{page.description}</Description>
      </Flex>
      <FloatingLink href={`${page.path}`} contents={page.title || page.headings[0]} />
    </>
  )
);

const GridCard: React.FC<BoxProps & { page?: any }> = React.memo(({ page, ...rest }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Box
      position="relative"
      color={color('text-title')}
      _hover={{ color: color('accent') }}
      {...rest}
      {...bind}
    >
      <GridCardImage
        alt={`Graphic for: ${page.title || page.headings[0]}`}
        src={page?.images?.large}
        isHovered={hover || active}
        mb={'loose'}
      />
      <GridItemDetails page={page} />
    </Box>
  );
});

const getIcon = (icon: string) => {
  switch (icon) {
    case 'BlockstackIcon':
      return (p: BoxProps) => (
        <Grid borderRadius="6px" placeItems="center" bg="#9985FF" size="32px" {...p}>
          <StxInline size="20px" color={color('bg')} />
        </Grid>
      );
    case 'StacksIcon':
      return (p: BoxProps) => (
        <Grid borderRadius="6px" style={{ placeItems: 'center' }} bg="#9985FF" size="32px" {...p}>
          <StackIcon size="24px" color={color('bg')} />
        </Grid>
      );
    case 'RegtestIcon':
      return (p: BoxProps) => (
        <Grid borderRadius="6px" style={{ placeItems: 'center' }} bg="#9985FF" size="32px" {...p}>
          <SitemapIcon size="24px" color={color('bg')} />
        </Grid>
      );
    case 'TestnetIcon':
      return (p: BoxProps) => (
        <Grid borderRadius="6px" style={{ placeItems: 'center' }} bg="#9985FF" size="32px" {...p}>
          <SitemapIcon size="24px" color={color('bg')} />
        </Grid>
      );
    case 'MainnetIcon':
      return (p: BoxProps) => (
        <Grid borderRadius="6px" style={{ placeItems: 'center' }} bg="#9985FF" size="32px" {...p}>
          <SitemapIcon size="24px" color={color('bg')} />
        </Grid>
      );
    default:
      return (p: BoxProps) => <BlockstackLogo size="32px" color={color('accent')} {...p} />;
  }
};
const GridSmallItem: React.FC<BoxProps & { page?: any }> = ({ page, ...rest }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  const Icon = getIcon(page.icon);
  return (
    <Box
      position="relative"
      color={color('text-title')}
      _hover={{ color: color('accent') }}
      {...rest}
      {...bind}
    >
      {page.icon ? <Icon mb={space('loose')} /> : null}
      <GridItemDetails page={page} />
    </Box>
  );
};

const getComponent = (type: 'default' | 'inline' | 'grid' | 'grid-small') => {
  switch (type) {
    case 'inline':
      return InlineCard;
    case 'grid':
      return GridCard;
    case 'grid-small':
      return GridSmallItem;
    default:
      return InlineCard;
  }
};

export const PageReference: React.FC<BoxProps> = React.memo(({ children, ...rest }) => {
  const content = onlyText(children).trim();
  const [variant, _paths] = content.includes('\n') ? content.split('\n') : ['default', content];
  const paths = _paths.includes(', ') ? _paths.split(', ') : [_paths];
  const { routes } = useAppState();

  if (!routes) return null;

  const pages = paths.map(path => routes?.find(route => route.path === path)).filter(page => page);

  const Comp = getComponent(variant as any);
  return (
    <Box {...rest}>
      <Grid
        width="100%"
        gridColumnGap={space('extra-loose')}
        gridRowGap={space('extra-loose')}
        mt={space('extra-loose')}
        gridTemplateColumns={[
          `repeat(1, 1fr)`,
          `repeat(${pages.length === 1 ? 1 : 2}, 1fr)`,
          `repeat(${pages.length === 1 ? 1 : 2}, 1fr)`,
          `repeat(${pages.length === 1 ? 1 : 3}, 1fr)`,
        ]}
      >
        {pages.map((page, key) => (
          <Comp key={key} page={page} />
        ))}
      </Grid>
    </Box>
  );
});

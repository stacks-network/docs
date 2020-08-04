import React from 'react';
import { Box, Flex, BoxProps, color, Grid, space } from '@blockstack/ui';
import { border, onlyText, transition } from '@common/utils';
import { useTouchable } from '@common/hooks/use-touchable';
import { Caption, Text } from '@components/typography';
import Link from 'next/link';
import routes from '@common/routes';
import { Img } from '@components/mdx/image';

const Image = ({
  src,
  isHovered,
  size,
  ...rest
}: BoxProps & { src?: string; isHovered?: boolean }) => (
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
      mx="0 !important"
      my="0 !important"
    />
  </Box>
);

const Title = ({ children, ...props }: BoxProps) => (
  <Text fontWeight="500" display="block" {...props}>
    {children}
  </Text>
);

const Description = ({ children, ...props }) => (
  <Caption maxWidth="50ch" {...props}>
    {children}
  </Caption>
);

const FloatingLink = ({ href, ...props }: any) => (
  <Link href={href} passHref>
    <Box as="a" position="absolute" size="100%" left={0} top={0} />
  </Link>
);
const InlineCard = ({ page }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Flex
      border={border()}
      flexDirection={['column', 'column', 'row']}
      p={space('base-loose')}
      borderRadius="12px"
      align="center"
      transition={transition()}
      boxShadow={hover ? 'mid' : 'none'}
      position="relative"
      {...bind}
    >
      <Box flexShrink={0} size="64px" overflow="hidden" borderRadius={'12px'}>
        <Image
          transition={transition('0.45s')}
          transform={(hover || active) && 'scale(1.12)'}
          style={{ willChange: 'transform' }}
          size="64px"
          src={page.images.sm}
        />
      </Box>
      <Flex
        flexDirection="column"
        ml={space(['none', 'none', 'base'])}
        mt={space(['base', 'base', 'none'])}
        textAlign={['center', 'center', 'left']}
      >
        <Flex align="baseline">
          <Title
            width={['100%', '100%', 'unset']}
            color={hover ? color('accent') : color('text-title')}
            mb={space('extra-tight')}
          >
            {page.title || page.headings[0]}
          </Title>
          {page.tags?.length ? (
            <Flex
              position={['absolute', 'absolute', 'static']}
              top={space('base-loose')}
              right={space('base-loose')}
            >
              {page.tags.map(tag => (
                <Flex
                  ml={space('tight')}
                  borderRadius="18px"
                  px={space('base-tight')}
                  height="20px"
                  align="center"
                  justify="center"
                  fontSize="12px"
                  bg={color('border')}
                  textTransform="capitalize"
                  color={color('invert')}
                  transition={transition()}
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

const GridCard: React.FC<BoxProps & { page?: any }> = ({ page, ...rest }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Box position="relative" {...rest} {...bind}>
      <Box borderRadius="12px" overflow="hidden" mb={space('loose')}>
        <Image
          width="100%"
          size="100%"
          transition={transition('0.45s')}
          transform={(hover || active) && 'scale(1.08)'}
          style={{ willChange: 'transform' }}
          src={page?.images?.large}
        />
      </Box>
      <Flex alignItems="flex-start" justifyContent="flex-start" flexDirection="column">
        <Title color={hover ? color('accent') : color('text-title')} mb={space('tight')}>
          {page.title || page.headings[0]}
        </Title>
        <Description>{page.description}</Description>
      </Flex>
      <FloatingLink href={`${page.path}`} />
    </Box>
  );
};

export const PageReference = ({ children }) => {
  const content = onlyText(children).trim();
  const [variant, _paths] = content.includes('\n') ? content.split('\n') : ['default', content];
  const paths = _paths.includes(', ') ? _paths.split(', ') : [_paths];
  if (!routes) return null;

  const pages = paths.map(path => routes?.find(route => route.path === path)).filter(page => page);
  return (
    <Grid
      width="100%"
      mt={space('extra-loose')}
      gridColumnGap={space('loose')}
      gridRowGap={space('loose')}
      gridTemplateColumns={[
        `repeat(1, 1fr)`,
        `repeat(1, 1fr)`,
        `repeat(${pages.length === 1 ? 1 : 3}, 1fr)`,
      ]}
    >
      {pages.map(page =>
        variant === 'inline' ? <InlineCard page={page} /> : <GridCard page={page} />
      )}
    </Grid>
  );
};

import React from 'react';
import { Box, Flex, BoxProps, color, Grid, space, transition } from '@blockstack/ui';
import { border, onlyText } from '@common/utils';
import { useTouchable } from '@common/hooks/use-touchable';
import { Caption, Text } from '@components/typography';
import Link from 'next/link';
import routes from '@common/routes';

const Image = (props: BoxProps) => (
  <Box
    transition="all 0.75s cubic-bezier(0.23, 1, 0.32, 1)"
    flexShrink={0}
    bg="#9985FF"
    {...props}
  />
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
      borderColor={hover ? '#9985FF' : color('border')}
      p={space('base-loose')}
      borderRadius="12px"
      align="center"
      transition={transition}
      boxShadow={hover ? 'mid' : 'none'}
      position="relative"
      {...bind}
    >
      <Image borderRadius={hover ? '100%' : '12px'} mr={space('base')} size="64px" />
      <Flex flexDirection="column">
        <Flex align="baseline">
          <Title color={hover ? color('accent') : color('text-title')} mb={space('extra-tight')}>
            {page.title || page.headings[0]}
          </Title>
          {page.tags?.length
            ? page.tags.map(tag => (
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
                  transition={transition}
                >
                  {tag}
                </Flex>
              ))
            : null}
        </Flex>
        <Description>{page.description}</Description>
      </Flex>
      <FloatingLink href={`${page.path}`} />
    </Flex>
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
      mt={space('extra-loose')}
      gridColumnGap={space('loose')}
      gridTemplateColumns={`repeat(${pages.length === 1 ? 1 : 3}, 1fr)`}
    >
      {pages.map(page =>
        variant === 'inline' ? (
          <InlineCard page={page} />
        ) : (
          <Box position="relative">
            <Image height="144px" borderRadius="12px" mb={space('loose')} />
            <Flex alignItems="flex-start" justifyContent="flex-start" flexDirection="column">
              <Title mb={space('tight')}>{page.title || page.headings[0]}</Title>
              <Description>{page.description}</Description>
            </Flex>
            <FloatingLink href={`${page.path}`} />
          </Box>
        )
      )}
    </Grid>
  );
};

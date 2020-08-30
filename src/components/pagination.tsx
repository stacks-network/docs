import React from 'react';
import { Box, BoxProps, Flex, Grid, color, space, transition } from '@stacks/ui';
import { useAppState } from '@common/hooks/use-app-state';
import { useRouter } from 'next/router';
import { border, getTitle } from '@common/utils';
import NextLink from 'next/link';
import { Caption, Text, Link } from '@components/typography';
import { useTouchable } from '@common/hooks/use-touchable';
import { getHeadingStyles } from '@components/mdx/typography';
import { css } from '@stacks/ui-core';
import { ArrowRightIcon } from '@components/icons/arrow-right';
import { ArrowLeftIcon } from '@components/icons/arrow-left';

const FloatingLink: React.FC<any> = ({ href }) => (
  <NextLink href={`${href}`} passHref>
    <Link position="absolute" size="100%" left={0} top={0} zIndex={2} as="a" />
  </NextLink>
);

const getCategory = (pathname: string) => {
  const arr = pathname.split('/');
  if (arr.length > 1) {
    return arr[1];
  }
  return undefined;
};

const usePaginateRoutes = () => {
  const router = useRouter();
  const { routes } = useAppState();

  const category = getCategory(router.pathname);
  const getSection = route => getCategory(route.path) === category;
  const findCurrentRouteInArray = item => item.path === router.pathname;

  const sectionRoutes = routes.filter(getSection);

  if (!sectionRoutes)
    return {
      next: undefined,
      prev: undefined,
    };

  const routeIndex: number = sectionRoutes.findIndex(findCurrentRouteInArray);

  const next = sectionRoutes[routeIndex + 1];
  const prev = sectionRoutes[routeIndex - 1];

  return { next, prev };
};

const Description: React.FC<BoxProps> = props => (
  <Caption display="block" maxWidth="42ch" mt={space('extra-tight')} {...props} />
);

const Card: React.FC<any> = ({ children, ...rest }) => {
  const { bind, active, hover } = useTouchable({
    behavior: 'button',
  });
  return (
    <Flex
      flexDirection="column"
      width="100%"
      position="relative"
      border={border()}
      borderRadius="6px"
      py={space('base')}
      px={space('base-loose')}
      transition={transition}
      justifyContent="center"
      bg={color('bg')}
      {...bind}
      {...rest}
    >
      {children({ hover, active })}
    </Flex>
  );
};

const Pretitle: React.FC<BoxProps> = props => (
  <Text
    display="block"
    color={color('text-caption')}
    transition={transition}
    {...getHeadingStyles('h6')}
    {...props}
  />
);

const Title: React.FC<BoxProps & { isHovered?: boolean }> = ({ isHovered, ...props }) => (
  <Text
    display="block"
    maxWidth="38ch"
    width="100%"
    transition={transition}
    color={isHovered ? color('accent') : color('text-title')}
    mb={space('tight')}
    {...getHeadingStyles('h4')}
    {...props}
  />
);

const PrevCard: React.FC<any> = React.memo(props => {
  const { prev } = usePaginateRoutes();

  return prev ? (
    <Card py="loose">
      {({ hover, active }) => (
        <>
          <FloatingLink href={prev.path} />
          <Flex position="relative" mb={space('base-tight')} alignItems="center">
            <Pretitle
              left={hover || active ? '18px' : 0}
              bg={color('bg')}
              position="relative"
              zIndex={2}
            >
              Previous
            </Pretitle>
            <Box position="absolute" left={0} color={color('text-caption')} pt="2px">
              <ArrowLeftIcon size="14px" />
            </Box>
          </Flex>
          <Title isHovered={hover}>{getTitle(prev)}</Title>
        </>
      )}
    </Card>
  ) : (
    <Box />
  );
});
const NextCard: React.FC<any> = React.memo(props => {
  const { next } = usePaginateRoutes();

  return next ? (
    <Card py="loose" textAlign="right" alignItems="flex-end">
      {({ hover, active }) => (
        <>
          <FloatingLink href={next.path} />
          <Flex position="relative" mb={space('base-tight')} alignItems="center">
            <Pretitle
              right={hover || active ? '18px' : 0}
              bg={color('bg')}
              position="relative"
              zIndex={2}
            >
              Next
            </Pretitle>
            <Box position="absolute" right={0} ml="4px" color={color('text-caption')} pt="2px">
              <ArrowRightIcon size="14px" />
            </Box>
          </Flex>
          <Title isHovered={hover}>{getTitle(next)}</Title>
        </>
      )}
    </Card>
  ) : (
    <Box />
  );
});

export const Pagination: React.FC<any> = React.memo(({ hidePagination, ...rest }: any) => (
  <Grid
    gridColumnGap={space('extra-loose')}
    gridRowGap={space('extra-loose')}
    gridTemplateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)']}
  >
    <PrevCard />
    <NextCard />
  </Grid>
));

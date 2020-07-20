import React from 'react';
import { Box, BoxProps, Flex, Grid, color, space, transition } from '@blockstack/ui';
import routes from '@common/routes';
import { useRouter } from 'next/router';
import { MDXComponents } from '@components/mdx';
import { border } from '@common/utils';
import NextLink from 'next/link';
import { Link } from '@components/typography';
const usePaginateRoutes = () => {
  const router = useRouter();

  const getRoute = route => router.pathname === `/${route.path}`;
  const getSection = _section => _section.routes.find(getRoute);
  const findSectionByTitle = item => item.title === section.title;

  const section = routes.find(getSection);

  if (!section)
    return {
      next: undefined,
      prev: undefined,
    };

  const { routes: sectionRoutes } = section;
  const sectionIndex: number = routes.findIndex(findSectionByTitle);

  const nextSection = routes[sectionIndex + 1];
  const prevSection = routes[sectionIndex - 1];

  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === routes.length - 1;

  const route = sectionRoutes.find(getRoute);
  const routeIndex: number = sectionRoutes.findIndex(getRoute);

  const isFirstRouteInSection = routeIndex === 0;
  const isLastRouteInSection = routeIndex === sectionRoutes.length - 1;

  let next;
  let prev;

  if (!isLastRouteInSection) {
    next = sectionRoutes[routeIndex + 1];
  }
  if (isLastRouteInSection && !isLastSection) {
    next = nextSection?.routes?.length && nextSection?.routes[0];
  }
  if (!isFirstRouteInSection) {
    prev = sectionRoutes[routeIndex - 1];
  }
  if (isFirstRouteInSection && !isFirstSection) {
    prev = prevSection?.routes?.length && prevSection?.routes[0];
  }

  return { next, prev };
};

const Description: React.FC<BoxProps> = props => (
  <Box maxWidth="32ch" mt={space('extra-tight')}>
    <MDXComponents.p {...props} />
  </Box>
);

const Card = props => (
  <Flex
    flexDirection="column"
    width="100%"
    position="relative"
    border={border()}
    borderRadius="12px"
    py={space('base')}
    px={space('base-loose')}
    boxShadow="mid"
    transition={transition}
    _hover={{ cursor: 'pointer', boxShadow: 'high' }}
    justifyContent="center"
    {...props}
  />
);

export const Pagination = ({ hidePagination, ...rest }: any) => {
  const { next, prev } = usePaginateRoutes();
  return (
    <Grid
      gridColumnGap={space('base-loose')}
      gridRowGap={space('extra-loose')}
      gridTemplateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)']}
    >
      {prev ? (
        <Card>
          <NextLink href={`/${prev.path}`} passHref>
            <Link position="absolute" size="100%" zIndex={2} as="a" />
          </NextLink>
          <Box>
            <MDXComponents.h5 mt={0} color={color('text-caption')}>
              Previous
            </MDXComponents.h5>
          </Box>
          <Box maxWidth="38ch">
            <MDXComponents.h3 my={0}>{prev.title || prev.headings[0]}</MDXComponents.h3>
          </Box>
          {prev.description && <Description>{prev.description}</Description>}
        </Card>
      ) : (
        <Box />
      )}
      {next ? (
        <Card textAlign="right" align="flex-end">
          <NextLink href={`/${next.path}`} passHref>
            <Link position="absolute" size="100%" zIndex={2} as="a" />
          </NextLink>
          <MDXComponents.h5 mt={0} color={color('text-caption')} width="100%" display="block">
            Next
          </MDXComponents.h5>
          <Box maxWidth="38ch">
            <MDXComponents.h3 my={0}>{next.title || next.headings[0]}</MDXComponents.h3>
          </Box>
          {next.description && <Description>{next.description}</Description>}
        </Card>
      ) : (
        <Box />
      )}
    </Grid>
  );
};

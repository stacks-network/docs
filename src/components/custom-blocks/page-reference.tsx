import React from 'react';
import { Box, color, Grid, space } from '@blockstack/ui';
import { onlyText } from '@common/utils';
import { useAppState } from '@common/hooks/use-app-state';
import { Text } from '@components/typography';
import Link from 'next/link';
export const PageReference = ({ children }) => {
  const { routes } = useAppState();
  const content = onlyText(children).trim();
  const [variant, _paths] = content.includes('\n') ? content.split('\n') : ['default', content];
  const paths = _paths.includes(', ') ? _paths.split(', ') : [_paths];
  const flatRoutes = routes.flatMap(section =>
    section.routes.map(route => ({
      section: section.title,
      ...route,
    }))
  );

  const pages = paths
    .map(path => flatRoutes.find(route => route.path === path))
    .filter(page => page);
  return (
    <Grid
      mt={space('extra-loose')}
      gridColumnGap={space('loose')}
      gridTemplateColumns="repeat(3, 1fr)"
    >
      {pages.map(page => (
        <Box position="relative">
          <Box mb={space('loose')} borderRadius="12px" height="144px" width="100%" bg="#9985FF" />
          <Box pb={space('tight')}>
            <Text fontWeight="600">{page.title || page.headings[0]}</Text>
          </Box>
          <Box>{page.description}</Box>
          <Link href={`/${page.path}`} passHref>
            <Box as="a" position="absolute" size="100%" left={0} top={0} />
          </Link>
        </Box>
      ))}
    </Grid>
  );
};

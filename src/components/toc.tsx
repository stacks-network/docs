import React from 'react';
import { Box, Grid, color, space, BoxProps } from '@blockstack/ui';
import { TOC_WIDTH } from '@common/constants';
import { slugify } from '@common/utils';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import NextLink from 'next/link';
const getLevelPadding = (level: number) => {
  switch (level) {
    case 2:
      return space('base-loose');
    case 3:
      return space('extra-loose');
    default:
      return 0;
  }
};

const Item = ({ slug, label, level, limit }) => {
  const { isActive: _isActive, doChangeActiveSlug, slugInView } = useActiveHeading(slug);
  const isOnScreen = slugInView === slug;

  const isActive = isOnScreen || _isActive;
  return !limit || level <= limit + 1 ? (
    <Box pl={getLevelPadding(level - 2)} py={space('extra-tight')}>
      <NextLink href={`#${slug}`} passHref>
        <Link
          fontSize="14px"
          color={isActive ? color('text-title') : color('text-caption')}
          fontWeight={isActive ? '600' : '400'}
          textDecoration="none"
          _hover={{
            textDecoration: 'underline',
            color: color('accent'),
          }}
          pointerEvents={isActive ? 'none' : 'unset'}
        >
          <Box as="span" dangerouslySetInnerHTML={{ __html: label }} />
        </Link>
      </NextLink>
    </Box>
  ) : null;
};

export const TableOfContents = ({
  headings,
  noLabel,
  label = 'On this page',
  columns = 1,
  display,
  limit,
  ...rest
}: {
  headings?: {
    content: string;
    level: number;
  }[];
  noLabel?: boolean;
  label?: string;
  limit?: number;
  columns?: number | number[];
} & BoxProps) => {
  return (
    <Box position="relative" display={display}>
      <Box
        flexShrink={0}
        minWidth={['100%', `${TOC_WIDTH}px`, `${TOC_WIDTH}px`]}
        pr={space('base')}
        {...rest}
      >
        {!noLabel && (
          <Box mb={space('extra-tight')}>
            <Text fontWeight="bold" fontSize="14px">
              {label}
            </Text>
          </Box>
        )}
        <Grid
          gridColumnGap={space('base-loose')}
          gridTemplateColumns={
            Array.isArray(columns)
              ? columns.map(value => `repeat(${value}, 1fr)`)
              : `repeat(${columns}, 1fr)`
          }
        >
          {headings.map((heading, index) => {
            return index > 0 ? (
              <Item
                limit={limit}
                level={heading.level}
                slug={slugify(heading.content)}
                label={heading.content}
                key={index}
              />
            ) : null;
          })}
        </Grid>
      </Box>
    </Box>
  );
};

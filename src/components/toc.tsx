import React from 'react';
import { Box, Grid, color, space, BoxProps } from '@blockstack/ui';
import { slugify } from '@common/utils';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import NextLink from 'next/link';
import { getHeadingStyles } from '@components/mdx/typography';
import { css } from '@styled-system/css';

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

const Item = ({
  slug,
  label,
  level,
  limit,
}: {
  slug: string;
  label: string;
  level: number;
  limit?: number;
}) => {
  const { isActive: _isActive, slugInView } = useActiveHeading(slug);
  const isOnScreen = slugInView === slug;

  const isActive = isOnScreen || _isActive;

  const render = !limit || level <= limit + 1;
  return render ? (
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
      <Box flexShrink={0} width="100%" {...rest}>
        {!noLabel && (
          <Box mb={space('base')}>
            <Text
              css={css({
                ...getHeadingStyles('h6'),
                fontWeight: 500,
              })}
            >
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
          {headings?.map((heading, index) => {
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

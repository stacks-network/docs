import React from 'react';
import { Box, Grid, color, space, BoxProps } from '@stacks/ui';
import { slugify } from '@common/utils';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import NextLink from 'next/link';
import { getHeadingStyles } from '@components/mdx/typography';

const getLevelPadding = (level: number) => {
  switch (level) {
    case 2:
      return space('base');
    case 3:
      return space('base-loose');
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
  limit?: boolean;
}) => {
  const { isActive: _isActive, slugInView } = useActiveHeading(slug);
  const isOnScreen = slugInView === slug;

  const isActive = isOnScreen || _isActive;

  const adjustedLevel = level - 2;
  const shouldRender = limit ? adjustedLevel > 0 && adjustedLevel <= 1 : true;
  return shouldRender ? (
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
  limit?: boolean;
  columns?: number | number[];
} & BoxProps) => {
  return (
    <Box position="relative" display={display}>
      <Box flexShrink={0} width="100%" {...rest}>
        {!noLabel && (
          <Box mb={space('base')}>
            <Text
              {...{
                ...getHeadingStyles('h6'),
                fontWeight: 500,
              }}
            >
              {label}
            </Text>
          </Box>
        )}
        <Grid
          gridColumnGap={space('base-loose')}
          gridTemplateColumns={
            Array.isArray(columns)
              ? (columns as any).map(value => `repeat(${value}, 1fr)`)
              : `repeat(${columns}, 1fr)`
          }
        >
          {headings?.map((heading, index) => {
            return (
              <Item
                limit={limit}
                level={heading.level}
                slug={slugify(heading.content)}
                label={heading.content}
                key={index}
              />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

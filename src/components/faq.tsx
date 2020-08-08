import React from 'react';
import { Box, space, color, Grid } from '@blockstack/ui';
import { Text } from '@components/typography';
import { slugify } from '@common/utils';
import { css } from '@styled-system/css';
import { getCapsizeStyles, getHeadingStyles } from '@components/mdx/typography';
import { HoverImage } from '../hover-image';
import { useTouchable } from '@common/hooks/use-touchable';
import Link from 'next/link';
import { getBetterNames } from '@common/utils/faqs';

const FloatingLink = ({ href, ...props }: any) => (
  <Link href={href} {...props} passHref>
    <Box as="a" position="absolute" size="100%" zIndex={999} left={0} top={0} />
  </Link>
);
const SectionCard = ({ section }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'button',
  });
  const { title, description, img } = getBetterNames(section.id);
  return (
    <Box
      color={color('text-title')}
      _hover={{ cursor: 'pointer', color: color('accent') }}
      position="relative"
      {...bind}
    >
      <FloatingLink href="/references/faqs/[slug]" as={`/references/faqs/${slugify(title)}`} />
      <HoverImage isHovered={hover || active} src={img} />
      <Box>
        <Text
          css={css({
            color: 'currentColor',
            ...getHeadingStyles('h3'),
          })}
        >
          {title}
        </Text>
        <Box>
          <Text
            css={css({
              display: 'block',
              color: color('text-body'),
              mt: space('base-loose'),
              ...getCapsizeStyles(16, 26),
            })}
          >
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
export const FAQs = React.memo(({ articles, sections }: any) => {
  return (
    <Grid
      gridTemplateColumns="repeat(2, 1fr)"
      gridColumnGap={space('extra-loose')}
      gridRowGap="64px"
    >
      {sections.map(section => {
        return <SectionCard key={section.id} section={section} />;
      })}
    </Grid>
  );
});

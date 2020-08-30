import React from 'react';
import { Box, Flex, space, Stack, BoxProps, color, StackProps, FlexProps } from '@stacks/ui';

import { Text } from '@components/typography';

import { ToolsIcon } from '@components/icons/tools';
import { ClockIcon } from '@components/icons/clock';
import { getCapsizeStyles } from '@components/mdx/typography';
const Experience: React.FC<
  FlexProps & { level?: 'beginner' | 'intermediate' | 'advanced'; small?: boolean }
> = ({ level, small, ...rest }) => (
  <Flex alignItems="center" {...rest}>
    <Box mr={space('extra-tight')} color={color('text-caption')}>
      <ToolsIcon size={small ? '16px' : '20px'} />
    </Box>
    <Text textTransform="capitalize" {...getCapsizeStyles(small ? 14 : 16, 16)}>
      {level}
    </Text>
  </Flex>
);
const Duration: React.FC<FlexProps & { value?: string; small?: boolean }> = ({
  value,
  small,
  ...rest
}) => (
  <Flex alignItems="center" {...rest}>
    <Box mr={space('extra-tight')} color={color('text-caption')}>
      <ClockIcon size={small ? '16px' : '20px'} />
    </Box>
    <Text {...getCapsizeStyles(small ? 14 : 16, 16)}>{value}</Text>
  </Flex>
);

export const PageMeta: React.FC<StackProps & any> = ({ experience, duration, isHome, small }) => (
  <Stack isInline spacing={space('base')} mt={space('extra-loose')}>
    {experience ? <Experience small={small} level={experience} /> : null}
    {!isHome && duration ? <Duration small={small} value={duration} /> : null}
  </Stack>
);

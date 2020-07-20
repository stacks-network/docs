import React from 'react';
import { Box, BoxProps, color, Flex, space, Stack, themeColor } from '@blockstack/ui';
import { MDXComponents } from '@components/mdx';
import { SadIcon, NeutralIcon, HappyIcon } from '@components/icons/feedback';
import { useHover } from 'use-events';
import { border } from '@common/utils';

const Icon: React.FC<BoxProps & { icon: React.FC<any> }> = ({ icon: IconComponent, ...props }) => {
  const [isHovered, bind] = useHover();
  return (
    <Box _hover={{ color: color('accent'), cursor: 'pointer' }} size="42px" {...props} {...bind}>
      <IconComponent bg={isHovered ? themeColor('blue.200') : themeColor('ink.200')} />
    </Box>
  );
};

export const FeedbackSection: React.FC<BoxProps> = props => {
  return (
    <Box borderTop={border()} mt={space('extra-loose')}>
      <MDXComponents.h3>Was this page helpful?</MDXComponents.h3>
      <Stack isInline spacing={space('base-loose')} mt={space('base-loose')}>
        <Icon icon={SadIcon} />
        <Icon icon={NeutralIcon} />
        <Icon icon={HappyIcon} />
      </Stack>
    </Box>
  );
};

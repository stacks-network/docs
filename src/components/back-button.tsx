import React from 'react';
import { Flex, Box, color, space } from '@stacks/ui';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import { Text } from '@components/typography';
import Link from 'next/link';

const Wrapper = ({ href, children }) =>
  href ? (
    <Link href={href} passHref>
      {children}
    </Link>
  ) : (
    children
  );

export const BackButton = ({ href, ...rest }) => (
  <Wrapper href={href}>
    <Flex
      color={color('text-caption')}
      _hover={{
        cursor: 'pointer',
        color: color('text-title'),
      }}
      alignItems="center"
      as={href ? 'a' : 'div'}
      display="flex !important"
      {...rest}
    >
      <Box as="span" mr={space('extra-tight')}>
        <ArrowLeftIcon size="16px" />
      </Box>
      <Text color={'currentColor'}>Back</Text>
    </Flex>
  </Wrapper>
);

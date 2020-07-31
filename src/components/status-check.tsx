import React from 'react';
import { Box, Flex, space, themeColor, color } from '@blockstack/ui';
import { border } from '@common/utils';
import { Link } from '@components/mdx';
import { Text } from '@components/typography';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon, Spinner } from '@blockstack/ui';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

export const StatusCheck: React.FC<any> = () => {
  const STATUS_CHECKER_URL = 'https://status.test-blockstack.com';
  const { data, error } = useSWR(`${STATUS_CHECKER_URL}/json`, fetcher);
  let status = false;

  if (data && data.hasOwnProperty('masterNodePings') && data.masterNodePings.length > 1) {
    status = data.masterNodePings[0].value;
  }

  return (
    <Link href={STATUS_CHECKER_URL} target="_blank" textDecoration="none">
      <Box pt={space('base-loose')} px={space('base')} display={['none', 'none', 'block', 'block']}>
        <Flex
          border={border()}
          borderRadius="6px"
          px={space('base-tight')}
          py={space('tight')}
          align="center"
          _hover={{ borderColor: themeColor('blue.400'), cursor: 'pointer' }}
        >
          <Box mr={space('tight')}>
            {!data && !error && (
              <Spinner color={themeColor('ink.600')} speed="1s" thickness="2px" size="sm" />
            )}
            {error && !status && (
              <ExclamationMarkCircleIcon
                color={themeColor('feedback.error')}
                size="20px"
                alignItems="center"
                justifyContent="center"
              />
            )}
            {data && status && (
              <CheckmarkCircleIcon
                color={themeColor('feedback.success')}
                size="20px"
                alignItems="center"
                justifyContent="center"
              />
            )}
          </Box>
          <Text fontSize={'14px'} color={themeColor('ink.600')}>
            {!data && `Stack 2.0 testnet status`}
            {data && `Stacks 2.0 testnet is ${status ? 'online' : 'offline'}`}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};

const SpinnerComponent = ({ color }: { color: string }) => (
  <Spinner color={color} speed="1s" thickness="2px" size="sm" />
);

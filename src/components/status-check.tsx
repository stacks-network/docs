import React from 'react';
import useSWR from 'swr';
import { Box, Flex, space, color, BoxProps } from '@stacks/ui';
import { border, transition } from '@common/utils';
import { Link } from '@components/mdx';
import { LinkProps, Text } from '@components/typography';
import { Spinner } from '@stacks/ui';
import { CircleCheck } from '@components/icons/circle-check';
import { AlertCircleIcon } from '@components/icons/alert-circle';
import { STATUS_CHECKER_URL } from '@common/constants';
import { css } from '@stacks/ui-core';
import { getCapsizeStyles } from '@components/mdx/typography';

const fetcher = url => fetch(url).then(r => r.json());

type Status = 'online' | 'slow' | 'degraded' | 'loading' | undefined;

const getColor = (status: Status) => {
  switch (status) {
    case 'degraded':
      return 'feedback-error';
    case 'online':
      return 'feedback-success';
    case 'slow':
      return 'feedback-alert';
  }
};

const StatusWords: React.FC<BoxProps & { status?: Status }> = ({ status, ...rest }) => (
  <>
    <Box as="span">:</Box>
    <Box as="span" color={color(getColor(status))}>{` ${status}`}</Box>
  </>
);

const getStatus = (data: number): Status | 'loading' => {
  switch (data) {
    case 0:
      return 'online';
    case 1:
      return 'slow';
    case 2:
      return 'degraded';
    default:
      return 'loading';
  }
};

export const StatusCheck: React.FC<LinkProps> = props => {
  const { data, error } = useSWR(`/api/status`, fetcher);

  const status = getStatus(data);

  const critical = error || status === 'degraded';
  const warn = status === 'slow';

  return (
    <Link
      href={STATUS_CHECKER_URL}
      target="_blank"
      textDecoration="none"
      border={border()}
      borderRadius="6px"
      px={space('base-tight')}
      py={space('tight')}
      color={color('text-caption')}
      _hover={{ cursor: 'pointer', bg: color('bg-alt') }}
      opacity={data || error ? 1 : 0}
      transition={transition()}
      {...props}
    >
      <Flex alignItems="center">
        <Box mr={space('tight')}>
          {!data && !error ? (
            <Box
              style={{
                display: 'grid',
                placeItems: 'center',
              }}
              size="24px"
            >
              <Spinner color={color('accent')} speed="1s" thickness="2px" size="sm" />
            </Box>
          ) : critical || warn ? (
            <AlertCircleIcon color={color(getColor(status))} size="24px" />
          ) : (
            <CircleCheck size="24px" color={color('feedback-success')} />
          )}
        </Box>
        <Text
          {...{
            color: 'currentColor',
            ...getCapsizeStyles(14, 24),
          }}
        >
          Stacks 2.0 testnet status
          <StatusWords status={status} />
        </Text>
      </Flex>
    </Link>
  );
};

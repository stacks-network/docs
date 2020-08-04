import React from 'react';
import useSWR from 'swr';
import { Box, Flex, space, color, BoxProps } from '@blockstack/ui';
import { border } from '@common/utils';
import { Link } from '@components/mdx';
import { LinkProps, Text } from '@components/typography';
import { Spinner } from '@blockstack/ui';
import { CircleCheck } from '@components/icons/circle-check';
import { AlertCircleIcon } from '@components/icons/alert-circle';
import { STATUS_CHECKER_URL } from '@common/constants';
import { css } from '@styled-system/css';
import { getCapsizeStyles } from '@components/mdx/typography';

const fetcher = url => fetch(url).then(r => r.json());

const StatusWords: React.FC<BoxProps & { status?: boolean }> = ({ status, ...rest }) => (
  <>
    <Box as="span">:</Box>
    <Box as="span" color={status ? color('feedback-success') : color('feedback-alert')}>{`${
      status ? ' online' : ' offline'
    }`}</Box>
  </>
);

export const StatusCheck: React.FC<LinkProps> = props => {
  const { data, error } = useSWR(`${STATUS_CHECKER_URL}/json`, fetcher);
  const [status, setStatus] = React.useState(undefined);

  React.useEffect(() => {
    if (data?.masterNodePings?.length > 1) {
      setStatus(data.masterNodePings[0].value);
    } else if (status) {
      setStatus(undefined);
    }
  }, [data, error]);

  const critical = error && !status;
  const positive = data && status && !error;

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
      {...props}
    >
      <Flex align="center">
        <Box mr={space('tight')}>
          {!data && !error ? (
            <Spinner color={color('accent')} speed="1s" thickness="2px" size="sm" />
          ) : critical ? (
            <AlertCircleIcon color={color('feedback-alert')} size="20px" />
          ) : (
            positive && <CircleCheck size="20px" color={color('feedback-success')} />
          )}
        </Box>
        <Text
          css={css({
            color: 'currentColor',
            ...getCapsizeStyles(14, 24),
          })}
        >
          Stacks 2.0 testnet status
          <StatusWords status={status} />
        </Text>
      </Flex>
    </Link>
  );
};

import React, { Children } from 'react';

import { Box, Flex, BoxProps, color, space, useClipboard, themeColor } from '@blockstack/ui';
import { ClipboardCheckIcon } from '@components/icons/clipboard-check';
import { border, onlyText } from '@common/utils';
import { css } from '@styled-system/css';
import { Text } from '@components/typography';
import { useHover } from 'use-events';
import { IconButton } from '@components/icon-button';
import { CopyIcon as BaseCopyIcon } from '@components/icons/copy';

const LINE_MINIMUM = 4;

const getHighlightLineNumbers = (str: string): number[] | undefined => {
  if (!str) return;
  let numbers: number[] | undefined = undefined;
  numbers = str.split(',').flatMap(s => {
    if (!s.includes('-')) return +s;

    const [min, max] = s.split('-');
    // @ts-ignore
    const final = Array.from({ length: max - min + 1 }, (_, n) => n + +min);
    return final;
  });
  return numbers;
};

const generateCssStylesForHighlightedLines = (numbers: number[] = []) => {
  const record = {};
  const style = {
    bg: 'var(--colors-highlight-line-bg)',
    '&::before': {
      borderRightColor: themeColor('ink.600'),
    },
  };
  numbers.forEach(number => {
    record[`&:nth-of-type(${number})`] = style;
  });
  return record;
};

export const Code: React.FC<
  BoxProps & { highlight?: string; lang?: string; lines: number }
> = React.memo(
  React.forwardRef(({ children, highlight, lang, lines, ...rest }, ref) => {
    const [hover, bind] = useHover();

    const numbers = getHighlightLineNumbers(highlight);

    const convertSingleChildToString = child => onlyText(child).replace(/\n/g, '');
    const tokenLines = Children.toArray(children).map(convertSingleChildToString);

    const codeString = tokenLines.join('\n').replace(/\n\n\n/g, '\n\n');

    const { hasCopied, onCopy } = useClipboard(codeString);

    const CopyIcon = hasCopied ? ClipboardCheckIcon : BaseCopyIcon;

    return (
      <Box overflow="hidden" position="relative" {...bind}>
        <Box
          className={lines <= 3 ? 'no-line-numbers' : ''}
          position="relative"
          ref={ref as any}
          overflowX="auto"
        >
          <Box
            as="code"
            css={css({
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'fit-content',
              '.token-line': {
                display: 'inline-block',
                ...generateCssStylesForHighlightedLines(numbers),
              },
              counterReset: 'line',
              '& .token-line': {
                '&__empty': {
                  height: '24px',
                },
                '.comment': {
                  color: 'rgba(255,255,255,0.5) !important',
                },
                display: 'flex',
                fontSize: '14px',
                '&::before':
                  lines > LINE_MINIMUM && lang !== 'bash'
                    ? {
                        counterIncrement: 'line',
                        content: 'counter(line, decimal-leading-zero)',
                        display: 'grid',
                        placeItems: 'center',
                        color: themeColor('ink.400'),
                        mr: '16px',
                        width: '42px',
                        fontSize: '12px',
                        transform: 'translateY(1px)',
                        borderRight: '1px solid rgb(39,41,46)',
                      }
                    : {},
              },
              pr: space(['base-loose', 'base-loose', 'extra-loose', 'extra-loose']),
              pl:
                lines <= LINE_MINIMUM || lang === 'bash'
                  ? space(['extra-loose', 'extra-loose', 'base-loose', 'base-loose'])
                  : 'unset',
            })}
            {...rest}
          >
            <Box height="16px" width="100%" />
            <Box
              as="span"
              position="absolute"
              color="transparent"
              top="16px"
              left={
                lines <= LINE_MINIMUM || lang === 'bash'
                  ? space(['extra-loose', 'extra-loose', '20px', '20px'])
                  : '58px'
              }
              zIndex={99}
            >
              {codeString}
            </Box>
            <Box
              as="span"
              style={{
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {children}
            </Box>
            <Box height="16px" width="100%" />
          </Box>
        </Box>
        {hover ? (
          <Flex
            size="80%"
            justifyContent="flex-end"
            alignItems="flex-start"
            position="absolute"
            right="0"
            top="0"
            zIndex={999999}
            px={space('base')}
            py={lines === 1 ? '10px' : space('base')}
            display={['none', 'none', 'flex']}
            style={{
              pointerEvents: 'none',
            }}
          >
            <IconButton
              title="Copy to clipboard"
              bg="ink.900"
              _hover={{
                color: 'white',
                // @ts-ignore
                bg: themeColor('ink.900'),
              }}
              color={themeColor('ink.400')}
              onClick={onCopy}
              style={{
                pointerEvents: 'all',
              }}
            >
              <CopyIcon size="20px" />
            </IconButton>
          </Flex>
        ) : null}
      </Box>
    );
  })
);

const preProps = {
  display: 'inline',
  border: border(),
  borderRadius: '4px',
  wordBreak: ['break-all', 'break-all', 'unset', 'unset'],
  padding: '2px 6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  bg: color('bg'),
};

export const InlineCode: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="code"
    css={css({
      // @ts-ignore
      fontSize: '14px',
      // @ts-ignore
      lineHeight: '20px',
      ...preProps,
      ...rest,
    })}
  >
    {children}
  </Text>
);

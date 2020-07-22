import React from 'react';
import Highlight from 'prism-react-renderer';
import { Box, Flex, space, useTheme } from '@blockstack/ui';
import { GrammaticalToken, GetGrammaticalTokenProps, RenderProps, Language } from './types';
import Prism from 'prism-react-renderer/prism';
import { theme } from '@components/highlighter/prism-theme';
import './language-definition';
import { css } from '@styled-system/css';

const startPad = (n: number, z = 2, s = '0') =>
  (n + '').length <= z ? ['', '-'][+(n < 0)] + (s.repeat(z) + Math.abs(n)).slice(-1 * z) : n + '';

const LINE_NUMBER_WIDTH = 50;
const getLineNumber = (n: number, length: number) => startPad(n + 1, length.toString().length);

const Tokens = ({
  tokens,
  getTokenProps,
  showLineNumbers,
  ...rest
}: {
  tokens: GrammaticalToken[];
  getTokenProps: GetGrammaticalTokenProps;
  showLineNumbers?: boolean;
}) => {
  const bsTheme = useTheme();
  const pl = showLineNumbers
    ? [`calc(${LINE_NUMBER_WIDTH}px + ${(bsTheme as any).sizes['base']})`]
    : ['unset', 'unset', 'base', 'base'];

  return (
    <Box pl={pl} pr="base" position="relative" zIndex={2} {...rest}>
      {tokens.map(
        (token, key) =>
          token.content !== '// highlight' && (
            <Box py="2px" display="inline-block" {...getTokenProps({ token, key })} />
          )
      )}
    </Box>
  );
};
const LineNumber = ({ number, length, ...rest }: { number: number; length: number }) => (
  <Flex
    textAlign="right"
    pr={space('tight')}
    pl={space('tight')}
    width={LINE_NUMBER_WIDTH}
    borderRight="1px solid"
    borderRightColor="inherit"
    color="ink.400"
    flexShrink={0}
    style={{ userSelect: 'none' }}
    position="absolute"
    left={0}
    height="100%"
    align="baseline"
    justify="center"
    zIndex={1}
    css={css({
      color: 'rgba(255,255,255,0.6)',
      whiteSpace: 'pre',
      fontFamily: 'Fira Code, Consolata, monospace',
      fontSize: '14.556040756914118px',
      lineHeight: '24px',
      padding: '2px 0',
      '::before': {
        content: "''",
        marginTop: '-0.47483499999999995em',
        display: 'block',
        height: 0,
      },
      '::after': {
        content: "''",
        marginBottom: '-0.493835em',
        display: 'block',
        height: 0,
      },
    })}
    {...rest}
  >
    {getLineNumber(number, length)}
  </Flex>
);

const Line = ({
  tokens,
  getTokenProps,
  index,
  length,
  showLineNumbers,
  hideLineHover,
  highlighted,
  ...rest
}: {
  tokens: GrammaticalToken[];
  index: number;
  length: number;
  getTokenProps: GetGrammaticalTokenProps;
  showLineNumbers?: boolean;
  hideLineHover?: boolean;
  highlighted?: boolean;
}) => {
  const highlightedStyle = {
    bg: ['unset', 'unset', 'ink.900'],
    borderColor: ['ink.900', 'ink.900', 'ink.600'],
  };
  const hasHighlightComment = !!tokens.find(token => token.content === '// highlight');
  const isHighlighted = highlighted || hasHighlightComment;
  const highlighedProps = isHighlighted ? highlightedStyle : {};

  return (
    <Flex
      height="loose"
      align="baseline"
      borderColor="ink.900"
      _hover={hideLineHover ? undefined : highlightedStyle}
      position="relative"
      {...highlighedProps}
      {...rest}
    >
      {showLineNumbers ? <LineNumber number={index} length={length} /> : null}
      <Tokens showLineNumbers={showLineNumbers} getTokenProps={getTokenProps} tokens={tokens} />
    </Flex>
  );
};

const Spacer = ({ showLineNumbers }: { showLineNumbers?: boolean }) => (
  <Flex height="base-loose" bg="ink" width="100%">
    {showLineNumbers && (
      <Box
        height="base-loose"
        borderRight="1px solid"
        borderRightColor="ink.900"
        width={`${LINE_NUMBER_WIDTH}px`}
      />
    )}
  </Flex>
);
const Lines = ({
  tokens: lines,
  getLineProps,
  getTokenProps,
  className,
  showLineNumbers,
  hideLineHover,
  highlightedLines,
}: {
  showLineNumbers?: boolean;
  hideLineHover?: boolean;
  highlightedLines?: number[];
} & RenderProps) => {
  return (
    <Box display="block" className={className}>
      <Box display="block" style={{ fontFamily: 'Fira Code' }}>
        <Spacer showLineNumbers={showLineNumbers} />
        {lines.map((tokens, i) => (
          <Box
            css={css({
              '& > *': {
                fontFamily: 'Fira Code, Consolata, monospace',
                fontSize: '14.556040756914118px',
                lineHeight: '24px',
                padding: '0.05px 0',
                '::before': {
                  content: "''",
                  marginTop: '-0.47483499999999995em',
                  display: 'block',
                  height: 0,
                },
                '::after': {
                  content: "''",
                  marginBottom: '-0.493835em',
                  display: 'block',
                  height: 0,
                },
              },
            })}
          >
            <Line
              index={i}
              tokens={tokens}
              getTokenProps={getTokenProps}
              length={lines.length + 1}
              showLineNumbers={showLineNumbers}
              highlighted={
                highlightedLines?.length &&
                !!highlightedLines.find(lineNumber => lineNumber === i + 1)
              }
              hideLineHover={hideLineHover || lines.length < 3}
              {...getLineProps({ line: tokens, key: i })}
            />
          </Box>
        ))}
        <Spacer showLineNumbers={showLineNumbers} />
      </Box>
    </Box>
  );
};

export interface HighlighterProps {
  code: string;
  language?: Language;
  showLineNumbers?: boolean;
  hideLineHover?: boolean;
  highlightedLines?: number[];
}

export const Highlighter = React.memo(
  ({
    code,
    language = 'clarity',
    showLineNumbers,
    hideLineHover,
    highlightedLines,
  }: HighlighterProps) => {
    return (
      <Highlight Prism={Prism} theme={theme} code={code} language={language as any}>
        {props => (
          <Lines
            showLineNumbers={showLineNumbers}
            highlightedLines={highlightedLines}
            hideLineHover={hideLineHover}
            {...props}
          />
        )}
      </Highlight>
    );
  }
);

Highlighter.displayName = 'Highlighter';

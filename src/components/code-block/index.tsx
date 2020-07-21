import React from 'react';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-kotlin';
import { Highlighter, HighlighterProps } from '../highlighter';
import { Box, BoxProps } from '@blockstack/ui';
import { css } from '@styled-system/css';

interface CodeBlock {
  live?: boolean;
  highlight?: string;
}

export type CodeBlockProps = CodeBlock & HighlighterProps & BoxProps;

const getHighlightLineNumbers = str =>
  str &&
  str
    .split(' ')
    .join('')
    .split(',')
    .flatMap(s => {
      if (!s.includes('-')) return +s;

      const [min, max] = s.split('-');

      return Array.from({ length: max - min + 1 }, (_, n) => n + +min);
    });

const CodeBlock = React.memo(
  React.forwardRef(
    (
      {
        code,
        showLineNumbers,
        hideLineHover,
        style = {},
        highlightedLines,
        className,
        live = true,
        highlight,
        children,
        ...props
      }: CodeBlockProps,
      ref: React.Ref<HTMLDivElement>
    ) => {
      const language = className && className.replace(/language-/, '');

      return (
        <Box
          className={language !== 'bash' ? 'line-numbers' : ''}
          bg="ink"
          borderRadius={[0, 0, '12px']}
          overflowX="auto"
        >
          <Box
            ref={ref}
            css={css({
              ...style,
              // @ts-ignore
              color: 'white',
              // @ts-ignore
              whiteSpace: 'pre',
              ...props,
            })}
          >
            <Highlighter
              language={language as any}
              code={children.toString().trim()}
              showLineNumbers={language && language !== 'bash'}
              highlightedLines={getHighlightLineNumbers(highlight)}
              hideLineHover
            />
          </Box>
        </Box>
      );
    }
  )
);

export default CodeBlock;

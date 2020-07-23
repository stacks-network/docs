import React from 'react';
import { Highlighter, HighlighterProps } from '../highlighter';
import { Box, BoxProps, color } from '@blockstack/ui';
import { css } from '@styled-system/css';

// Languages used in docs
// when adding a new language in the docs, import the theme here
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-kotlin';

interface CodeBlock {
  live?: boolean;
  showLineNumbers?: boolean;
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

      const displayNumbers = showLineNumbers || (language && language !== 'bash');

      return (
        <Box
          className={displayNumbers ? 'line-numbers' : ''}
          bg="ink"
          border="1px solid"
          borderColor={color('border')}
          borderRightWidth={['0px', '0px', '1px']}
          borderLeftWidth={['0px', '0px', '1px']}
          borderRadius={[0, 0, '12px']}
          overflow="hidden"
        >
          <Box
            ref={ref}
            css={css({
              ...style,
              // @ts-ignore
              overflowX: 'auto',
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
              showLineNumbers={displayNumbers}
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

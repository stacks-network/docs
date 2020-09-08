import React from 'react';
import { Box, space } from '@stacks/ui';
import hydrate from 'next-mdx-remote/hydrate';
import { Components } from '@components/mdx/mdx-components';
import { slugify } from '@common/utils';
import { css, Theme } from '@stacks/ui-core';
import { TableOfContents } from '@components/toc';

export const Glossary = ({ data }) => {
  return (
    <>
      <TableOfContents
        columns={[2, 2, 3, 3]}
        headings={data.map(entry => ({
          content: entry.term,
          level: 2,
        }))}
      />
      {data.map(entry => (
        <>
          <Components.h3 pl={space('extra-loose')} id={slugify(entry.term)}>
            {entry.term}
          </Components.h3>

          <Box
            {...{ width: '100%', maxWidth: '48ch', pl: space(['none', 'none', 'base-loose']) }}
            css={(theme: Theme) =>
              css({
                '& p': {
                  display: 'block',
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                },
                code: {
                  wordBreak: 'break-all',
                },
              })(theme)
            }
          >
            {hydrate(entry.definition, {
              components: Components,
            })}
          </Box>
        </>
      ))}
    </>
  );
};

import * as fs from 'fs';
import renderToString from 'next-mdx-remote/render-to-string';

export const convertClarityJSRefToMdx = async (lib: string) => {
  const libKey = 'clarity-js';
  const md = fs.readFileSync(`./src/_data/${libKey}/globals.md`);

  const mdxSource = await renderToString(md.toString(), { components: {} });

  const globals = {
    content: mdxSource,
    headings: [{ content: 'Globals', level: 1 }],
  };

  return Promise.resolve({
    props: {
      mdx: {
        globals,
      },
    },
  });
};

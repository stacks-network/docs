import * as fs from 'fs';
import renderToString from 'next-mdx-remote/render-to-string';

export const convertClarityJSRefToMdx = async () => {
  const md = fs.readFileSync('./src/_data/clarity-js/globals.md');

  const mdxSource = await renderToString(md.toString(), { components: {} });

  const classFiles = fs.readdirSync('./src/_data/clarity-js/classes');

  const _classes = classFiles.map(file => `### ${file}`).join('\n');
  const classesSource = await renderToString(_classes, { components: {} });

  const globals = {
    content: mdxSource,
    headings: [{ content: 'Globals', level: 1 }],
  };

  const classes = {
    content: classesSource,
    headings: classFiles.map(f => {
      return { content: `${f}`, level: 1 };
    }),
  };

  return Promise.resolve({
    props: {
      mdx: {
        globals,
        classes,
      },
    },
  });
};

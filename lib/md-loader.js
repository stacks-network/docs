const fm = require('gray-matter');
const remark = require('remark');
const strip = require('strip-markdown');
const readingTime = require('reading-time');

const getReadingTime = mdxContent => readingTime(mdxContent);

const getHeadings = mdxContent => {
  const regex = /\n(#+)(.*)/gm;
  const found = mdxContent.match(regex);
  const getLevel = string => string.split('#');
  const headings =
    found && found.length
      ? found.map(f => {
          const md = f.split('# ')[1];
          let content = md;
          remark()
            .use(strip)
            .process(md, (err, file) => {
              if (err) throw err;
              content = file.contents.toString().trim();
            });
          const level = getLevel(f).length;
          return { content, level };
        })
      : [];
  return headings;
};

// makes mdx in next.js suck less by injecting necessary exports so that
// the docs are still readable on github
// (Shamelessly stolen from Expo.io docs)
// @see https://github.com/expo/expo/blob/master/docs/common/md-loader.js
module.exports = async function (src) {
  const callback = this.async();
  const { content, data } = fm(src);
  const headings = getHeadings(content);
  const duration = getReadingTime(content).text;
  const code =
    `import { MDWrapper } from '@components/layouts/markdown-wrapper';
export const frontmatter = ${JSON.stringify({ duration, ...data, headings })};
const Layout = ({ children, ...props }) => (
  <MDWrapper frontmatter={frontmatter} {...props}>{children}</MDWrapper>
)
export default Layout;

` + content;

  return callback(null, code);
};

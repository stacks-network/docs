const fm = require('gray-matter');
const remark = require('remark');
const strip = require('strip-markdown');

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

// @see https://github.com/expo/expo/blob/master/docs/common/md-loader.js
async function mdxFrontmatterLoader(src) {
  const callback = this.async();
  const { content, data } = fm(src);
  const headings = getHeadings(content);
  const code =
    `import { MDWrapper } from '@components/mdx/markdown-wrapper';
export default function Layout({ children, ...props }){
  return (
    <MDWrapper frontmatter={${JSON.stringify({
      ...data,
      headings,
    })}} {...props}>
      {children}
    </MDWrapper>
)
}

` + content;

  return callback(null, code);
}

module.exports = mdxFrontmatterLoader;

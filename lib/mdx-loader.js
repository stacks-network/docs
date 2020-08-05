const { getOptions } = require('loader-utils');
const mdx = require('@mdx-js/mdx');
const fm = require('gray-matter');
const remark = require('remark');
const strip = require('strip-markdown');
const readingTime = require('reading-time');

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`;

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

const layoutPropsString = `const layoutProps = {`;
const newLayoutPropsString = frontmatter => `const layoutProps = {
  frontmatter: ${frontmatter},\n`;

const withFrontmatter = (code, frontmatter) =>
  code.replace(layoutPropsString, newLayoutPropsString(frontmatter));

const loader = async function (src) {
  const callback = this.async();
  const options = Object.assign({}, getOptions(this), {
    filepath: this.resourcePath,
  });

  const { content, data } = fm(src);
  const headings = getHeadings(content);
  const duration = getReadingTime(content).text;
  const frontmatter = JSON.stringify({ duration, ...data, headings });

  let result;

  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err);
  }

  const { renderer = DEFAULT_RENDERER } = options;

  const code = withFrontmatter(`${renderer}\n${result}`, frontmatter);

  return callback(null, code);
};

module.exports = loader;

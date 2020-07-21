import { MDXComponents } from '@components/mdx/mdx-components';
import renderToString from 'next-mdx-remote/render-to-string';

const remarkPlugins = [
  require('remark-squeeze-paragraphs'),
  require('remark-external-links'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-unwrap-images'),
  require('remark-normalize-headings'),
  require('remark-slug'),
];

export const wrapValueInTicks = value => '`' + value.replace('`', '').replace('`', '') + '`';

export const convertRemoteDataToMDX = async (arr: any[], key: string) =>
  Promise.all(arr.map(entry => renderToString(entry[key], MDXComponents, { remarkPlugins })));

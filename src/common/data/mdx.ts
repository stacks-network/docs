import { MDXComponents } from '@components/mdx/mdx-components';
import renderToString from 'next-mdx-remote/render-to-string';
const { remarkPlugins } = require('../../../lib/remark-plugins');

export const wrapValueInTicks = value => '`' + value.replace('`', '').replace('`', '') + '`';

export const convertRemoteDataToMDX = async (arr: any[], key: string) =>
  Promise.all(arr.map(entry => renderToString(entry[key], MDXComponents, { remarkPlugins })));

export const renderMdx = async (content: string) =>
  renderToString(content, MDXComponents, { remarkPlugins });

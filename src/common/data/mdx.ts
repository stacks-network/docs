import { Components } from '@components/mdx/mdx-components';
import renderToString from 'next-mdx-remote/render-to-string';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { remarkPlugins } = require('../../../lib/remark-plugins');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { rehypePlugins } = require('../../../lib/rehype-plugins');

// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
export const wrapValueInTicks = value => '`' + value.replace('`', '').replace('`', '') + '`';

const mdxOptions = {
  remarkPlugins,
  rehypePlugins,
};

const renderToStringOptions = { components: Components, mdxOptions };

export const convertRemoteDataToMDX = async (arr: any[], key: string) =>
  Promise.all(arr.map(entry => renderToString(entry[key], renderToStringOptions)));

export const renderMdx = async (content: string): Promise<any> =>
  renderToString(content, renderToStringOptions) as Promise<any>;

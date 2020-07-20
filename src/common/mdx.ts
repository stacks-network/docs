import { MDXComponents } from '@components/mdx/mdx-components';
import { cliReferenceData } from '@common/_data/cliRef';
import renderToString from 'next-mdx-remote/render-to-string';
import CLARITY_REFERENCE from '@common/_data/clarityRef.json';

export const wrapValueInTicks = value => '`' + value.replace('`', '').replace('`', '') + '`';

export const convertRemoteDataToMDX = async (arr: any[], key: string) =>
  Promise.all(arr.map(entry => renderToString(entry[key], MDXComponents)));

export const convertBlockstackCLIUsageToMdx = async () => {
  const results = await convertRemoteDataToMDX(cliReferenceData, 'usage');
  return {
    props: {
      mdx: results,
    },
  };
};

export const convertClarityRefUsageToMdx = async () => {
  const [_functions, _keywords] = await Promise.all([
    convertRemoteDataToMDX(CLARITY_REFERENCE.functions, 'description'),
    convertRemoteDataToMDX(CLARITY_REFERENCE.keywords, 'description'),
  ]);

  const functions = CLARITY_REFERENCE.functions.map((fn, index) => ({
    ...fn,
    description: _functions[index],
  }));

  const keywords = CLARITY_REFERENCE.keywords.map((fn, index) => ({
    ...fn,
    description: _keywords[index],
  }));

  return {
    props: {
      mdx: {
        functions,
        keywords,
      },
    },
  };
};

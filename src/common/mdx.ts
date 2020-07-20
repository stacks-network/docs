import { MDXComponents } from '@components/mdx/mdx-components';
import { cliReferenceData } from '@common/_data/cliRef';
import renderToString from 'next-mdx-remote/render-to-string';
import CLARITY_REFERENCE from '@common/_data/clarityRef.json';
import FAQ_JSON from '@common/_data/faqs.json';
import TurndownService from 'turndown';

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

export const convertFaqAnswersToMDX = async () => {
  const turndownService = new TurndownService();
  // we convert html to markdown so we can process it with remark,
  // eg external links open in new window
  const md = FAQ_JSON.faqs.map(faq => ({
    ...faq,
    answer: turndownService.turndown(faq.answer),
  }));
  // convert it to MDX with next-mdx-remote
  const answers = await convertRemoteDataToMDX(md, 'answer');
  const faqs = FAQ_JSON.faqs.map((faq, index) => ({
    ...faq,
    answer: answers[index],
  }));

  return {
    props: {
      mdx: faqs,
    },
  };
};

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

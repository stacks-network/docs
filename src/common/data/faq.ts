import { convertRemoteDataToMDX } from '@common/data/mdx';

import FAQ_JSON from '../../_data/faqs.json';
import TurndownService from 'turndown';

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

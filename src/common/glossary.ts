const csv = require('csvtojson');
import TurndownService from 'turndown';
import { convertRemoteDataToMDX } from '@common/mdx';

export const convertGlossaryToJson = async () => {
  const turndownService = new TurndownService();
  const data = await csv().fromFile('./src/common/_data/glossary.csv');
  const formatted = data
    .filter(entry => entry.Term !== '')
    .map(entry => ({
      term: entry['Term'],
      definition: entry['Definition'],
    }));
  // we convert html to markdown so we can process it with remark,
  // eg external links open in new window
  const md = formatted.map(entry => ({
    ...entry,
    definition: turndownService.turndown(entry.definition),
  }));

  const definitions = await convertRemoteDataToMDX(md, 'definition');

  const final = md.map((entry, index) => ({
    ...entry,
    definition: definitions[index],
  }));
  return {
    props: {
      glossary: final,
    },
  };
};

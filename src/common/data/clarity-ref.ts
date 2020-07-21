import { convertRemoteDataToMDX } from '@common/data/mdx';
import CLARITY_REFERENCE from '../../_data/clarityRef.json';

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

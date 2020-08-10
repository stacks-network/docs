import { convertRemoteDataToMDX } from '@common/data/mdx';
import cliReferenceData from '../../_data/cli-reference.json';

export const convertBlockstackCLIUsageToMdx = async () => {
  const transformed = cliReferenceData.map(entry => {
    return {
      ...entry,
    };
  });
  const results = await convertRemoteDataToMDX(transformed, 'usage');

  return {
    props: {
      mdx: results,
    },
  };
};

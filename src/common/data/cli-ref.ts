import { convertRemoteDataToMDX } from '@common/data/mdx';
import { cliReferenceData } from '../../_data/cliRef';

export const convertBlockstackCLIUsageToMdx = async () => {
  const results = await convertRemoteDataToMDX(cliReferenceData, 'usage');
  return {
    props: {
      mdx: results,
    },
  };
};

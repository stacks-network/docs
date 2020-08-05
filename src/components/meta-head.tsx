import React from 'react';

import Head from 'next/head';
import { useFaviconName } from '@common/hooks/use-favicon';

export const Meta: React.FC<any> = props => {
  const filename = useFaviconName();
  return (
    <Head>
      <link rel="icon" type="image/svg+xml" href={`/${filename}`} />
    </Head>
  );
};

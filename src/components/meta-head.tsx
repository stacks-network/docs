import React from 'react';

import Head from 'next/head';
import { useFaviconName } from '@common/hooks/use-favicon';

export const MetaLabels = ({ labels }: any) => {
  return labels?.length ? (
    <Head>
      {labels.map(({ label, data }, key: number) => (
        <React.Fragment key={key}>
          <meta
            name={`twitter:label${key + 1}`}
            // @ts-ignore
            content={label}
          />
          <meta
            name={`twitter:data${key + 1}`}
            // @ts-ignore
            content={data}
          />
        </React.Fragment>
      ))}
    </Head>
  ) : null;
};

export const Meta: React.FC<any> = () => {
  const filename = useFaviconName();
  return (
    <Head>
      <link rel="icon" type="image/svg+xml" href={`/${filename}`} />
      <meta property="og:image" content="/images/og_image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Stacks Docs" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@blockstack" />
      <meta name="twitter:creator" content="@blockstack" />
    </Head>
  );
};

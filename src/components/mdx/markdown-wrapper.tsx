import React from 'react';
import { MDContents } from '@components/mdx/md-contents';
import Head from 'next/head';
import { getTitle } from '@common/utils';
import { PageTop } from '@components/page-top';

const defaultFrontmatter = {
  headings: [],
  description:
    'Blockstack is an open-source and developer-friendly network for building decentralized apps and smart contracts.',
};

export const MDWrapper: React.FC<any> = React.memo(
  ({ frontmatter = defaultFrontmatter, dynamicHeadings = [], ...props }) => {
    const { headings, description } = frontmatter;

    return (
      <>
        <Head>
          <title>{getTitle(frontmatter)} | Blockstack</title>
          <meta name="description" content={description} />
        </Head>
        <MDContents
          pageTop={() => <PageTop {...frontmatter} />}
          headings={[...headings, ...dynamicHeadings]}
        >
          {props.children}
        </MDContents>
      </>
    );
  }
);

export default MDWrapper;

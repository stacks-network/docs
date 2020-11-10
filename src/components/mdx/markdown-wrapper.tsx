import React from 'react';
import { MDContents } from '@components/mdx/md-contents';
import Head from 'next/head';
import { capitalize, getTitle } from '@common/utils';
import { PageTop } from '@components/page-top';
import { MetaLabels } from '@components/meta-head';

const defaultFrontmatter = {
  headings: [],
  description:
    'Stacks is an open-source and developer-friendly network for building decentralized apps and smart contracts.',
};

export const MDWrapper: React.FC<any> = React.memo(
  ({ frontmatter = defaultFrontmatter, dynamicHeadings = [], ...props }) => {
    const { headings, description } = frontmatter;

    const labels = [
      frontmatter.experience
        ? {
            label: 'Experience',
            data: capitalize(frontmatter.experience),
          }
        : undefined,
      frontmatter.duration
        ? {
            label: 'Duration',
            data: frontmatter.duration,
          }
        : undefined,
    ].filter(item => item);

    return (
      <>
        <Head>
          <title>{getTitle(frontmatter)} | Stacks</title>
          <meta name="description" content={description} />
        </Head>
        <MetaLabels labels={labels} />
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

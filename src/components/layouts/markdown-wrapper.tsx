import React from 'react';
import { MDContents } from '@components/mdx/md-contents';
import Head from 'next/head';
const getTitle = ({ title, headings }) => title || (headings?.length && headings[0].content);
export const MDWrapper = ({ frontmatter, dynamicHeadings = [], ...props }) => {
  const { headings, description } = frontmatter;
  return (
    <>
      <Head>
        <title>{getTitle(frontmatter)} | Blockstack</title>
        <meta name="description" content={description} />
      </Head>
      <MDContents headings={[...headings, ...dynamicHeadings]}>{props.children}</MDContents>
    </>
  );
};

export default MDWrapper;

import React from 'react';
import { Contents } from '@components/layouts/docs-layout';
import Head from 'next/head';
export const Layout = ({ meta, ...props }) => {
  const {
    title,
    description = 'The Blockstack design system, built with React and styled-system.',
    headings,
  } = meta;
  return (
    <>
      <Head>
        <title>{title || (headings?.length && headings[0].content)} | Blockstack Docs</title>
        <meta name="description" content={description} />
      </Head>
      <Contents headings={headings}>{props.children}</Contents>
    </>
  );
};

export default Layout;

import React from 'react';
import { Components } from '@components/mdx';
import hydrate from 'next-mdx-remote/hydrate';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MDContents } from '@components/mdx/md-contents';
import { PageTop } from '@components/page-top';
import * as fs from 'fs';
import renderToString from 'next-mdx-remote/render-to-string';
import stacksLibs from '_data/libs.json';

export const getStaticPaths = () => {
  const libKeys = [];
  Object.keys(stacksLibs).forEach(libKey => {
    const lib = stacksLibs[libKey];
    libKeys.push(libKey);
  });
  return {
    paths: libKeys.map(libKey => {
      return { params: { lib: libKey } };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const libPath = stacksLibs[params.lib].path;
  const md = fs.readFileSync(`./src/_data/${libPath}/globals.md`);
  const mdxSource = await renderToString(md.toString(), { components: Components });
  return {
    props: {
      mdx: mdxSource,
    },
  };
};

const LibIndexPage = props => {
  const router = useRouter();
  const module = router.query.module as string;
  const lib = router.query.lib as string;
  return (
    <>
      <Head>
        <title>{module} | Blockstack</title>
        <meta name="description" content={module} />
      </Head>
      <MDContents pageTop={() => <PageTop title={module} description={module} />} headings={[]}>
        {hydrate(props.mdx, { components: Components })}
      </MDContents>
    </>
  );
};

export default LibIndexPage;

import React from 'react';
import { Components } from '@components/mdx';
import hydrate from 'next-mdx-remote/hydrate';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MDContents } from '@components/mdx/md-contents';
import { PageTop } from '@components/page-top';
import * as fs from 'fs';
import renderToString from 'next-mdx-remote/render-to-string';

export const getStaticPaths = () => {
  const files = fs.readdirSync('./src/_data/clarity-js/enums');
  return {
    paths: files.map(file => {
      return { params: { enumName: file } };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const md = fs.readFileSync(`./src/_data/clarity-js/enums/${params.enumName}`);
  const mdxSource = await renderToString(md.toString(), {
    components: Components,
  });
  return {
    props: {
      mdx: mdxSource,
    },
  };
};

const InterfacePage = props => {
  const router = useRouter();
  const enumName = router.query.enumName as string;
  return (
    <>
      <Head>
        <title>{enumName} | Blockstack</title>
        <meta name="description" content={enumName} />
      </Head>
      <MDContents pageTop={() => <PageTop title={enumName} description={enumName} />} headings={[]}>
        {hydrate(props.mdx, { components: Components })}
      </MDContents>
    </>
  );
};

export default InterfacePage;

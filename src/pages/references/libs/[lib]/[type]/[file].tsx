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

const types = ['classes', 'enums', 'interfaces', 'modules'];

export const getStaticPaths = () => {
  let paths = [];

  Object.keys(stacksLibs).forEach(libKey => {
    const lib = stacksLibs[libKey];
    types.forEach(type => {
      const files = fs.readdirSync(`./src/_data/${lib.path}/${type}`);
      paths = paths.concat(
        files.map(file => {
          return { params: { file: file, lib: libKey, type } };
        })
      );
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const lib = stacksLibs[params.lib];
  const type = params.type;
  const file = params.file;
  const md = fs.readFileSync(`./src/_data/${lib.path}/${type}/${file}`);
  const mdxSource = await renderToString(md.toString(), { components: Components });
  return {
    props: {
      mdx: mdxSource,
    },
  };
};

const LibFilePage = props => {
  const router = useRouter();
  const file = router.query.file as string;
  const type = router.query.type as string;
  const lib = router.query.lib as string;
  return (
    <>
      <Head>
        <title>{file} | Blockstack</title>
        <meta name="description" content={file} />
      </Head>
      <MDContents pageTop={() => <PageTop title={file} description={file} />} headings={[]}>
        {hydrate(props.mdx, { components: Components })}
      </MDContents>
    </>
  );
};

export default LibFilePage;

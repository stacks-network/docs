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

const typeExists = (lib, type) => {
  return fs.existsSync(`./src/_data/${lib.path}/${type}`);
};

export const getStaticPaths = () => {
  const paths = [];

  Object.keys(stacksLibs).forEach(libKey => {
    const lib = stacksLibs[libKey];
    types.forEach(type => {
      if (typeExists(lib, type)) {
        paths.push({ params: { lib: libKey, type } });
      }
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

  const files = fs.readdirSync(`./src/_data/${lib.path}/${type}`);

  const _files = files
    .map(file => `### [${file}](/references/libs/${lib.path}/${type}/${file})`)
    .join('\n');
  const fileSource = await renderToString(_files, { components: {} });

  return {
    props: {
      mdx: fileSource,
    },
  };
};

const LibTypeIndexPage = props => {
  const router = useRouter();
  const type = router.query.type as string;
  const lib = router.query.lib as string;
  return (
    <>
      <Head>
        <title>
          {lib} | {type}| Blockstack
        </title>
        <meta name="description" content={`${lib}|${type}`} />
      </Head>
      <div>
        {type} {lib}
      </div>
      <MDContents pageTop={() => <PageTop title={lib} description={type} />} headings={[]}>
        {hydrate(props.mdx, { components: Components })}
      </MDContents>
    </>
  );
};

export default LibTypeIndexPage;

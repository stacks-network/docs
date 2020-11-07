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
  const files = fs.readdirSync('./src/_data/clarity-js/interfaces');
  return {
    paths: files.map(file => {
      return { params: { interfaceName: file } };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const md = fs.readFileSync(`./src/_data/clarity-js/interfaces/${params.interfaceName}`);
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
  const interfaceName = router.query.interface as string;
  return (
    <>
      <Head>
        <title>{interfaceName} | Blockstack</title>
        <meta name="description" content={interfaceName} />
      </Head>
      <MDContents
        pageTop={() => <PageTop title={interfaceName} description={interfaceName} />}
        headings={[]}
      >
        {hydrate(props.mdx, { components: Components })}
      </MDContents>
    </>
  );
};

export default InterfacePage;

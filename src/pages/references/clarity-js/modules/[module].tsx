import React from 'react';
import { Components } from '@components/mdx';
import { Box, Flex, ChevronIcon, space, color, Grid } from '@stacks/ui';
import hydrate from 'next-mdx-remote/hydrate';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { border } from '@common/utils';
import { css } from '@stacks/ui-core';
import { useRouter } from 'next/router';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { BackButton } from '@components/back-button';
import Head from 'next/head';
import { MDContents } from '@components/mdx/md-contents';
import { slugify, getSlug } from '@common/utils';
import { PageTop } from '@components/page-top';
import { getBetterNames } from '@common/utils/faqs';
import * as fs from 'fs';
import renderToString from 'next-mdx-remote/render-to-string';

export const getStaticPaths = () => {
  const files = fs.readdirSync('./src/_data/clarity-js/modules');
  return {
    paths: files.map(file => {
      return { params: { module: file } };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const md = fs.readFileSync(`./src/_data/clarity-js/modules/${params.module}`);
  const mdxSource = await renderToString(md.toString(), { components: Components });
  return {
    props: {
      mdx: mdxSource,
    },
  };
};

const ModulePage = props => {
  const router = useRouter();
  const module = router.query.module as string;
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

export default ModulePage;

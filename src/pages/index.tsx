import React from 'react';
import Head from 'next/head';
import { HomeLayout } from '@components/layouts/home';
import { Hero } from '@components/home/sections/hero';

const Homepage = () => (
  <>
    <Head>
      <title>Blockstack Docs</title>
    </Head>
    <HomeLayout>
      <Hero />
    </HomeLayout>
  </>
);

export default Homepage;

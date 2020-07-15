import React from 'react';
import Head from 'next/head';
import { HomeLayout } from '@components/layouts/home';
import { Hero } from '@components/home/sections/hero';
import { AtomAltIcon } from '@components/icons/atom-alt';
import { BoxIcon } from '@components/icons/box';
import { EditIcon } from '@components/icons/edit';

interface Card {
  title: string;
  subtitle: string;
  href: string;
  icon: React.FC<any>;
}

const cards = [
  {
    title: 'Build an app',
    subtitle: 'Start building your own decentralized app.',
    href: '/browser/todo-list',
    icon: AtomAltIcon,
  },
  {
    title: 'Write a smart contract',
    subtitle: 'Learn how to write your contract in the Clarity language.',
    href: '/core/smart/overview',
    icon: AtomAltIcon,
  },
  {
    title: 'Stacks blockchain',
    subtitle: 'Learn how to work with nodes, namespaces, zone files, and other advanced topics.',
    href: '/core/naming/introduction',
    icon: AtomAltIcon,
  },
  {
    title: 'Gaia storage',
    subtitle: 'Learn about storage, interactions between developer APIs, and the Gaia service.',
    href: '/storage/overview',
    icon: AtomAltIcon,
  },
  {
    title: 'Evaluate the ecosystem',
    subtitle:
      'Learn the components that make up the Blockstack Ecosystem. Understand the value a blockchain offers.',
    href: '/org/overview',
    icon: AtomAltIcon,
  },
  {
    title: 'Join the community',
    subtitle: 'View upcoming events and become a contributor or evangelist.',
    href: '/common/community_ref',
    icon: AtomAltIcon,
  },
];

const Homepage = () => (
  <>
    <Head>
      <title>Blockstack Docs</title>
    </Head>
    <HomeLayout>
      <Hero cards={cards} />
    </HomeLayout>
  </>
);

export async function getStaticProps(context) {
  return {
    props: {
      isHome: true,
    }, // will be passed to the page component as props
  };
}

export default Homepage;

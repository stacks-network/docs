import React from 'react';
import Head from 'next/head';
import { Hero } from '@components/home/sections/hero';
import { AtomAltIcon } from '@components/icons/atom-alt';
import { CodeIcon } from '@components/icons/code';
import { AppsIcon } from '@components/icons/apps';
import { StackIcon } from '@components/icons/stack';
import { WorldIcon } from '@components/icons/world';
import { ServerIcon } from '@components/icons/server';

const cards = [
  {
    title: 'Build an app',
    subtitle: 'Start building your own decentralized app.',
    href: '/browser/todo-list',
    icon: AppsIcon,
  },
  {
    title: 'Write a smart contract',
    subtitle: 'Learn how to write your contract in the Clarity language.',
    href: '/core/smart/overview',
    icon: CodeIcon,
  },
  {
    title: 'Stacks blockchain',
    subtitle: 'Learn how to work with nodes, namespaces, zone files, and other advanced topics.',
    href: '/core/naming/introduction',
    icon: StackIcon,
  },
  {
    title: 'Gaia storage',
    subtitle: 'Learn about storage, interactions between developer APIs, and the Gaia service.',
    href: '/storage/overview',
    icon: ServerIcon,
  },
  {
    title: 'Evaluate the ecosystem',
    subtitle:
      'Learn the components that make up the Blockstack Ecosystem. Understand the value a blockchain offers.',
    href: '/org/overview',
    icon: WorldIcon,
  },
  {
    title: 'Join the community',
    subtitle: 'View upcoming events and become a contributor or evangelist.',
    href: '/common/community_ref',
    icon: AtomAltIcon,
  },
];

const Homepage = () => {
  return (
    <>
      <Head>
        <title>Documentation | Blockstack</title>
      </Head>
      <Hero cards={cards} />
    </>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      isHome: true,
    }, // will be passed to the page component as props
  };
}

export default Homepage;

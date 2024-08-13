import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '786'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'aa8'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '13c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '1b1'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'bf3'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '94a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '616'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '78e'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '511'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', 'bb7'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'e17'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'a16'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '65e'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', 'd05'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '44f'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '9a2'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', 'a14'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'ddf'),
    exact: true
  },
  {
    path: '/docs/tags',
    component: ComponentCreator('/docs/tags', 'b9e'),
    exact: true
  },
  {
    path: '/docs/tags/clarity',
    component: ComponentCreator('/docs/tags/clarity', '6c5'),
    exact: true
  },
  {
    path: '/docs/tags/gaia',
    component: ComponentCreator('/docs/tags/gaia', '7c0'),
    exact: true
  },
  {
    path: '/docs/tags/tutorial',
    component: ComponentCreator('/docs/tags/tutorial', '8a2'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '4f4'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'f6f'),
    routes: [
      {
        path: '/docs/category/noteworthy-contracts',
        component: ComponentCreator('/docs/category/noteworthy-contracts', 'ae0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/services-using-stacks',
        component: ComponentCreator('/docs/category/services-using-stacks', '355'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/',
        component: ComponentCreator('/docs/clarity/', '018'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/crash-course',
        component: ComponentCreator('/docs/clarity/crash-course', 'e55'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/language-functions',
        component: ComponentCreator('/docs/clarity/language-functions', 'fac'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/language-keywords',
        component: ComponentCreator('/docs/clarity/language-keywords', '214'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/language-types',
        component: ComponentCreator('/docs/clarity/language-types', '4aa'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/noteworthy-contracts/bns-contract',
        component: ComponentCreator('/docs/clarity/noteworthy-contracts/bns-contract', '12b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/noteworthy-contracts/stacking-contract',
        component: ComponentCreator('/docs/clarity/noteworthy-contracts/stacking-contract', '67f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/noteworthy-contracts/xbtc',
        component: ComponentCreator('/docs/clarity/noteworthy-contracts/xbtc', 'eda'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/sample-contracts',
        component: ComponentCreator('/docs/clarity/sample-contracts', '382'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/security/',
        component: ComponentCreator('/docs/clarity/security/', '41f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/clarity/security/decidable',
        component: ComponentCreator('/docs/clarity/security/decidable', 'f05'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contribute/',
        component: ComponentCreator('/docs/contribute/', '81a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contribute/docs',
        component: ComponentCreator('/docs/contribute/docs', 'd33'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contribute/translations',
        component: ComponentCreator('/docs/contribute/translations', '516'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/',
        component: ComponentCreator('/docs/cookbook/', 'ec1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/creating-an-ft',
        component: ComponentCreator('/docs/cookbook/creating-an-ft', 'e62'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/creating-an-nft',
        component: ComponentCreator('/docs/cookbook/creating-an-nft', '67a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/get-sats-per-stx',
        component: ComponentCreator('/docs/cookbook/get-sats-per-stx', '0f5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/parse-a-btc-tx',
        component: ComponentCreator('/docs/cookbook/parse-a-btc-tx', '28c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/post-conditions',
        component: ComponentCreator('/docs/cookbook/post-conditions', 'd5e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/sending-bitcoin-with-hiro-wallet',
        component: ComponentCreator('/docs/cookbook/sending-bitcoin-with-hiro-wallet', 'bc0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/stacks-js-auth',
        component: ComponentCreator('/docs/cookbook/stacks-js-auth', '343'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/stacks-js-sending-transactions',
        component: ComponentCreator('/docs/cookbook/stacks-js-sending-transactions', 'a7f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cookbook/verifying-a-btc-tx-was-mined',
        component: ComponentCreator('/docs/cookbook/verifying-a-btc-tx-was-mined', 'bbf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/',
        component: ComponentCreator('/docs/gaia/', 'b3f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/configuration',
        component: ComponentCreator('/docs/gaia/configuration', 'b3d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/deploy-gaia-hub',
        component: ComponentCreator('/docs/gaia/deploy-gaia-hub', '3a2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/gaia-on-ec2',
        component: ComponentCreator('/docs/gaia/gaia-on-ec2', 'ff0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/setup-linux',
        component: ComponentCreator('/docs/gaia/setup-linux', 'cce'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/gaia/setup-mac',
        component: ComponentCreator('/docs/gaia/setup-mac', '1a8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/glossary/',
        component: ComponentCreator('/docs/glossary/', '9ea'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/',
        component: ComponentCreator('/docs/nakamoto/', '9b9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/bitcoin-mev-mitigation',
        component: ComponentCreator('/docs/nakamoto/bitcoin-mev-mitigation', '6fc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/block-production',
        component: ComponentCreator('/docs/nakamoto/block-production', 'bd2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/clarity-wasm',
        component: ComponentCreator('/docs/nakamoto/clarity-wasm', '569'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/neon',
        component: ComponentCreator('/docs/nakamoto/neon', '4c5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nakamoto/signer',
        component: ComponentCreator('/docs/nakamoto/signer', 'eb7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/next-steps/',
        component: ComponentCreator('/docs/next-steps/', 'c6b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/',
        component: ComponentCreator('/docs/nodes-and-miners/', '8e2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/digitalocean',
        component: ComponentCreator('/docs/nodes-and-miners/digitalocean', '7c4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/hosted-nodes',
        component: ComponentCreator('/docs/nodes-and-miners/hosted-nodes', '238'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/miner-costs-and-fees',
        component: ComponentCreator('/docs/nodes-and-miners/miner-costs-and-fees', '942'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/miner-mainnet',
        component: ComponentCreator('/docs/nodes-and-miners/miner-mainnet', '8a9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/miner-testnet',
        component: ComponentCreator('/docs/nodes-and-miners/miner-testnet', '060'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/quicknode',
        component: ComponentCreator('/docs/nodes-and-miners/quicknode', 'ace'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/run-a-node',
        component: ComponentCreator('/docs/nodes-and-miners/run-a-node', 'b2d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/stacks-node-configuration',
        component: ComponentCreator('/docs/nodes-and-miners/stacks-node-configuration', '1f4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/nodes-and-miners/verify-miner',
        component: ComponentCreator('/docs/nodes-and-miners/verify-miner', 'f75'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/services-using-stacks/defi',
        component: ComponentCreator('/docs/services-using-stacks/defi', '7b9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/services-using-stacks/more',
        component: ComponentCreator('/docs/services-using-stacks/more', '502'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/services-using-stacks/nft',
        component: ComponentCreator('/docs/services-using-stacks/nft', '183'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/services-using-stacks/stacks-info-sites',
        component: ComponentCreator('/docs/services-using-stacks/stacks-info-sites', '191'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/services-using-stacks/wallets',
        component: ComponentCreator('/docs/services-using-stacks/wallets', 'ead'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/',
        component: ComponentCreator('/docs/stacks-academy/', '5a3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/accounts',
        component: ComponentCreator('/docs/stacks-academy/accounts', 'e46'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/authentication',
        component: ComponentCreator('/docs/stacks-academy/authentication', '30a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/bns',
        component: ComponentCreator('/docs/stacks-academy/bns', '168'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/btc-connection',
        component: ComponentCreator('/docs/stacks-academy/btc-connection', '09b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/microblocks',
        component: ComponentCreator('/docs/stacks-academy/microblocks', '5cf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/mining',
        component: ComponentCreator('/docs/stacks-academy/mining', '099'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/network',
        component: ComponentCreator('/docs/stacks-academy/network', '19f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/post-conditions',
        component: ComponentCreator('/docs/stacks-academy/post-conditions', '6df'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/proof-of-transfer',
        component: ComponentCreator('/docs/stacks-academy/proof-of-transfer', '876'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/sips',
        component: ComponentCreator('/docs/stacks-academy/sips', '5bf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/stacking',
        component: ComponentCreator('/docs/stacks-academy/stacking', '029'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/stacks-blockchain-api',
        component: ComponentCreator('/docs/stacks-academy/stacks-blockchain-api', 'cee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/technical-specs',
        component: ComponentCreator('/docs/stacks-academy/technical-specs', 'b7a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/testnet',
        component: ComponentCreator('/docs/stacks-academy/testnet', '05d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/transactions',
        component: ComponentCreator('/docs/stacks-academy/transactions', '049'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/what-is-stacks',
        component: ComponentCreator('/docs/stacks-academy/what-is-stacks', 'f7a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/stacks-academy/whitepapers',
        component: ComponentCreator('/docs/stacks-academy/whitepapers', '191'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorials/',
        component: ComponentCreator('/docs/tutorials/', '159'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorials/community-tutorials',
        component: ComponentCreator('/docs/tutorials/community-tutorials', '86f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorials/hello-stacks',
        component: ComponentCreator('/docs/tutorials/hello-stacks', 'a64'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorials/satoshis-ridge',
        component: ComponentCreator('/docs/tutorials/satoshis-ridge', 'd44'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'de3'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

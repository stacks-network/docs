// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Stacks Docs',
  tagline: 'Stacks Documentation rocks!',
  url: 'https://docs.stacks.co',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-dark.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'stacks-network', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'id'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/stacks-network/docs/tree/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/stacks-network/docs/tree/master/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Stacks Documentation',
        logo: {
          alt: 'My Site Logo',
          //src: 'img/favicon-dark.svg',
          src: 'img/stacks_with_interior_white_exterior_transparent.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Main',
          },
          /*
          {to: '/blog', label: 'Blog', position: 'left'},
          */
          {
            href: 'https://github.com/stacks-network/docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Main docs',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://forum.stacks.org/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/5DJaBrf',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/stacks',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/stacks-network/docs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://stacks.org/blog',
              },
              {
                label: 'Translations',
                href: 'https://crowdin.com/project/docsstacksco',
              },
              {
                label: 'Mailing List',
                href: 'https://stacks.org/updates',
              },
              {
                label: 'Youtube',
                href: 'https://www.youtube.com/channel/UC3J2iHnyt2JtOvtGVf_jpHQ',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Stacks Open Internet Foundation.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      //Algolio docsearch support
      algolia: {
        // The application ID provided by Algolia
        appId: "YRIGH3WCGU",
  
        // Public API key: it is safe to commit it
        apiKey: '8e46f26b8360e5030da62471366bac29',
  
        indexName: 'stacks',
  
        // Optional: see doc section below
        contextualSearch: true,
  
        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        //externalUrlRegex: 'external\\.com|domain\\.com',
  
        // Optional: Algolia search parameters
        //searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
      },
    }),

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        /*
        fromExtensions: ["html"],
        createRedirects: function (path) {
          // redirect to /docs from /docs/introduction,
          // as introduction has been made the home doc
          if (allDocHomesPaths.includes(path)) {
            return [`${path}/introduction`];
          }
        },
        */
       // REDIRECTING OLDER URLS THAT ARE NO LONGER VALID TO THE BEST POSSIBLE MATCH
        redirects: [
          {
            from: [
                '/ecosystem',
                '/references/stacks-blockchain',
                '/stacks-wallet',
                '/common/core_ref.html',
                '/org/overview.html',
                '/org/token.html',
            ],
            to: '/docs/intro',
          },
          {
            from: [
              '/noteworthy-contracts/bns-contract',
              '/references/bns-contract',
            ],
            to: '/docs/noteworthy-contracts/bns-contract',
          },
          {
            from: [
              '/noteworthy-contracts/stacking-contract',
              '/references/stacking-contract',
            ],
            to: '/docs/noteworthy-contracts/stacking-contract',
          },
          {
            from: [
              '/nodes-and-miners',
              '/nodes-and-miners/overview',
            ],
            to: '/docs/nodes-and-miners/',
          },
          {
            from: [
              '/nodes-and-miners/stacks-node-configuration',
              '/references/stacks-node-configuration',
            ],
            to: '/docs/nodes-and-miners/stacks-node-configuration',
          },
          {
            from: [
              '/nodes-and-miners/running-testnet-node',
              '/core/smart/testnet-node.html',
              '/stacks-blockchain/testnet-node',
              '/understand-stacks/testnet-node',
              '/understand-stacks/running-testnet-node',
              '/stacks-blockchain/running-testnet-node',
            ],
            to: '/docs/nodes-and-miners/running-testnet-node',
          },
          {
            from: [
              '/nodes-and-miners/running-mainnet-node',
              '/mining',
              '/start-mining',
            ],
            to: '/docs/nodes-and-miners/running-mainnet-node',
          },
          {
            from: [
              '/nodes-and-miners/miner-mainnet',
            ],
            to: '/docs/nodes-and-miners/miner-mainnet',
          },
          {
            from: [
              '/nodes-and-miners/miner-testnet',
            ],
            to: '/docs/nodes-and-miners/miner-testnet',
          },
          {
            from: [
              '/nodes-and-miners/digitalocean',
            ],
            to: '/docs/nodes-and-miners/digitalocean',
          },
          {
            from: [
              '/contribute',
              '/contribute/overview',
              '/ecosystem/contributing',
            ],
            to: '/docs/contribute/',
          },
          {
            from: [
              '/contribute/translations',
            ],
            to: '/docs/contribute/translations',
          },
          {
            from: [
              '/build-apps',
              '/build-apps/overview',
              '/references/deploy-tips',
              '/understand-stacks/integrate-stacking',
              '/understand-stacks/integrate-stacking-delegation',
              '/build-apps/tutorials/todos',
              '/build-apps/tutorials/public-registry',
              '/build-apps/tutorials/angular',
              '/browser/todo-list.html',
              '/develop/zero_to_dapp_1.html',
              '/browser/hello-blockstack.html',
              '/develop/collections.html',
              '/data-storage/collections',
              '/build-an-app',
              '/data-indexing/overview',
              '/data-indexing',
              '/data-indexing/integrate',
            ],
            to: '/docs/build-apps/',
          },
          {
            from: [
              '/build-apps/deploy-tips',
            ],
            to: '/docs/build-apps/deploy-tips',
          },
          {
            from: [
              '/build-apps/nocodeclarity',
            ],
            to: '/docs/build-apps/nocodeclarity',
          },
          {
            from: [
              '/build-apps/references/authentication',
              '/authentication/building-with-angular',
              '/authentication/overview',
              '/docs/build-apps/guides/authentication',
              '/authentication/building-todo-app',
              '/data-storage/authentication',
              '/storage/authentication.html',
              '/develop/connect/get-started.html',
              '/develop/connect/overview.html',
              '/develop/overview_auth.html',
            ],
            to: '/docs/build-apps/references/authentication',
          },
          {
            from: [
              '/build-apps/references/bns',
              '/core/naming/introduction.html',
              '/core/naming/architecture.html',
              '/core/naming/namespaces.html',
              '/core/naming/comparison.html',
              '/core/naming/tutorial_subdomains.html',
              '/core/naming/search.html',
              '/core/naming/pickname.html',
              '/core/naming/creationhowto.html',
              '/core/naming/resolving.html',
              '/core/naming/register.html',
              '/core/naming/manage.html',
              '/core/naming/subdomains.html',
              '/core/naming/forks.html',
              '/naming-services',
              '/naming-system',
              '/naming-services/build-profile-search-index',
              '/technology/naming-system',
              '/naming-services/architecture',
              '/naming-services/choose-name',
              '/naming-services/comparison',
              '/naming-services/create-namespace',
              '/naming-services/did',
              '/naming-services/forks',
              '/naming-services/manage-names',
              '/naming-services/namespaces',
              '/naming-services/overview',
              '/naming-services/register-name',
              '/naming-services/resolve-name',
              '/naming-services/subdomains',
              '/naming-services/subdomains-tutorial',
            ],
            to: '/docs/build-apps/references/bns',
          },
        /*
          {
            from: '/develop/profiles.html',
            to: '/docs/authentication/profiles',
          },
        */
          {
            from: [
              '/write-smart-contracts',
              '/write-smart-contracts/overview',
              '/write-smart-contracts/nft',
              '/stacks-blockchain/local-development',
              '/smart-contracts',
              '/smart-contracts/overview',
              '/smart-contracts/cli-wallet-quickstart',
              '/smart-contracts/hello-world-tutorial',
              '/smart-contracts/counter-tutorial',
              '/smart-contracts/testing-contracts',
              '/core/smart/tutorial.html',
              '/core/smart/tutorial-counter.html',
              '/core/smart/tutorial-test.html',
              '/core/smart/cli-wallet-quickstart.html',
              '/core/smart/overview.html',
              '/develop/connect/use-with-clarity.html',
            ],
            to: '/docs/write-smart-contracts/',
          },
          {
            from: [
              '/write-smart-contracts/principals',
              '/core/smart/principals.html',
              '/smart-contracts/principals',
            ],
            to: '/docs/write-smart-contracts/principals',
          },
          {
            from: '/write-smart-contracts/software',
            to: '/docs/write-smart-contracts/software',
          },
          {
            from: '/write-smart-contracts/tokens',
            to: '/docs/write-smart-contracts/tokens',
          },
          {
            from: [
              '/write-smart-contracts/clarity-language',
              '/write-smart-contracts/language-overview',
              '/core/smart/clarityref',
              '/core/smart/clarityRef.html',
              '/references/clarity-language',
              '/references/language-clarity',
              '/smart-contracts/clarity-values',
            ],
            to: '/docs/write-smart-contracts/clarity-language/',
          },
          {
            from: '/write-smart-contracts/types',
            to: '/docs/write-smart-contracts/clarity-language/language-types',
          },
          {
            from: '/write-smart-contracts/language-keywords',
            to: '/docs/write-smart-contracts/clarity-language/language-keywords',
          },
          {
            from: [
              '/write-smart-contracts/language-functions',
              '/references/language-functions',
            ],
            to: '/docs/write-smart-contracts/clarity-language/language-functions',
          },
          {
            from: [
              '/faq',
              '/faqs/allfaqs',
              '/faqs/allFAQS.html',
              '/core/faq_technical.html',
            ],
            to: '/docs/faq/',
          },
          {
            from: [
              '/understand-stacks',
              '/understand-stacks/overview',
              '/stacks-blockchain',
              '/stacks-blockchain/sending-tokens',
              '/stacks-blockchain/wire-format',
              '/stacks-blockchain/atlas-how-it-works',
              '/stacks-blockchain/atlas-usage',
              '/stacks-blockchain/atlas/overview',
              '/understand-stacks/atlas/overview',
              '/stacks-blockchain/atlas-overview',
              '/stacks-blockchain/atlas/how-atlas-works',
              '/understand-stacks/atlas/how-atlas-works',
              '/stacks-blockchain/atlas/usage',
              '/understand-stacks/atlas/usage',
              '/docs/understand-stacks/atlas-overview',
              '/core/wire-format.html',
              '/core/atlas/overview.html',
              '/core/atlas/howitworks.html',
              '/core/atlas/howtouse.html',
            ],
            to: '/docs/understand-stacks/',
          },
          {
            from: [
              '/understand-stacks/testnet',
              '/stacks-blockchain/testnet',
            ],
            to: '/docs/understand-stacks/testnet',
          },
          {
            from: [
              '/understand-stacks/proof-of-transfer',
              '/stacks-blockchain/proof-of-transfer',
            ],

            to: '/docs/understand-stacks/proof-of-transfer',
          },
          {
            from: [
              '/understand-stacks/mining',
              '/stacks-blockchain/mining',
            ],
            to: '/docs/understand-stacks/mining',
          },
          {
            from: [
              '/understand-stacks/accounts',
              '/stacks-blockchain/accounts',
              '/stacks-blockchain/managing-accounts',
            ],
            to: '/docs/understand-stacks/accounts',
          },
          {
            from: [
              '/understand-stacks/transactions',
              '/stacks-blockchain/transactions',
            ],
            to: '/docs/understand-stacks/transactions',
          },
          {
            from: [
              '/understand-stacks/network/',
              '/stacks-blockchain/network',
            ],
            to: '/docs/understand-stacks/network',
          },
          {
            from: [
              '/understand-stacks/microblocks/',
            ],
            to: '/docs/understand-stacks/microblocks',
          },          
          {
            from: [
              '/understand-stacks/stacking',
              '/stacks-blockchain/stacking',
              '/stacks-blockchain/integrate-stacking',
            ],
            to: '/docs/understand-stacks/stacking',
          },
          {
            from: [
              '/understand-stacks/technical-specs',
              '/org/whitepaper-blockchain.html',
              '/stacks-blockchain/technical-specs',
            ],
            to: '/docs/understand-stacks/technical-specs',
          },
          {
          from: [
            '/docs/understand-stacks/stacks-blockchain-api',
            '/understand-stacks/stacks-blockchain-api',
            '/core/smart/rpc-api.html',
            '/core/smart/rpc-api',
            '/references/stacks-rpc-api',
            '/references/stacks-blockchain-api',
          ],
          to: '/docs/blockchain/stacks-blockchain-api',
          },
          { 
            from: [
              '/gaia',
              '/gaia/overview',
              '/build-apps/references/gaia',
              '/data-storage/storage-write-read',
              '/data-storage/storage-guide',
              '/data-storage',
              '/data-storage/overview',
              '/data-storage/indexing-overview',
              '/data-storage/indexing-server-extras',
              '/data-storage/indexing-collaborate',
              '/data-storage/indexing-models',
              '/data-storage/integrate-indexing',
              '/data-storage/collection-type',
              '/data-storage/collections-type',
              '/storage-hubs/hello-hub-choice',
              '/storage-hubs/config-schema',
              '/storage-hubs',
              '/data-indexing/server-extras',
              '/data-indexing/collaborate',
              '/data-indexing/models',
              '/develop/collection-type.html',
              '/storage/hub-operation.html',
              '/storage-hubs/hello-hub-choice.html',
              '/storage/hello-hub-choice.html',
              '/storage/gaia-admin.html',
              '/storage/config-schema.html',
              '/storage/write-to-read.html',
              '/storage/overview.html',
              '/develop/storage.html',
              '/develop/radiks-intro.html',
              '/develop/radiks-setup.html', 
              '/develop/radiks-models.html',
              '/develop/radiks-collaborate.html',
              '/develop/radiks-server-extras.html',
            ],
            to: '/docs/gaia/',
          },
          {
            from: [
              '/storage-hubs/amazon-s3-deploy',
              '/storage/digital-ocean-deploy.html',
              '/storage/amazon-s3-deploy.html',
            ],
            to: '/docs/gaia/deploy-gaia-hub',
          },
          {
            from: [
              '/gaia/setup-linux',
            ],
            to: '/docs/gaia/setup-linux',
          },
          {
            from: [
              '/gaia/setup-mac',
            ],
            to: '/docs/gaia/setup-mac',
          },
          {
            from: [
              '/gaia/gaia-on-ec2',
              '/gaia/setup-on-ec2',
            ],
            to: '/docs/gaia/gaia-on-ec2',
          },
          {
            from: [
              '/gaia/configuration',
            ],
            to: '/docs/gaia/configuration',
          },
          {
            from: [
              '/references/glossary',
              '/references/stx',
              '/org/terms.html',
            ],
            to: '/docs/references/glossary',
          },


        ],
      },
    ],
  ],
};

module.exports = config;

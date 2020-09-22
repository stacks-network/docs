const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const path = require('path');
const { remarkPlugins } = require('./lib/remark-plugins');
const { rehypePlugins } = require('./lib/rehype-plugins');
const withFonts = require('next-fonts');

async function redirects() {
  return [
    {
      source: '/browser/todo-list.html',
      destination: '/authentication/building-todo-app',
      permanent: true,
    },
    {
      source: '/develop/zero_to_dapp_1.html',
      destination: '/authentication/building-todo-app',
      permanent: true,
    },
    {
      source: '/browser/hello-blockstack.html',
      destination: '/authentication/building-todo-app',
      permanent: true,
    },
    {
      source: '/develop/connect/get-started.html',
      destination: '/authentication/connect',
      permanent: true,
    },
    {
      source: '/develop/connect/overview.html',
      destination: '/authentication/connect',
      permanent: true,
    },
    { source: '/develop/profiles.html', destination: '/authentication/profiles', permanent: true },
    { source: '/storage/overview.html', destination: '/data-storage/overview', permanent: true },
    { source: '/develop/storage.html', destination: '/data-storage/overview', permanent: true },
    {
      source: '/storage/authentication.html',
      destination: '/data-storage/authentication',
      permanent: true,
    },
    {
      source: '/storage/write-to-read.html',
      destination: '/data-storage/storage-write-read',
      permanent: true,
    },
    {
      source: '/develop/radiks-intro.html',
      destination: '/data-storage/indexing-overview',
      permanent: true,
    },
    {
      source: '/develop/radiks-setup.html',
      destination: '/data-storage/integrate-indexing',
      permanent: true,
    },
    {
      source: '/develop/radiks-models.html',
      destination: '/data-storage/indexing-models',
      permanent: true,
    },
    {
      source: '/develop/radiks-collaborate.html',
      destination: '/data-storage/indexing-collaborate',
      permanent: true,
    },
    {
      source: '/develop/radiks-server-extras.html',
      destination: '/data-storage/indexing-server-extras',
      permanent: true,
    },
    {
      source: '/core/smart/overview.html',
      destination: '/smart-contracts/overview',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial.html',
      destination: '/smart-contracts/hello-world-tutorial',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial-counter.html',
      destination: '/smart-contracts/counter-tutorial',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial-test.html',
      destination: '/smart-contracts/testing-contracts',
      permanent: true,
    },
    {
      source: '/develop/connect/use-with-clarity.html',
      destination: '/smart-contracts/signing-transactions',
      permanent: true,
    },
    {
      source: '/core/smart/principals.html',
      destination: '/smart-contracts/principals',
      permanent: true,
    },
    {
      source: '/core/smart/testnet-node.html',
      destination: '/stacks-blockchain/running-testnet-node',
      permanent: true,
    },
    {
      source: '/core/smart/cli-wallet-quickstart.html',
      destination: '/smart-contracts/cli-wallet-quickstart',
      permanent: true,
    },
    {
      source: '/core/naming/introduction.html',
      destination: '/naming-services/overview',
      permanent: true,
    },
    {
      source: '/core/naming/architecture.html',
      destination: '/naming-services/architecture',
      permanent: true,
    },
    {
      source: '/core/naming/namespaces.html',
      destination: '/naming-services/namespaces',
      permanent: true,
    },
    {
      source: '/core/naming/comparison.html',
      destination: '/naming-services/comparison',
      permanent: true,
    },
    {
      source: '/core/naming/tutorial_subdomains.html',
      destination: '/naming-services/subdomains-tutorial',
      permanent: true,
    },
    {
      source: '/core/naming/search.html',
      destination: '/naming-services/overview',
      permanent: true,
    },
    {
      source: '/core/faq_technical.html',
      destination: '/references/faqs',
      permanent: true,
    },
    {
      source: '/faqs/allfaqs',
      destination: '/references/faqs',
      permanent: true,
    },
    {
      source: '/core/naming/pickname.html',
      destination: '/naming-services/choose-name',
      permanent: true,
    },
    {
      source: '/core/naming/creationhowto.html',
      destination: '/naming-services/create-namespace',
      permanent: true,
    },
    {
      source: '/core/naming/resolving.html',
      destination: '/naming-services/resolve-name',
      permanent: true,
    },
    {
      source: '/core/naming/register.html',
      destination: '/naming-services/register-name',
      permanent: true,
    },
    {
      source: '/core/naming/manage.html',
      destination: '/naming-services/manage-names',
      permanent: true,
    },
    {
      source: '/core/naming/subdomains.html',
      destination: '/naming-services/subdomains',
      permanent: true,
    },
    { source: '/core/naming/forks.html', destination: '/naming-services/forks', permanent: true },
    {
      source: '/develop/collections.html',
      destination: '/data-storage/collections',
      permanent: true,
    },
    {
      source: '/develop/collection-type.html',
      destination: '/data-storage/collections-type',
      permanent: true,
    },
    {
      source: '/storage/hub-operation.html',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/storage/hello-hub-choice.html',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/storage/amazon-s3-deploy.html',
      destination: '/storage-hubs/amazon-s3-deploy',
      permanent: true,
    },
    {
      source: '/storage/digital-ocean-deploy.html',
      destination: '/storage-hubs/digital-ocean-deploy',
      permanent: true,
    },
    {
      source: '/storage-hubs/hello-hub-choice.html',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/storage/gaia-admin.html',
      destination: '/storage-hubs/gaia-admin',
      permanent: true,
    },
    {
      source: '/core/atlas/overview.html',
      destination: '/stacks-blockchain/atlas-overview',
      permanent: true,
    },
    {
      source: '/core/atlas/howitworks.html',
      destination: '/stacks-blockchain/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/core/atlas/howtouse.html',
      destination: '/stacks-blockchain/atlas-usage',
      permanent: true,
    },
    { source: '/org/overview.html', destination: '/ecosystem/overview', permanent: true },
    {
      source: '/faqs/allFAQS.html',
      destination: '/references/faqs',
      permanent: true,
    },
    {
      source: '/core/faq_technical.html',
      destination: '/references/faqs',
      permanent: true,
    },
    { source: '/org/token.html', destination: '/ecosystem/stacks-token', permanent: true },
    {
      source: '/org/whitepaper-blockchain.html',
      destination: 'https://blockstack.org/whitepaper.pdf',
      permanent: true,
    },
    { source: '/org/wallet-intro.html', destination: '/stacks-wallet/overview', permanent: true },
    { source: '/org/wallet-install.html', destination: '/stacks-wallet/install', permanent: true },
    { source: '/org/wallet-use.html', destination: '/stacks-wallet/usage', permanent: true },
    {
      source: '/org/wallet-troubleshoot.html',
      destination: '/stacks-wallet/troubleshooting',
      permanent: true,
    },
    {
      source: '/org/tokenholders.html',
      destination: '/ecosystem/stacks-token-holders',
      permanent: true,
    },
    { source: '/core/cmdLineRef.html', destination: '/references/blockstack-cli', permanent: true },
    {
      source: '/core/smart/clarityref',
      destination: '/references/language-clarity',
      permanent: true,
    },
    {
      source: '/core/smart/clarityRef.html',
      destination: '/references/language-clarity',
      permanent: true,
    },
    {
      source: '/references/clarity-language',
      destination: '/references/language-clarity',
      permanent: true,
    },
    {
      source: '/core/smart/rpc-api.html',
      destination: '/references/stacks-rpc-api',
      permanent: true,
    },
    {
      source: '/common/javascript_ref.html',
      destination: 'https://blockstack.github.io/blockstack.js/',
      permanent: true,
    },
    {
      source: '/common/android_ref.html',
      destination: 'https://blockstack.github.io/blockstack-android/',
      permanent: true,
    },
    {
      source: '/android/tutorial.html', // TODO: update once choice has been made on SDKs
      destination:
        'https://github.com/blockstack/docs.blockstack/blob/master-legacy/android/tutorial.md',
      permanent: true,
    },
    {
      source: '/ios/tutorial.html', // TODO: update once choice has been made on SDKs
      destination:
        'https://github.com/blockstack/docs.blockstack/blob/master-legacy/ios/tutorial.md',
      permanent: true,
    },
    {
      source: '/common/ios_ref.html',
      destination: 'https://blockstack.github.io/blockstack-ios/',
      permanent: true,
    },
    {
      source: '/common/core_ref.html',
      destination: '/references/stacks-blockchain',
      permanent: true,
    },
    {
      source: '/core/wire-format.html',
      destination: '/stacks-blockchain/wire-format',
      permanent: true,
    },
    {
      source: '/storage/config-schema.html',
      destination: '/storage-hubs/gaia-admin',
      permanent: true,
    },
    { source: '/org/secureref.html', destination: '/stacks-wallet/security', permanent: true },
    {
      source: '/develop/overview_auth.html',
      destination: '/authentication/overview',
      permanent: true,
    },
    { source: '/org/terms.html', destination: '/references/glossary', permanent: true },
    // overview redirects
    { source: '/stacks-blockchain', destination: '/stacks-blockchain/overview', permanent: true },
    { source: '/stacks-blockchain', destination: '/stacks-blockchain/overview', permanent: true },
    { source: '/smart-contracts', destination: '/smart-contracts/overview', permanent: true },
    { source: '/data-storage', destination: '/data-storage/overview', permanent: true },
    { source: '/data-indexing', destination: '/data-storage/indexing-overview', permanent: true },
    { source: '/stacks-wallet', destination: '/stacks-wallet/overview', permanent: true },
    { source: '/naming-services', destination: '/naming-services/overview', permanent: true },
    { source: '/storage-hubs', destination: '/storage-hubs/overview', permanent: true },
    { source: '/references', destination: '/references/blockstack-cli', permanent: true },
    { source: '/ecosystem', destination: '/ecosystem/overview', permanent: true },
    {
      source: '/stacks-blockchain/testnet-node',
      destination: '/stacks-blockchain/running-testnet-node',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/overview',
      destination: '/stacks-blockchain/atlas-overview',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/how-atlas-works',
      destination: '/stacks-blockchain/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/usage',
      destination: '/stacks-blockchain/atlas-usage',
      permanent: true,
    },
    // data indexing changes
    {
      source: '/data-indexing/overview',
      destination: '/data-storage/indexing-overview',
      permanent: true,
    },
    {
      source: '/data-indexing/integrate',
      destination: '/data-storage/integrate-indexing',
      permanent: true,
    },
    {
      source: '/data-indexing/models',
      destination: '/data-storage/indexing-models',
      permanent: true,
    },
    {
      source: '/data-indexing/collaborate',
      destination: '/data-storage/indexing-collaborate',
      permanent: true,
    },
    {
      source: '/data-indexing/server-extras',
      destination: '/data-storage/indexing-server-extras',
      permanent: true,
    },
    {
      source: '/storage-hubs/hello-hub-choice',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/naming-services/build-profile-search-index',
      destination: '/naming-services/overview',
      permanent: true,
    },
    {
      source: '/storage-hubs/config-schema',
      destination: '/storage-hubs/gaia-admin',
      permanent: true,
    },
  ];
}

module.exports = withFonts(
  withBundleAnalyzer({
    experimental: {
      modern: true,
      polyfillsOptimization: true,
      jsconfigPaths: true,
      trailingSlash: true,
    },
    env: {
      FATHOM_ID: 'EPNTIXUM',
    },
    redirects,
    pageExtensions: ['js', 'ts', 'tsx', 'md', 'mdx'],
    webpack: (config, options) => {
      config.module.rules.push({
        test: /.mdx?$/, // load both .md and .mdx files
        use: [
          options.defaultLoaders.babel,
          {
            loader: '@mdx-js/loader',
            options: {
              remarkPlugins,
              rehypePlugins,
            },
          },
          path.join(__dirname, './lib/mdx-frontmatter-loader'),
        ],
      });

      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      });

      if (!options.dev) {
        const splitChunks = config.optimization && config.optimization.splitChunks;
        if (splitChunks) {
          const cacheGroups = splitChunks.cacheGroups;
          const test = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
          if (cacheGroups.framework) {
            cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
              test,
            });
            cacheGroups.commons.name = 'framework';
          } else {
            cacheGroups.preact = {
              name: 'commons',
              chunks: 'all',
              test,
            };
          }
        }

        // Install webpack aliases:
        const aliases = config.resolve.alias || (config.resolve.alias = {});
        aliases.react = aliases['react-dom'] = 'preact/compat';
        aliases['react-ssr-prepass'] = 'preact-ssr-prepass';
      }
      config.resolve.alias['@emotion/react'] = path.resolve(
        __dirname,
        './node_modules/@emotion/react'
      );

      return config;
    },
  })
);

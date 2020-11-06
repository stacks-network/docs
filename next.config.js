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
    {
      source: '/authentication/connect',
      destination: 'https://blockstack.github.io/stacks.js',
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
      destination: '/write-smart-contracts/overview',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial.html',
      destination: '/write-smart-contracts/hello-world-tutorial',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial-counter.html',
      destination: '/write-smart-contracts/counter-tutorial',
      permanent: true,
    },
    {
      source: '/core/smart/tutorial-test.html',
      destination: '/write-smart-contracts/testing-contracts',
      permanent: true,
    },
    {
      source: '/develop/connect/use-with-clarity.html',
      destination: '/write-smart-contracts/signing-transactions',
      permanent: true,
    },
    {
      source: '/core/smart/principals.html',
      destination: '/write-smart-contracts/principals',
      permanent: true,
    },
    {
      source: '/core/smart/testnet-node.html',
      destination: '/understand-stacks/running-testnet-node',
      permanent: true,
    },
    {
      source: '/core/smart/cli-wallet-quickstart.html',
      destination: '/write-smart-contracts/cli-wallet-quickstart',
      permanent: true,
    },
    {
      source: '/core/naming/introduction.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/architecture.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/namespaces.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/comparison.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/tutorial_subdomains.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/search.html',
      destination: '/technology/naming-system/',
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
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/creationhowto.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/resolving.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/register.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/manage.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/subdomains.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/core/naming/forks.html',
      destination: '/technology/naming-system/',
      permanent: true,
    },
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
      destination: '/understand-stacks/atlas-overview',
      permanent: true,
    },
    {
      source: '/core/atlas/howitworks.html',
      destination: '/understand-stacks/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/core/atlas/howtouse.html',
      destination: '/understand-stacks/atlas-usage',
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
    {
      source: '/org/wallet-intro.html',
      destination: 'https://blockstack.org/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/wallet-install.html',
      destination: 'https://blockstack.org/questions/how-do-i-install-the-stacks-wallet-v3-x',
      permanent: true,
    },
    {
      source: '/org/wallet-use.html',
      destination: 'https://blockstack.org/questions/how-do-i-start-using-the-stacks-wallet-v3-x',
      permanent: true,
    },
    {
      source: '/stacks-wallet/overview',
      destination: 'https://blockstack.org/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet/install',
      destination: 'https://blockstack.org/questions/how-do-i-install-the-stacks-wallet-v3-x',
      permanent: true,
    },
    {
      source: '/stacks-wallet/usage',
      destination: 'https://blockstack.org/questions/how-do-i-start-using-the-stacks-wallet-v3-x',
      permanent: true,
    },
    {
      source: '/stacks-wallet/security',
      destination:
        'https://blockstack.org/questions/how-should-i-secure-my-secret-key-for-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet',
      destination: 'https://blockstack.org/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/secureref.html',
      destination:
        'https://blockstack.org/questions/how-should-i-secure-my-secret-key-for-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/wallet-troubleshoot.html',
      destination: 'https://blockstack.org/wallet',
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
      source: '/references/language-clarity',
      destination: '/references/language-overview',
      permanent: true,
    },
    {
      source: '/references/clarity-language',
      destination: '/references/language-clarity',
      permanent: true,
    },
    {
      source: '/core/smart/rpc-api.html',
      destination: '/references/stacks-blockchain-api',
      permanent: true,
    },
    {
      source: '/core/smart/rpc-api',
      destination: '/references/stacks-blockchain-api',
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
      destination: '/references/stacks-blockchain-api',
      permanent: true,
    },
    {
      source: '/core/wire-format.html',
      destination: '/understand-stacks/wire-format',
      permanent: true,
    },
    {
      source: '/storage/config-schema.html',
      destination: '/storage-hubs/gaia-admin',
      permanent: true,
    },
    {
      source: '/develop/overview_auth.html',
      destination: '/authentication/overview',
      permanent: true,
    },
    { source: '/org/terms.html', destination: '/references/glossary', permanent: true },
    // overview redirects
    { source: '/stacks-blockchain', destination: '/understand-stacks/overview', permanent: true },
    { source: '/smart-contracts', destination: '/write-smart-contracts/overview', permanent: true },
    {
      source: '/understand-stacks',
      destination: '/understand-stacks/overview',
      permanent: true,
    },
    {
      source: '/write-smart-contracts',
      destination: '/write-smart-contracts/overview',
      permanent: true,
    },
    { source: '/data-storage', destination: '/data-storage/overview', permanent: true },
    { source: '/data-indexing', destination: '/data-storage/indexing-overview', permanent: true },
    { source: '/stacks-wallet', destination: '/stacks-wallet/overview', permanent: true },
    { source: '/naming-services', destination: '/technology/naming-system/', permanent: true },
    { source: '/naming-system', destination: '/technology/naming-system/', permanent: true },
    { source: '/storage-hubs', destination: '/storage-hubs/overview', permanent: true },
    { source: '/references', destination: '/references/blockstack-cli', permanent: true },
    { source: '/ecosystem', destination: '/ecosystem/overview', permanent: true },
    {
      source: '/stacks-blockchain/testnet-node',
      destination: '/understand-stacks/running-testnet-node',
      permanent: true,
    },
    {
      source: '/understand-stacks/testnet-node',
      destination: '/understand-stacks/running-testnet-node',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/overview',
      destination: '/understand-stacks/atlas-overview',
      permanent: true,
    },
    {
      source: '/understand-stacks/atlas/overview',
      destination: '/understand-stacks/atlas-overview',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/how-atlas-works',
      destination: '/understand-stacks/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/understand-stacks/atlas/how-atlas-works',
      destination: '/understand-stacks/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas/usage',
      destination: '/understand-stacks/atlas-usage',
      permanent: true,
    },
    {
      source: '/understand-stacks/atlas/usage',
      destination: '/understand-stacks/atlas-usage',
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
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/build-profile-search-index',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/build-profile-search-index',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/build-profile-search-index',
      destination: '/technology/naming-system/',
      permanent: true,
    },

    {
      source: '/naming-services/architecture',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/choose-name',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/comparison',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/create-namespace',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/did',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/forks',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/manage-names',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/namespaces',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/overview',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/register-name',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/resolve-name',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/subdomains',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/naming-services/subdomains-tutorial',
      destination: '/technology/naming-system/',
      permanent: true,
    },
    {
      source: '/storage-hubs/config-schema',
      destination: '/storage-hubs/gaia-admin',
      permanent: true,
    },
    {
      source: '/storage-hubs/amazon-s3-deploy',
      destination: '/storage-hubs/amazon-ec2-deploy',
      permanent: true,
    },
    {
      source: '/references/stacks-rpc-api',
      destination: '/references/stacks-blockchain-api',
      permanent: true,
    },
    {
      source: '/references/stacks-blockchain',
      destination: '/references/stacks-blockchain-api',
      permanent: true,
    },
  ];
}

module.exports = withFonts(
  withBundleAnalyzer({
    i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US',
    },
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

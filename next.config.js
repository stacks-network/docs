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
      destination: '/data-indexing/overview',
      permanent: true,
    },
    {
      source: '/develop/radiks-setup.html',
      destination: '/data-indexing/integrate',
      permanent: true,
    },
    {
      source: '/develop/radiks-models.html',
      destination: '/data-indexing/models',
      permanent: true,
    },
    {
      source: '/develop/radiks-collaborate.html',
      destination: '/data-indexing/collaborate',
      permanent: true,
    },
    {
      source: '/develop/radiks-server-extras.html',
      destination: '/data-indexing/server-extras',
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
      destination: '/smart-contracts/running-a-testnet-node',
      permanent: true,
    },
    { source: '/core/smart/cli-wallet-quickstart.html', destination: '', permanent: true },
    { source: '/core/naming/introduction.html', destination: '', permanent: true },
    { source: '/core/naming/architecture.html', destination: '', permanent: true },
    { source: '/core/naming/namespaces.html', destination: '', permanent: true },
    { source: '/core/naming/comparison.html', destination: '', permanent: true },
    { source: '/core/naming/tutorial_subdomains.html', destination: '', permanent: true },
    { source: '/core/naming/search.html', destination: '', permanent: true },
    { source: '/core/faq_technical.html', destination: '', permanent: true },
    { source: '/core/naming/pickname.html', destination: '', permanent: true },
    { source: '/core/naming/creationhowto.html', destination: '', permanent: true },
    { source: '/core/naming/resolving.html', destination: '', permanent: true },
    { source: '/core/naming/register.html', destination: '', permanent: true },
    { source: '/core/naming/manage.html', destination: '', permanent: true },
    { source: '/core/naming/subdomains.html', destination: '', permanent: true },
    { source: '/core/naming/forks.html', destination: '', permanent: true },
    { source: '/develop/collections.html', destination: '', permanent: true },
    { source: '/develop/collection-type.html', destination: '', permanent: true },
    { source: '/storage/hub-operation.html', destination: '', permanent: true },
    { source: '/storage/amazon-s3-deploy.html', destination: '', permanent: true },
    { source: '/storage/digital-ocean-deploy.html', destination: '', permanent: true },
    { source: '/storage/hello-hub-choice.html', destination: '', permanent: true },
    { source: '/storage/gaia-admin.html', destination: '', permanent: true },
    { source: '/core/atlas/overview.html', destination: '', permanent: true },
    { source: '/core/atlas/howitworks.html', destination: '', permanent: true },
    { source: '/core/atlas/howtouse.html', destination: '', permanent: true },
    { source: '/org/overview.html', destination: '', permanent: true },
    { source: '/faqs/allFAQS.html', destination: '', permanent: true },
    { source: '/org/token.html', destination: '', permanent: true },
    { source: '/org/whitepaper-blockchain.html', destination: '', permanent: true },
    { source: '/org/wallet-intro.html', destination: '', permanent: true },
    { source: '/org/wallet-install.html', destination: '', permanent: true },
    { source: '/org/wallet-use.html', destination: '', permanent: true },
    { source: '/org/wallet-troubleshoot.html', destination: '', permanent: true },
    { source: '/org/tokenholders.html', destination: '', permanent: true },
    { source: '/core/cmdLineRef.html', destination: '', permanent: true },
    { source: '/core/smart/clarityRef.html', destination: '', permanent: true },
    { source: '/core/smart/rpc-api.html', destination: '', permanent: true },
    { source: '/common/javascript_ref.html', destination: '', permanent: true },
    { source: '/common/android_ref.html', destination: '', permanent: true },
    { source: '/common/ios_ref.html', destination: '', permanent: true },
    { source: '/common/core_ref.html', destination: '', permanent: true },
    { source: '/core/wire-format.html', destination: '', permanent: true },
    { source: '/storage/config-schema.html', destination: '', permanent: true },
    { source: '/org/secureref.html', destination: '', permanent: true },
    { source: '/develop/overview_auth.html', destination: '', permanent: true },
    { source: '/org/terms.html', destination: '', permanent: true },
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
    pageExtensions: ['js', 'ts', 'tsx', 'md', 'mdx'],
    webpack: (config, options) => {
      config.module.rules.push({
        test: /.mdx?$/, // load both .md and .mdx files
        use: [
          options.defaultLoaders.babel,
          {
            loader: './lib/mdx-loader',
            options: {
              remarkPlugins,
              rehypePlugins,
            },
          },
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

      return config;
    },
  })
);

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
      source: '/build-apps/references/gaia',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/gaia',
      destination: '/gaia/overview',
      permanent: true,
    },
    {
      source: '/references/bns-contract',
      destination: '/noteworthy-contracts/bns-contract',
      permanent: true,
    },
    {
      source: '/references/stacking-contract',
      destination: '/noteworthy-contracts/stacking-contract',
      permanent: true,
    },
    {
      source: '/references/deploy-tips',
      destination: '/build-apps/deploy-tips',
      permanent: true,
    },
    {
      source: '/references/stacks-node-configuration',
      destination: '/nodes-and-miners/stacks-node-configuration',
      permanent: true,
    },
    {
      source: '/nodes-and-miners',
      destination: '/nodes-and-miners/overview',
      permanent: true,
    },
    {
      source: '/contribute',
      destination: '/contribute/overview',
      permanent: true,
    },
    {
      source: '/references/language-functions',
      destination: '/write-smart-contracts/language-functions',
      permanent: true,
    },
    {
      source: '/write-smart-contracts/nft',
      destination: '/write-smart-contracts/nft-tutorial',
      permanent: true,
    },
    {
      source: '/understand-stacks/integrate-stacking',
      destination: '/build-apps/guides/integrate-stacking',
      permanent: true,
    },
    {
      source: '/understand-stacks/integrate-stacking-delegation',
      destination: '/build-apps/guides/integrate-stacking-delegation',
      permanent: true,
    },
    {
      source: '/build-apps/tutorials/todos',
      destination: '/build-apps/examples/todos',
      permanent: true,
    },
    {
      source: '/build-apps/tutorials/public-registry',
      destination: '/build-apps/examples/public-registry',
      permanent: true,
    },
    {
      source: '/build-apps/tutorials/angular',
      destination: '/build-apps/examples/angular',
      permanent: true,
    },
    {
      source: '/ecosystem/contributing',
      destination: '/contributing',
      permanent: true,
    },
    {
      source: '/browser/todo-list.html',
      destination: '/build-apps/tutorials/todos',
      permanent: true,
    },
    {
      source: '/develop/zero_to_dapp_1.html',
      destination: '/build-apps/tutorials/todos',
      permanent: true,
    },
    {
      source: '/browser/hello-blockstack.html',
      destination: '/build-apps/tutorials/todos',
      permanent: true,
    },
    {
      source: '/authentication/building-todo-app',
      destination: '/build-apps/tutorials/todos',
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
      destination: 'https://stacks.js.org/',
      permanent: true,
    },
    {
      source: '/develop/profiles.html',
      destination: '/authentication/profiles',
      permanent: true,
    },
    {
      source: '/storage/overview.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/storage.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/data-storage/storage-write-read',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/data-storage/storage-guide',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/data-storage/overview',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/data-storage/authentication',
      destination: '/build-apps/guides/authentication',
      permanent: true,
    },
    {
      source: '/storage/authentication.html',
      destination: '/build-apps/references/authentication',
      permanent: true,
    },
    {
      source: '/storage/write-to-read.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/radiks-intro.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/radiks-setup.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/radiks-models.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/radiks-collaborate.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/develop/radiks-server-extras.html',
      destination: '/gaia',
      permanent: true,
    },
    {
      source: '/authentication/building-with-angular',
      destination: '/build-apps/tutorials/angular',
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
      destination: 'https://docs.hiro.so/get-started/transactions#signature-and-verification',
      permanent: true,
    },
    {
      source: '/core/smart/principals.html',
      destination: '/write-smart-contracts/principals',
      permanent: true,
    },
    {
      source: '/core/smart/testnet-node.html',
      destination: '/nodes-and-miners/running-testnet-node',
      permanent: true,
    },
    {
      source: '/core/smart/cli-wallet-quickstart.html',
      destination: '/write-smart-contracts/cli-wallet-quickstart',
      permanent: true,
    },
    {
      source: '/core/naming/introduction.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/architecture.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/namespaces.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/comparison.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/tutorial_subdomains.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/search.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/faq_technical.html',
      destination: '/',
      permanent: true,
    },
    {
      source: '/faqs/allfaqs',
      destination: '/',
      permanent: true,
    },
    {
      source: '/core/naming/pickname.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/creationhowto.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/resolving.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/register.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/manage.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/subdomains.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/core/naming/forks.html',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/develop/collections.html',
      destination: '/build-apps/collections/overview',
      permanent: true,
    },
    {
      source: '/data-storage/collections',
      destination: '/build-apps/collections/overview',
      permanent: true,
    },
    {
      source: '/develop/collection-type.html',
      destination: '/build-apps/collections/types',
      permanent: true,
    },
    {
      source: '/data-storage/collection-type',
      destination: '/build-apps/collections/types',
      permanent: true,
    },
    {
      source: '/data-storage/collections-type',
      destination: '/build-apps/collections/types',
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
    {
      source: '/org/overview.html',
      destination: '/ecosystem/overview',
      permanent: true,
    },
    {
      source: '/faqs/allFAQS.html',
      destination: '/',
      permanent: true,
    },
    {
      source: '/core/faq_technical.html',
      destination: '/',
      permanent: true,
    },
    {
      source: '/org/token.html',
      destination: '/ecosystem/stacks-token',
      permanent: true,
    },
    {
      source: '/org/whitepaper-blockchain.html',
      destination: 'https://community.stacks.org/pox',
      permanent: true,
    },
    {
      source: '/org/wallet-intro.html',
      destination: 'https://www.hiro.so/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/wallet-install.html',
      destination: 'https://www.hiro.so/wallet',
      permanent: true,
    },
    {
      source: '/org/wallet-use.html',
      destination: 'https://www.hiro.so/wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet/overview',
      destination: 'https://www.hiro.so/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet/install',
      destination: 'https://www.hiro.so/wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet/usage',
      destination: 'https://www.hiro.so/wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet/security',
      destination:
        'https://www.hiro.so/questions/how-should-i-secure-my-secret-key-for-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/stacks-wallet',
      destination: 'https://www.hiro.so/questions/what-is-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/secureref.html',
      destination:
        'https://www.hiro.so/questions/how-should-i-secure-my-secret-key-for-the-stacks-wallet',
      permanent: true,
    },
    {
      source: '/org/wallet-troubleshoot.html',
      destination: 'https://www.hiro.so/wallet',
      permanent: true,
    },
    {
      source: '/org/tokenholders.html',
      destination: '/',
      permanent: true,
    },
    {
      source: '/core/cmdLineRef.html',
      destination: 'https://docs.hiro.so/references/stacks-cli',
      permanent: true,
    },
    {
      source: '/references/stx ',
      destination: 'https://docs.hiro.so/references/stacks-cli',
      permanent: true,
    },
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
      destination: 'https://blockstack.github.io/stacks.js/',
      permanent: true,
    },
    {
      source: '/common/android_ref.html',
      destination: 'https://blockstack.github.io/blockstack-android/',
      permanent: true,
    },
    {
      source: '/android/tutorial.html', // TODO: update once choice has been made on SDKs
      destination: 'https://github.com/stacks-network/docs/blob/master-legacy/android/tutorial.md',
      permanent: true,
    },
    {
      source: '/ios/tutorial.html', // TODO: update once choice has been made on SDKs
      destination: 'https://github.com/stacks-network/docs/blob/master-legacy/ios/tutorial.md',
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
      destination: '/build-apps/guides/authentication',
      permanent: true,
    },
    {
      source: '/authentication/overview',
      destination: '/build-apps/guides/authentication',
      permanent: true,
    },
    {
      source: '/build-apps',
      destination: '/build-apps/overview',
      permanent: true,
    },
    {
      source: '/org/terms.html',
      destination: '/references/glossary',
      permanent: true,
    },
    {
      source: '/stacks-blockchain',
      destination: '/understand-stacks/overview',
      permanent: true,
    },
    {
      source: '/smart-contracts',
      destination: '/write-smart-contracts/overview',
      permanent: true,
    },
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
    { source: '/data-storage', destination: '/gaia', permanent: true },
    {
      source: '/data-storage/overview',
      destination: '/gaia',
      permanent: true,
    },
    { source: '/data-indexing', destination: '/build-apps/indexing/overview', permanent: true },
    {
      source: '/data-storage/indexing-overview',
      destination: '/build-apps/indexing/overview',
      permanent: true,
    },
    {
      source: '/stacks-wallet',
      destination: '/stacks-wallet/overview',
      permanent: true,
    },
    {
      source: '/naming-services',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-system',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/storage-hubs',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/references',
      destination: 'https://docs.hiro.so/references/stacks-cli',
      permanent: true,
    },
    {
      source: '/ecosystem',
      destination: '/ecosystem/overview',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/testnet-node',
      destination: '/nodes-and-miners/running-testnet-node',
      permanent: true,
    },
    {
      source: '/understand-stacks/testnet-node',
      destination: '/nodes-and-miners/running-testnet-node',
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
      source: '/stacks-blockchain/integrate-stacking',
      destination: '/understand-stacks/integrate-stacking',
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
      destination: '/build-apps/indexing/overview',
      permanent: true,
    },
    {
      source: '/data-storage/indexing-overview',
      destination: '/build-apps/indexing/overview',
      permanent: true,
    },
    {
      source: '/data-indexing/integrate',
      destination: '/build-apps/tutorials/indexing',
      permanent: true,
    },
    {
      source: '/data-storage/integrate-indexing',
      destination: '/build-apps/tutorials/indexing',
      permanent: true,
    },
    {
      source: '/data-indexing/models',
      destination: '/build-apps/indexing/models',
      permanent: true,
    },
    {
      source: '/data-indexing/collaborate',
      destination: '/build-apps/indexing/collaboration',
      permanent: true,
    },
    {
      source: '/data-indexing/server-extras',
      destination: '/build-apps/indexing/server',
      permanent: true,
    },
    {
      source: '/data-storage/indexing-models',
      destination: '/build-apps/indexing/models',
      permanent: true,
    },
    {
      source: '/data-storage/indexing-collaborate',
      destination: '/build-apps/indexing/collaboration',
      permanent: true,
    },
    {
      source: '/data-storage/indexing-server-extras',
      destination: '/build-apps/indexing/server',
      permanent: true,
    },
    {
      source: '/storage-hubs/hello-hub-choice',
      destination: '/storage-hubs/overview',
      permanent: true,
    },
    {
      source: '/naming-services/build-profile-search-index',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/technology/naming-system',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/architecture',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/choose-name',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/comparison',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/create-namespace',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/did',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/forks',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/manage-names',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/namespaces',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/overview',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/register-name',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/resolve-name',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/subdomains',
      destination: '/build-apps/references/bns',
      permanent: true,
    },
    {
      source: '/naming-services/subdomains-tutorial',
      destination: '/build-apps/references/bns',
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
    {
      source: '/mining',
      destination: '/nodes-and-miners/miner-mainnet',
      permanent: true,
    },
    {
      source: '/start-mining',
      destination: '/nodes-and-miners/miner-mainnet',
      permanent: true,
    },
    {
      source: '/smart-contracts/overview',
      destination: '/write-smart-contracts/overview',
      permanent: true,
    },
    {
      source: '/smart-contracts/hello-world-tutorial',
      destination: '/write-smart-contracts/hello-world-tutorial',
      permanent: true,
    },
    {
      source: '/smart-contracts/counter-tutorial',
      destination: '/write-smart-contracts/counter-tutorial',
      permanent: true,
    },
    {
      source: '/smart-contracts/testing-contracts',
      destination: '/write-smart-contracts/testing-contracts',
      permanent: true,
    },
    {
      source: '/smart-contracts/signing-transactions',
      destination: 'https://docs.hiro.so/get-started/transactions#signature-and-verification',
      permanent: true,
    },
    {
      source: '/write-smart-contracts/signing-transactions',
      destination: 'https://docs.hiro.so/get-started/transactions#signature-and-verification',
      permanent: true,
    },
    {
      source: '/smart-contracts/principals',
      destination: '/write-smart-contracts/principals',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/running-testnet-node',
      destination: '/nodes-and-miners/running-testnet-node',
      permanent: true,
    },
    {
      source: '/smart-contracts/cli-wallet-quickstart',
      destination: '/write-smart-contracts/cli-wallet-quickstart',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas-overview',
      destination: '/understand-stacks/atlas-overview',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas-how-it-works',
      destination: '/understand-stacks/atlas-how-it-works',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/atlas-usage',
      destination: '/understand-stacks/atlas-usage',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/wire-format',
      destination: '/understand-stacks/wire-format',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/overview',
      destination: '/understand-stacks/overview',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/testnet',
      destination: '/understand-stacks/testnet',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/proof-of-transfer',
      destination: '/understand-stacks/proof-of-transfer',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/mining',
      destination: '/understand-stacks/mining',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/accounts',
      destination: '/understand-stacks/accounts',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/transactions',
      destination: '/understand-stacks/transactions',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/network',
      destination: '/understand-stacks/network',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/stacking',
      destination: '/understand-stacks/stacking',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/local-development',
      destination: '/understand-stacks/local-development',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/technical-specs',
      destination: '/understand-stacks/technical-specs',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/managing-accounts',
      destination: '/understand-stacks/managing-accounts',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/sending-tokens',
      destination: '/understand-stacks/sending-tokens',
      permanent: true,
    },
    {
      source: '/build-an-app',
      destination: '/build-apps',
      permanent: true,
    },
    {
      source: '/smart-contracts/clarity-values',
      destination: '/write-smart-contracts/values',
      permanent: true,
    },
    {
      source: '/smart-contracts/public-registry-tutorial',
      destination: '/build-apps/tutorials/public-registry',
      permanent: true,
    },
    {
      source: '/smart-contracts/public-registry-tutorial',
      destination: '/build-apps/tutorials/public-registry',
      permanent: true,
    },
    {
      source: '/write-smart-contracts/public-registry-tutorial',
      destination: '/build-apps/tutorials/public-registry',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/stacks-1.0-info',
      destination: '/understand-stacks/stacks-1.0-info',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/best-practices',
      destination: '/understand-stacks/best-practices',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/wire-format',
      destination: '/understand-stacks/wire-format',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/install-api',
      destination: '/understand-stacks/stacks-1.0-info',
      permanent: true,
    },
    {
      source: '/understand-stacks/install-api',
      destination: '/understand-stacks/stacks-1.0-info',
      permanent: true,
    },
    {
      source: '/stacks-blockchain/installing-memcached',
      destination: '/understand-stacks/installing-memcached',
      permanent: true,
    },
    {
      source: '/en-US/:slug*',
      destination: '/:slug*',
      permanent: true,
    },
  ];
}

async function rewrites() {
  return [
    {
      source: '/:path*',
      destination: '/en/:path*',
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
      FATHOM_ID: 'FOEMPXUV',
    },
    i18n: {
      locales: ['en-US', 'es'],
      defaultLocale: 'en-US',
    },
    redirects,
    rewrites,
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
          if (cacheGroups?.framework) {
            cacheGroups.preact = Object.assign({}, cacheGroups?.framework, {
              test,
            });
            cacheGroups.commons.name = 'framework';
          } else {
            if (typeof cacheGroups !== 'undefined') {
              cacheGroups.preact = {
                name: 'commons',
                chunks: 'all',
                test,
              };
            }
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

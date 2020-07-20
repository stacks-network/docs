/**
 * Routes
 *
 * This file contains our paths for all of our markdown files and is pre evaluated at runtime to get the content
 * from all the markdown: front matter and extracts all the headings from the document.
 *
 * This data is used to dynamically generate the sidenav.
 *
 */
const fm = require('front-matter');
const fs = require('fs-extra');
const path = require('path');

const sections = [
  {
    title: 'Authentication',
    routes: [
      { path: 'browser/todo-list' },
      { path: 'develop/connect/overview' },
      { path: 'develop/profiles' },
    ],
  },
  {
    title: 'Data Storage',
    routes: [
      { path: 'storage/overview' },
      { path: 'develop/storage' },
      { path: 'storage/authentication' },
      { path: 'storage/write-to-read' },
      // { path: 'storage/hub-choice' }, // TODO: why is this missing? missing from `master` too
    ],
  },
  {
    title: 'Data Indexing',
    routes: [
      { path: 'develop/radiks-intro' },
      { path: 'develop/radiks-setup' },
      { path: 'develop/radiks-models' },
      { path: 'develop/radiks-collaborate' },
      { path: 'develop/radiks-server-extras' },
    ],
  },
  {
    title: 'Smart Contracts',
    routes: [
      { path: 'core/smart/overview' },
      { path: 'core/smart/tutorial' },
      { path: 'core/smart/tutorial-counter' },
      { path: 'core/smart/tutorial-test' },
      { path: 'develop/connect/use-with-clarity' },
      { path: 'core/smart/principals' },
      { path: 'core/smart/testnet-node' },
      { path: 'core/smart/cli-wallet-quickstart' },
    ],
  },
  {
    title: 'Naming Services',
    routes: [
      { path: 'core/naming/introduction' },
      { path: 'core/naming/architecture' },
      { path: 'core/naming/namespaces' },
      { path: 'core/naming/comparison' },
      { path: 'core/naming/tutorial_subdomains' },
      { path: 'core/naming/search' },
      { path: 'core/faq_technical' },
      { path: 'core/naming/pickname' },
      { path: 'core/naming/creationhowto' },
      { path: 'core/naming/resolving' },
      { path: 'core/naming/register' },
      { path: 'core/naming/manage' },
      { path: 'core/naming/subdomains' },
      { path: 'core/naming/forks' },
    ],
  },
  {
    title: 'Data Portability (Preview)',
    routes: [{ path: 'develop/collections' }, { path: 'develop/collection-type' }],
  },
  {
    title: 'Host a Storage Hub',
    routes: [
      { path: 'storage/hub-operation' },
      { path: 'storage/amazon-s3-deploy' },
      { path: 'storage/digital-ocean-deploy' },
      { path: 'storage/hello-hub-choice' },
      { path: 'storage/gaia-admin' },
    ],
  },
  {
    title: 'Atlas',
    routes: [
      { path: 'core/atlas/overview' },
      { path: 'core/atlas/howitworks' },
      { path: 'core/atlas/howtouse' },
    ],
  },
  {
    title: 'Blockstack and Stacks Tokens',
    routes: [
      { path: 'org/overview' },
      { path: 'faqs/allFAQS' },
      { path: 'org/token' },
      { path: 'org/whitepaper-blockchain' },
      { path: 'org/wallet-intro' },
      { path: 'org/wallet-install' },
      { path: 'org/wallet-use' },
      { path: 'org/wallet-troubleshoot' },
      { path: 'org/tokenholders' },
    ],
  },
  {
    title: 'References',
    routes: [
      { path: 'core/cmdLineRef' },
      { path: 'core/smart/clarityRef' },
      { path: 'core/smart/rpc-api' },
      { path: 'common/javascript_ref' },
      { path: 'common/android_ref' },
      { path: 'common/ios_ref' },
      // { path: 'develop/cliDocs' }, Duplicate
      { path: 'common/core_ref' },
      { path: 'core/wire-format' },
      { path: 'storage/config-schema' },
      { path: 'org/secureref' },
      { path: 'develop/overview_auth' },
      { path: 'org/terms' },
    ],
  },
];

const getHeadings = mdContent => {
  const regex = /(#+)(.*)/gm;
  const found = mdContent.match(regex);
  return found && found.length
    ? found.map(f => f && f.split('# ')[1]).filter(f => typeof f !== 'undefined')
    : undefined;
};

const routes = sections.map(section => {
  const _routes = section.routes.map(route => {
    try {
      const extension = /\.(mdx?)$/;
      const fileContent = fs.readFileSync(path.join('./src/pages/', route.path + '.md'), 'utf8');
      const data = fm(fileContent);
      const headings = getHeadings(data.body);
      return {
        ...route,
        ...data.attributes,
        headings,
      };
    } catch (e) {
      console.log(e);
    }
  });
  return {
    ...section,
    routes: _routes,
    directory: process.cwd(),
  };
});

module.exports = routes || [];

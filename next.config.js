const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const path = require('path');

const remarkPlugins = [
  [
    require('@hashicorp/remark-plugins').includeMarkdown,
    { resolveFrom: path.join(__dirname, 'src/common/_includes') },
  ],
  require('remark-squeeze-paragraphs'),
  require('./src/lib/remark-paragraph-alerts'),
  require('remark-external-links'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-unwrap-images'),
  require('remark-normalize-headings'),
  require('remark-slug'),
];

module.exports = withBundleAnalyzer({
  experimental: {
    modern: true,
    polyfillsOptimization: true,
    jsconfigPaths: true,
  },
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
          },
        },
        path.join(__dirname, './src/lib/md-loader'),
      ],
    });

    if (!options.isServer) {
      config.node['fs'] = 'empty';
    }
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

      // https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
      aliases['buble'] = '@philpl/buble';
    }

    return config;
  },
});

const { includeMarkdown } = require('@hashicorp/remark-plugins');

const withMdxEnhanced = require('next-mdx-enhanced');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const remark = require('remark');
const strip = require('strip-markdown');
const path = require('path');

const remarkPlugins = [
  [includeMarkdown, { resolveFrom: path.join(__dirname, 'src/common/_includes') }],
  require('remark-squeeze-paragraphs'),
  require('./src/lib/remark-paragraph-alerts'),
  require('remark-external-links'),
  require('remark-emoji'),
  require('remark-images'),
  require('remark-unwrap-images'),
  require('remark-normalize-headings'),
  require('remark-slug'),
];

const getHeadings = mdxContent => {
  const regex = /\n(#+)(.*)/gm;
  const found = mdxContent.match(regex);
  const getLevel = string => string.split('#');
  const headings =
    found && found.length
      ? found.map(f => {
          const md = f.split('# ')[1];
          let content = md;
          remark()
            .use(strip)
            .process(md, (err, file) => {
              if (err) throw err;
              content = file.contents.toString().trim();
            });
          const level = getLevel(f).length;
          return { content, level };
        })
      : [];
  return {
    headings,
  };
};

module.exports = withBundleAnalyzer(
  withMdxEnhanced({
    layoutPath: 'src/components/layouts',
    defaultLayout: true,
    fileExtensions: ['mdx', 'md'],
    remarkPlugins,
    extendFrontMatter: {
      process: getHeadings,
    },
  })({
    experimental: {
      modern: true,
      polyfillsOptimization: true,
      jsconfigPaths: true,
    },
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    webpack: (config, options) => {
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
  })
);

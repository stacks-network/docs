module.exports = {
  presets: ['next/babel'],
  plugins: [
    './lib/babel-plugin-nextjs-mdx-patch',
    'babel-plugin-macros',
    ['styled-components', { ssr: true }],
  ],
};

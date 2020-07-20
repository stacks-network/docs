module.exports = {
  presets: ['next/babel'],
  plugins: [
    './lib/babel-plugin-nextjs-mdx-patch',
    'babel-plugin-macros',
    [
      'prismjs',
      {
        languages: ['bash', 'css', 'jsx', 'tsx', 'json', 'toml', 'python', 'kotlin', 'nginx'],
      },
    ],
    ['styled-components', { ssr: true }],
  ],
};

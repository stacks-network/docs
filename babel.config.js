module.exports = {
  presets: ['next/babel', '@emotion/babel-preset-css-prop'],
  plugins: ['./lib/babel-plugin-nextjs-mdx-patch', 'babel-plugin-macros', '@emotion'],
};

const memoize = require('micro-memoize');
// const { rehypeVscode } = require('unified-vscode');
const { rehypeShikiTwoslash } = require('./rehype-shiki-twoslash');
const rehypeImgs = require('./rehype-image-size');

const rehypePlugins = [rehypeShikiTwoslash, rehypeImgs];

module.exports = { rehypePlugins };

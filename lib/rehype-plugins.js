const memoize = require('micro-memoize');
const { rehypeVscode } = require('unified-vscode');
const rehypeImgs = require('./rehype-image-size');

const rehypePlugins = [memoize(rehypeVscode), rehypeImgs];

module.exports = { rehypePlugins };

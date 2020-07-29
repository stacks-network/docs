const memoize = require('micro-memoize');
const { rehypeVscode } = require('unified-vscode');

const rehypePlugins = [memoize(rehypeVscode)];

module.exports = { rehypePlugins };

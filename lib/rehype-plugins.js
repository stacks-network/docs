const memoize = require('micro-memoize');
const rehypeImgs = require('./rehype-image-size');

const rehypePlugins = [rehypeImgs];

module.exports = { rehypePlugins };

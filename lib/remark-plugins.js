const memoize = require('micro-memoize');
const path = require('path');

const remarkPlugins = [
  [require('./remark-include'), { resolveFrom: path.join(__dirname, '../src/includes') }],
  require('remark-vscode'),
  memoize(require('./remark-paragraph-alerts')),
  memoize(require('remark-external-links')),
  memoize(require('remark-emoji')),
  memoize(require('remark-images')),
  memoize(require('remark-unwrap-images')),
  memoize(require('remark-normalize-headings')),
  memoize(require('remark-slug')),
];

module.exports = { remarkPlugins };

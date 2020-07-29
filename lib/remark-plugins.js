const memoize = require('micro-memoize');
const path = require('path');

const include = require('./remark-include');
const vscode = require('remark-vscode');
const emoji = require('remark-emoji');
const paragraphAlerts = require('./remark-paragraph-alerts');
const images = require('remark-images');
const unwrapImages = require('remark-unwrap-images');
const normalizeHeadings = require('remark-normalize-headings');
const slug = require('remark-slug');
const headingID = require('remark-heading-id');

const remarkPlugins = [
  [memoize(include), { resolveFrom: path.join(__dirname, '../src/includes') }],
  memoize(vscode),
  memoize(paragraphAlerts),
  memoize(emoji),
  memoize(images),
  memoize(unwrapImages),
  memoize(normalizeHeadings),
  memoize(slug),
  memoize(headingID),
];

module.exports = { remarkPlugins };

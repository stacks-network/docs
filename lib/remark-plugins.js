const memoize = require('micro-memoize');
const path = require('path');

const include = require('./remark-include');
const emoji = require('remark-emoji');
const paragraphAlerts = require('./remark-paragraph-alerts');
const images = require('remark-images');
const unwrapImages = require('remark-unwrap-images');
const normalizeHeadings = require('remark-normalize-headings');
const slug = require('remark-slug');
const headingID = require('remark-heading-id');
const sectionize = require('remark-sectionize')

const remarkPlugins = [
  [memoize(include), { resolveFrom: path.join(__dirname, '../src/includes') }],
  memoize(paragraphAlerts),
  memoize(emoji),
  memoize(images),
  memoize(unwrapImages),
  memoize(normalizeHeadings),
  memoize(slug),
  memoize(headingID),
  memoize(sectionize),
];

module.exports = { remarkPlugins };

/**
 * Routes
 *
 * This file contains our paths for all of our markdown files and is pre evaluated at runtime to get the content
 * from all the markdown: front matter and extracts all the headings from the document.
 *
 * This data is used to dynamically generate the sidenav.
 *
 */
const fm = require('front-matter');
const fs = require('fs-extra');
const path = require('path');
const sections = require('./all-routes.json');

const getHeadings = mdContent => {
  const regex = /(#+)(.*)/gm;
  const found = mdContent.match(regex);
  return found && found.length
    ? found.map(f => f && f.split('# ')[1]).filter(f => typeof f !== 'undefined')
    : undefined;
};

const routes = sections.map(section => {
  const _routes = section.routes.map(route => {
    try {
      const fileContent = fs.readFileSync(path.join('./src/pages/', route.path + '.md'), 'utf8');
      const data = fm(fileContent);
      const headings = getHeadings(data.body);
      return {
        ...route,
        ...data.attributes,
        headings,
      };
    } catch (e) {
      console.log(e);
    }
  });
  return {
    ...section,
    routes: _routes,
  };
});

module.exports = routes || [];

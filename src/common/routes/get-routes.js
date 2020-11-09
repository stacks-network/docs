// @ts-nocheck
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

const slugify = string =>
  string
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

const YAML = require('yaml');
const yamlFile = fs.readFileSync(path.resolve(__dirname, '../navigation.yaml'), 'utf8');
const navigation = YAML.parse(yamlFile);

const getFlatMap = navigation => {
  return navigation.sections.flatMap(section =>
    section.pages.flatMap(page => {
      if (page.pages) {
        let sectionPages = [];
        if (page.sections) {
          sectionPages = page.sections.flatMap(_section =>
            _section.pages.flatMap(
              sectionPage => sectionPage && sectionPage.path && `${page.path}${sectionPage.path}`
            )
          );
        }
        const pages = page.pages.flatMap(_page => {
          if (_page.pages) {
            return _page.pages.flatMap(p => `${page.path}${_page.path}${p.path}`);
          } else {
            return _page.path && `${page.path}${_page.path}`;
          }
        });
        return [...pages, ...sectionPages];
      } else {
        return `${section.title ? '/' + slugify(section.title) : ''}${page.path}`;
      }
    })
  );
};

const allRoutes = getFlatMap(navigation).filter(route => route);

const getHeadings = mdContent => {
  const regex = /(#+)(.*)/gm;
  const found = mdContent.match(regex);
  return found && found.length
    ? found.map(f => f && f.split('# ')[1]).filter(f => typeof f !== 'undefined')
    : null;
};

const routes = allRoutes.map(route => {
  try {
    const fileContent = fs.readFileSync(
      path.join('./src/pages', `${route === '/' ? 'index' : route}.md`),
      'utf8'
    );
    const data = fm(fileContent);
    const headings = getHeadings(data.body);
    return {
      path: route,
      ...data.attributes,
      headings,
    };
  } catch (e) {
    console.error('ROUTES ERROR');
    console.warn(e);
    throw new Error(e);
  }
});

module.exports = routes;

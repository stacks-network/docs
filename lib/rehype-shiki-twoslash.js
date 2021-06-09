const createShikiHighlighter = require('shiki-twoslash');
const memoize = require('micro-memoize');
const visit = require('unist-util-visit');
const pAll = require('p-all');
const hastToString = require('hast-util-to-string');

const DEFAULT_THEME = 'dark-plus';

function getTokenClassNames(token) {
  let classNames;
  let classNameString = '';
  token.explanation.forEach(expl => {
    const thing = expl.scopes.find(scope => scope.themeMatches.length > 0);
    const themeMatches = thing && thing.themeMatches && thing.themeMatches[0];
    const name = themeMatches && themeMatches.name;
    const formatted =
      name &&
      name
        .toString()
        .split(', ')
        .map(entry => entry.toLowerCase());
    if (formatted) {
      classNames = formatted;
    }
  });

  classNames &&
    classNames.length &&
    classNames.forEach((className, index) => {
      classNameString += `${slugify(className)}${index !== classNames.length - 1 ? ' ' : ''}`;
    });

  return classNameString === '' ? 'plain' : classNameString;
}

function removeEmptyLine(index, tree) {
  const [item] = tree.slice(index * -1);
  if (item && item.properties && item.properties.className.includes('empty')) {
    tree.pop();
  }
}

function codeLanguage(node) {
  const className = node.properties.className || [];
  let value;

  for (const element of className) {
    value = element;

    if (value.slice(0, 9) === 'language-') {
      return value.slice(9);
    }
  }

  return 'bash';
}

const rehypeShikiTwoslash = options => {
  let theme = options.theme || DEFAULT_THEME;
  const generateHighlighter = memoize(async () => createShikiHighlighter({ theme, cache }), {
    isPromise: true,
  });

  const highlight = async (node, lang) => {
    const hash = generateHash(node);
    return cache.wrap(hash, async () => {
      const highlighter = await generateHighlighter();
      return highlighter.codeToThemedTokens(node, lang);
    });
  };

  function tokensToHast(lines) {
    const tokenLineClassName = (options && options.tokenLineClassName) || 'token-line';
    const tokenLineElement = (options && options.tokenLineElement) || 'span';
    const tree = [];

    for (const line of lines) {
      if (line.length === 0) {
        tree.push(
          u('element', {
            tagName: tokenLineElement,
            properties: { className: `${tokenLineClassName} ${tokenLineClassName}__empty` },
          })
        );
      } else {
        const lineChildren = [];

        for (const token of line) {
          const className = getTokenClassNames(token);
          lineChildren.push(
            u(
              'element',
              {
                tagName: 'span',
                properties: { style: `color: ${token.color}`, className: `token ${className}` },
              },
              [u('text', token.content)]
            )
          );
        }
        tree.push(
          u(
            'element',
            { tagName: tokenLineElement, properties: { className: tokenLineClassName } },
            lineChildren
          )
        );
      }
    }
    removeEmptyLine(2, tree);
    removeEmptyLine(1, tree);

    return tree;
  }

  async function transformer(tree) {
    const nodes = [];

    visit(tree, 'element', (node, index, parent) => {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return;
      } else {
        nodes.push(node);
      }
    });

    await pAll(
      nodes.map(node => () => visitor(node)),
      { concurrency: 25 }
    );
    return tree;
  }

  async function visitor(node) {
    const lang = codeLanguage(node);
    const tokens = await highlight(hastToString(node), lang);
    const tree = tokensToHast(tokens);
    node.properties.lines = tokens.length - 1;
    node.properties.lang = lang;
    node.children = tree;
  }

  return transformer;
};

module.exports = rehypeShikiTwoslash;

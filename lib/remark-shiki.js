const shiki = require('shiki');
const visit = require('unist-util-visit');

module.exports = function shikiPlugin(options) {
  return async function transformer(tree) {
    const theme = (options && options.theme) || 'zeit';
    let shikiTheme;

    try {
      shikiTheme = shiki.getTheme(theme);
    } catch (_) {
      try {
        shikiTheme = shiki.loadTheme(theme);
      } catch (_) {
        throw new Error(`Unable to load theme: ${theme}`);
      }
    }

    const highlighter = await shiki.getHighlighter({
      theme: shikiTheme,
    });

    visit(tree, 'code', (node, _, parent) => {
      node.type = 'html';
      node.children = undefined;
      if (!node.lang && !options.defaultLang) {
        node.value = `<pre class="shiki-unknown"><code>${node.value}</code></pre>`;
        return;
      }

      node.value = highlighter.codeToHtml(
        node.value,
        (node.lang && node.lang.toLowerCase()) || options.defaultLang
      );
    });
  };
};

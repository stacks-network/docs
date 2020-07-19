import clarityRefData from '@common/_data/clarityRef.json';
import { getHighlighter, getTheme } from 'shiki';
import { SHIKI_THEME } from '@common/constants';

export const renderClarityRefCodeWithShiki = async () => {
  const { functions: _fns, keywords: _keywords, ...rest } = clarityRefData;

  const theme = getTheme(SHIKI_THEME);
  const highlighter = await getHighlighter({
    theme,
  });

  const functions = _fns.map(entry => ({
    ...entry,
    example: highlighter.codeToHtml(entry.example.trim(), 'clarity'),
  }));

  const keywords = _keywords.map(entry => ({
    ...entry,
    example: highlighter.codeToHtml(entry.example.trim(), 'clarity'),
  }));

  return {
    props: {
      reference: {
        ...rest,
        functions,
        keywords,
      },
    },
  };
};

export const getStaticProps = async context => {
  const ref = await renderClarityRefCodeWithShiki();
  return {
    props: {
      ref,
    },
  };
};

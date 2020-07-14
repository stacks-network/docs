import React from 'react';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { SimpleCodeBlock } from '@components/code-block/components';
import { useForceUpdate } from '@blockstack/ui';

export const CodeBlock = ({ className, live = true, isManual, render, children, ...props }) => {
  const update = useForceUpdate();
  React.useEffect(() => {
    update();
  }, []);

  const language = className && className.replace(/language-/, '');

  return <SimpleCodeBlock editorCode={children.toString()} language={language} {...props} />;
};

CodeBlock.defaultProps = {
  mountStylesheet: false,
};

export default CodeBlock;

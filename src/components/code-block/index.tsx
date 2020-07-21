import React from 'react';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-kotlin';

import { SimpleCodeBlock } from '@components/code-block/components';
import { useForceUpdate } from '@blockstack/ui';

export const CodeBlock = React.memo(
  ({ className, live = true, isManual, render, children, ...props }: any) => {
    const update = useForceUpdate();
    React.useEffect(() => {
      update();
    }, []);

    const language = className && className.replace(/language-/, '');

    return (
      <SimpleCodeBlock
        editorCode={children.toString()}
        showLineNumbers={language !== 'bash'}
        language={language}
        {...props}
      />
    );
  }
);

export default CodeBlock;

import React from 'react';
import { mdx, MDXProvider } from '@mdx-js/react';

export const hydrate = ({ source, renderedOutput, scope = {} }, components) => {
  // first we set up the scope which has to include the mdx custom
  // create element function as well as any components we're using
  const fullScope = { mdx, ...components, ...scope };
  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);

  // now we eval the source code using a function constructor
  // in order for this to work we need to have React, the mdx createElement,
  // and all our components in scope for the function, which is the case here
  // we pass the names (via keys) in as the function's args, and execute the
  // function with the actual values.
  const hydratedFn = new Function(
    'React',
    ...keys,
    `${source}
      return React.createElement(MDXContent, {});`
  )(React, ...values);

  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  // @ts-ignore
  const wrappedWithMdxProvider = React.createElement(MDXProvider, { components }, hydratedFn);

  // finally, set the the output as the new result so that react will re-render for us
  // and cancel the idle callback since we don't need it anymore
  return wrappedWithMdxProvider;
};

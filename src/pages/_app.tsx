import React from 'react';
import type { AppProps } from 'next/app';

import { CSSReset, ThemeProvider } from '@blockstack/ui';
import { AppWrapper } from '@components/app-wrapper';

import '@docsearch/css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps, ...rest }) => (
  <ThemeProvider>
    <CSSReset />
    <AppWrapper {...rest}>
      <Component {...pageProps} />
    </AppWrapper>
  </ThemeProvider>
);

export default MyApp;

import { AppProps } from 'next/app';
import * as React from 'react';
import 'modern-normalize/modern-normalize.css';
import { AppWrapper } from '@components/app-wrapper';
import { theme } from '@stacks/ui';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { cache } from '@emotion/css';

import '@docsearch/css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps, ...rest }) => (
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <AppWrapper {...rest}>
        <Component {...pageProps} />
      </AppWrapper>
    </ThemeProvider>
  </CacheProvider>
);

export default MyApp;

import React from 'react';
import { CSSReset, ThemeProvider } from '@blockstack/ui';
import { useMediaQuery } from '@common/hooks/use-media-query';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@components/mdx';
import { AppStateProvider } from '@components/app-state';
import { MdxOverrides } from '@components/mdx/overrides';
import { ProgressBar } from '@components/progress-bar';
import GoogleFonts from 'next-google-fonts';
import '@docsearch/react/dist/style.css';
import { BaseLayout } from '@components/layouts/base-layout';
import { THEME_STORAGE_KEY } from '@common/constants';
import { ColorModes } from '@components/color-modes/styles';

const setDarkMode = setColorMode => {
  localStorage.setItem(THEME_STORAGE_KEY, 'dark');
  setColorMode('dark');
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
};
const setLightMode = setColorMode => {
  localStorage.setItem(THEME_STORAGE_KEY, 'light');
  setColorMode('light');
  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
};

export const useColorMode = () => {
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  const [lightmode] = useMediaQuery('(prefers-color-scheme: light)');
  const setMode = typeof localStorage !== 'undefined' && localStorage.getItem(THEME_STORAGE_KEY);

  const [colorMode, setColorMode] = React.useState(undefined);

  React.useEffect(() => {
    if (setMode) {
      if (setMode === 'dark') {
        setColorMode('dark');
      }
      if (setMode === 'light') {
        setColorMode('light');
      }
    } else {
      if (darkmode) {
        setDarkMode(setColorMode);
      }
      if (lightmode) {
        setLightMode(setColorMode);
      }
    }
  }, [setMode, lightmode, darkmode]);

  const toggleColorMode = () => {
    if (typeof document !== 'undefined') {
      if (setMode) {
        if (setMode === 'light') {
          setDarkMode(setColorMode);
        } else {
          setLightMode(setColorMode);
        }
      } else if (darkmode) {
        setLightMode(setColorMode);
      } else {
        setDarkMode(setColorMode);
      }
    }
  };

  return [colorMode, toggleColorMode, setColorMode];
};

const AppWrapper = ({ children, isHome }: any) => {
  return (
    <>
      <MdxOverrides />
      <ColorModes />
      <ProgressBar />
      <MDXProvider components={MDXComponents}>
        <AppStateProvider>
          <BaseLayout isHome={isHome}>{children}</BaseLayout>
        </AppStateProvider>
      </MDXProvider>
    </>
  );
};

const MyApp = ({ Component, pageProps, colorMode, ...rest }: any) => {
  const { isHome } = pageProps;

  return (
    <>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@400;500;600;700&display=swap" />
      <ThemeProvider>
        <CSSReset />
        <AppWrapper isHome={isHome} {...rest}>
          <Component {...pageProps} />
        </AppWrapper>
      </ThemeProvider>
    </>
  );
};

export default MyApp;

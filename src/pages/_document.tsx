import React from 'react';
import Document, {
  DocumentContext,
  DocumentProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { THEME_STORAGE_KEY } from '@common/constants';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/static/fonts/soehne-mono-web-buch.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/static/fonts/soehne-web-buch.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/static/fonts/soehne-web-kraftig_1.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <link
            rel="preload"
            href="/static/fonts/soehne-web-halbfett_1.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="true"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face {
  font-family: 'Soehne Mono';
  src: url('/static/fonts/soehne-mono-web-buch.woff2') format('woff2'),
       url('/static/fonts/soehne-mono-web-buch.woff') format('woff');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}
@font-face {
  font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-buch.woff2') format('woff2'),
       url('/static/fonts/soehne-web-buch.woff') format('woff');
  font-weight: 400;
  font-display: swap;
  font-style: normal;
}
@font-face {
    font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-kraftig_1.woff2') format('woff2'),
       url('/static/fonts/soehne-web-kraftig_1.woff') format('woff');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}
@font-face {
    font-family: 'Soehne';
  src: url('/static/fonts/soehne-web-halbfett_1.woff2') format('woff2'),
       url('/static/fonts/soehne-web-halbfett_1.woff') format('woff');
  font-weight: 600;
  font-display: swap;
  font-style: normal;
}
`,
            }}
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                try {
                  var mode = localStorage.getItem('${THEME_STORAGE_KEY}')
                  if (!mode) return
                  document.documentElement.classList.add(mode)
                  var bgValue = getComputedStyle(document.documentElement)
                    .getPropertyValue('--colors-bg')
                  document.documentElement.style.background = bgValue
                } catch (e) {}
              })()`,
            }}
          />
          <link rel="preconnect" href="https://bh4d9od16a-dsn.algolia.net" crossOrigin="true" />
          <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="true" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

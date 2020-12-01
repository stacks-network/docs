import * as React from 'react';
import { jsx, css, Global } from '@emotion/react';
import { theme, generateCssVariables } from '@stacks/ui';

export const Base = (
  <Global
    styles={css`
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      :root {
        ${generateCssVariables('light')({ colorMode: 'light', theme })};
        --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);

        @media (prefers-color-scheme: dark) {
          ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
          --colors-highlight-line-bg: rgba(255, 255, 255, 0.05);
        }
      }
      html,
      body,
      #__next {
        background: var(--colors-bg);
        border-color: var(--colors-border);

        &.light {
          :root {
            ${generateCssVariables('light')({ colorMode: 'light', theme })};
            --colors-highlight-line-bg: rgba(255, 255, 255, 0.1);
          }
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        &.dark {
          :root {
            ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
            --colors-highlight-line-bg: rgba(255, 255, 255, 0.04);
          }
          * {
            -webkit-font-smoothing: subpixel-antialiased;
            -moz-osx-font-smoothing: auto;
          }
        }
      }
    `}
  />
);

export const ColorModes = Base;

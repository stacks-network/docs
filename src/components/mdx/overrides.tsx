import React from 'react';
import { color } from '@stacks/ui';
import { css, Global } from '@emotion/react';

const GlobalStyles = (
  <Global
    styles={css`
      blockquote,
      dl,
      dd,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      hr,
      figure,
      p,
      pre {
        margin: 0px;
      }
      :root {
        --reach-tooltip: 1;
      }
      a {
        text-decoration: none;
      }
      * {
        font-feature-settings: 'onum' 1, 'pnum' 1, 'kern' 1, 'ss01' 1;
      }
      html,
      body {
        font-family: 'Soehne', Inter, sans-serif;
      }

      @counter-style list {
        pad: '0';
      }
      img {
        image-rendering: crisp-edges;
        will-change: transform;
      }
      :root {
        --docsearch-modal-background: ${color('bg')};
        --docsearch-text-color: ${color('text-title')};
        --docsearch-icon-color: ${color('text-caption')};
        --docsearch-primary-color: ${color('accent')};
        --docsearch-input-color: ${color('text-title')};
        --docsearch-highlight-color: ${color('bg-alt')};
        --docsearch-placeholder-color: ${color('text-caption')};
        --docsearch-container-background: rgba(22, 22, 22, 0.75);
        --docsearch-modal-shadow: inset 0px 0px 1px 1px ${color('border')};
        --docsearch-searchbox-background: var(--ifm-color-emphasis-300);
        --docsearch-searchbox-focus-background: ${color('bg')};
        --docsearch-searchbox-shadow: inset 0px 0px 1px 1px ${color('border')};
        --docsearch-hit-color: ${color('accent')};
        --docsearch-hit-active-color: ${color('text-title')};
        --docsearch-hit-background: ${color('bg')};
        --docsearch-hit-shadow: inset 0px 0px 1px 1px ${color('border')};
        --docsearch-key-gradient: transparent;
        --docsearch-key-shadow: inset 0px -2px 0px 0px transparent,
          inset 0px 0px 1px 1px transparent, 0px 1px 2px 1px transparent;
        --docsearch-footer-background: ${color('bg')};
        --docsearch-footer-shadow: inset 0px 0px 1px 1px ${color('border')};
        --docsearch-logo-color: #5468ff;
        --docsearch-muted-color: #969faf;
        --docsearch-modal-width: 560px;
        --docsearch-modal-height: 600px;
        --docsearch-searchbox-height: 56px;
        --docsearch-hit-height: 56px;
        --docsearch-footer-height: 44px;
        --docsearch-spacing: 12px;
        --docsearch-icon-stroke-width: 1.4;
      }
      .DocSearch-Container {
        z-index: 99999;
      }
      .DocSearch-SearchBar {
        padding: var(--docsearch-spacing);
      }
      .DocSearch-Reset:hover {
        color: ${color('accent')};
      }
      .DocSearch-Cancel {
        color: ${color('text-caption')};
      }
      .DocSearch-Form {
        input {
          color: ${color('text-title')};
        }
        &:focus-within {
          box-shadow: 0 0 0 3px rgba(170, 179, 255, 0.75);
        }
      }
      .DocSearch-Help {
        text-align: center;
      }
      .DocSearch-Prefill {
        color: ${color('accent')} !important;
      }
      .DocSearch-Hit {
        mark {
          color: ${color('accent')} !important;
        }
      }
      .DocSearch-Hit-source {
        color: ${color('text-caption')};
      }
      .DocSearch-MagnifierLabel {
        color: ${color('accent')};
      }
      @media (max-width: 750px) {
        .DocSearch-Dropdown {
          max-height: calc(100vh - 124px);
        }
      }
      pre {
        display: inline-block;
      }
      p,
      ul,
      ol,
      table {
        color: ${color('text-body')};
        a > pre {
          color: ${color('accent')} !important;
        }
      }
    `}
  />
);
export const MdxOverrides = GlobalStyles;

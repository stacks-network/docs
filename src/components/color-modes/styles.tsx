import { createGlobalStyle } from 'styled-components';
import { generateCssVariables } from '@blockstack/ui';

export const ColorModes = createGlobalStyle`
  :root{
    ${generateCssVariables('light')};
    --colors-highlight-line-bg: rgba(255,255,255,0.08);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      ${generateCssVariables('dark')};
      --colors-highlight-line-bg: rgba(255,255,255,0.04);
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      ${generateCssVariables('light')};
      --colors-highlight-line-bg: rgba(255,255,255,0.08);
    }
  }

  html, body, #__next {
    background: var(--colors-bg);
    border-color: var(--colors-border);
    
    &.light {
      ${generateCssVariables('light')};
      --colors-highlight-line-bg: rgba(255,255,255,0.08);
    }
    &.dark {
      ${generateCssVariables('dark')};
      --colors-highlight-line-bg: rgba(255,255,255,0.04);
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color:  var(--colors-input-placeholder) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color:  var(--colors-input-placeholder) !important;
  }
  `;

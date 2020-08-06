import React from 'react';
import { color } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
* {
  font-feature-settings: 'ss01' on;
}
html, body {
  font-family: 'Soehne', Inter, sans-serif;
}
@counter-style list {
 pad: "0";
}
img{
  image-rendering: crisp-edges;
  will-change: transform;
}
.headroom {
  top: 0;
  left: 0;
  right: 0;
  zIndex: 1;
}
.headroom--unfixed {
  position: relative;
  transform: translateY(0);
}
.headroom--scrolled {
  transition: transform 200ms ease-in-out;
}
.headroom--unpinned {
  position: fixed;
  transform: translateY(-100%);
}
.headroom--pinned {
  position: fixed;
  transform: translateY(0%);
}
:root{
--docsearch-modal-background:  ${color('bg')};
--docsearch-text-color:  ${color('text-title')};
--docsearch-icon-color:  ${color('text-caption')};
--docsearch-primary-color: ${color('accent')};
--docsearch-input-color: ${color('text-title')};
--docsearch-highlight-color: ${color('bg-alt')};
--docsearch-placeholder-color: ${color('text-caption')};
--docsearch-container-background: rgba(22,22,22,0.75);
--docsearch-modal-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-searchbox-background: var(--ifm-color-emphasis-300);
--docsearch-searchbox-focus-background: ${color('bg')};;
--docsearch-searchbox-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-hit-color: var(--ifm-color-emphasis-800);
--docsearch-hit-active-color: ${color('text-title')};
--docsearch-hit-background: ${color('bg')};
--docsearch-hit-shadow: inset 0px 0px 1px 1px ${color('border')};
--docsearch-key-gradient: transparent;
--docsearch-key-shadow: inset 0px -2px 0px 0px transparent,inset 0px 0px 1px 1px transparent,0px 1px 2px 1px transparent;
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
.DocSearch-Container{
  z-index: 99999;
}
.DocSearch-SearchBar{
  padding: var(--docsearch-spacing);
}
.DocSearch-Reset:hover{
  color: ${color('accent')};
}
.DocSearch-Form{
  input{
    color: ${color('text-title')};
  }
  &:focus-within{
    box-shadow: 0 0 0 3px rgba(170, 179, 255, 0.75);
  }
}
.DocSearch-Help{
  text-align: center;
}
.DocSearch-Prefill{
  color: ${color('accent')} !important;
}
.DocSearch-Hit{
  mark{
    color: ${color('accent')} !important;
  }
}
.DocSearch-Hit-source{
  color: ${color('text-caption')};
}
.DocSearch-MagnifierLabel{
  color: ${color('accent')};
}

pre{
  display: inline-block;
}
p, ul, ol, table {
  color: ${color('text-body')};
  a > pre {
    color: ${color('accent')} !important;
  }
}
`;
export const MdxOverrides: React.FC<any> = props => (
  <>
    <GlobalStyles />
  </>
);

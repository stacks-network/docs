import React from 'react';
import {
  Pre,
  THead,
  SmartLink,
  TData,
  Table,
  InlineCode,
  H2,
  H3,
  H4,
  H5,
  H6,
  Blockquote,
  Br,
  Ul,
  P,
  Ol,
  Hr,
  Li,
  Sup,
  Section,
} from '@components/mdx/components';
import { Img } from '@components/mdx/image';
import { Code } from '@components/mdx/components';
import { PageReference } from '@components/custom-blocks/page-reference';

export const Components = {
  h1: () => null,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  inlineCode: InlineCode,
  pre: Pre,
  br: Br,
  hr: Hr,
  table: Table,
  th: THead,
  td: TData,
  a: SmartLink,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  img: Img,
  blockquote: Blockquote,
  sup: Sup,
  section: Section,
  undefined: () => null,
};

export const MDXComponents = {
  ...Components,
  pagereference: PageReference,
};

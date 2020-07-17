import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const CodeIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="7 8 3 12 7 16" />
    <polyline points="17 8 21 12 17 16" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </BaseSvg>
);

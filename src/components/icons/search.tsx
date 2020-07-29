import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const SearchIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  </BaseSvg>
);

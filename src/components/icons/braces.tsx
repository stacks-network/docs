import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const BracesIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2" />
    <path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2" />
  </BaseSvg>
);

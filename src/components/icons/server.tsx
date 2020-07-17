import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const ServerIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <rect x="3" y="4" width="18" height="8" rx="3" />
    <rect x="3" y="12" width="18" height="8" rx="3" />
    <line x1="7" y1="8" x2="7" y2="8.01" />
    <line x1="7" y1="16" x2="7" y2="16.01" />
  </BaseSvg>
);

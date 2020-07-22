import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const InfoCircleIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
    <polyline points="11 12 12 12 12 16 13 16" />
  </BaseSvg>
);

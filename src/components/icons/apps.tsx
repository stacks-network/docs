import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const AppsIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
    <line x1="14" y1="7" x2="20" y2="7" />
    <line x1="17" y1="4" x2="17" y2="10" />
  </BaseSvg>
);

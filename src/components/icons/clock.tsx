import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const ClockIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </BaseSvg>
);

import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const CheckCircleIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2l4 -4" />
  </BaseSvg>
);

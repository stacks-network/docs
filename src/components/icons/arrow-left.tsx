import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const ArrowLeftIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <line x1="5" y1="12" x2="19" y2="12" />
    <line x1="5" y1="12" x2="11" y2="18" />
    <line x1="5" y1="12" x2="11" y2="6" />
  </BaseSvg>
);

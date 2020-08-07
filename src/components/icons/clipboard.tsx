import React from 'react';
import { BaseSvg, SvgProps } from '@components/icons/_base';

export const ClipboardIcon: SvgProps = props => (
  <BaseSvg {...props}>
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
  </BaseSvg>
);

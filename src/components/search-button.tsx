import React, { forwardRef, Ref } from 'react';
import { IconButton } from '@stacks/ui';
import { LinkProps } from '@components/typography';

import { useAppState } from '@common/hooks/use-app-state';
import { MagnifyingGlass } from './icons/magnifying-glass';

export const SearchButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => {
  const { setState } = useAppState();

  return (
    <IconButton
      display={['grid', 'grid', 'none']}
      onClick={() => setState(state => ({ ...state, searchModal: 'open' }))}
      title="Search docs"
      ref={ref}
      iconSize="18px"
      icon={MagnifyingGlass}
      {...props}
    />
  );
});

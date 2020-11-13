import React, { forwardRef, Ref } from 'react';
import { color } from '@stacks/ui';
import { LinkProps } from '@components/typography';
import { IconButton } from '@components/icon-button';
import { useAppState } from '../common/hooks/use-app-state';
import { MagnifyingGlass } from './icons/magnifying-glass';

export const SearchButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => {
  const { setState, searchModal } = useAppState();

  return (
    <IconButton
      onClick={() => setState(state => ({ ...state, searchModal: 'open' }))}
      title="Search docs"
      px="base"
      {...props}
      ref={ref}
    >
      {searchModal}
      <MagnifyingGlass size={18} color={color('text-title')} />
    </IconButton>
  );
});

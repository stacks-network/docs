import React from 'react';
import { State } from '@components/app-state/types';
import routes from '@common/routes';

export const initialState: State = {
  mobileMenu: false,
  activeSlug: '',
  setState: (value: any) => null,
  routes,
  searchModal: 'closed',
};
export const AppStateContext = React.createContext<State>(initialState);

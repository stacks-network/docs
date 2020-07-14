import React from 'react';
import { AppStateContext, initialState } from '@components/app-state/context';

const AppStateProvider = ({ ...props }: any) => {
  const [state, setState] = React.useState(initialState);

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setState,
      }}
      {...props}
    />
  );
};

export { AppStateProvider, AppStateContext };

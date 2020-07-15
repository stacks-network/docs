import React from 'react';
import { Main } from '@components/main';

const HomeLayout: React.FC<any> = ({ children }) => {
  return (
    <Main mx="unset" width={'100%'}>
      {children}
    </Main>
  );
};

export { HomeLayout };

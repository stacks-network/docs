import React from 'react';
import { AppStateProvider } from '@components/app-state';
import { MdxOverrides } from '@components/mdx/overrides';
import { ProgressBar } from '@components/progress-bar';
import { BaseLayout } from '@components/layouts/base-layout';
import { ColorModes } from '@components/color-modes/styles';
import { Meta } from '@components/meta-head';
import { useFathom } from '@common/hooks/use-fathom';

export const AppWrapper: React.FC<any> = ({ children, isHome }) => {
  useFathom();
  return (
    <>
      <Meta />
      <MdxOverrides />
      <ColorModes />
      <ProgressBar />
      <AppStateProvider>
        <BaseLayout isHome={isHome}>{children}</BaseLayout>
      </AppStateProvider>
    </>
  );
};

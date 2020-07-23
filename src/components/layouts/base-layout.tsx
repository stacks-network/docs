import React from 'react';
import { Flex } from '@blockstack/ui';
import { SideNav } from '../side-nav';
import { Header, HEADER_HEIGHT } from '../header';
import { Main } from '../main';
import { Footer } from '../footer';
import NotFoundPage from '@pages/404';
import { SIDEBAR_WIDTH } from '@common/constants';

const BaseLayout: React.FC<{ isHome?: boolean }> = ({ children, isHome }) => {
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Header hideSubBar={isHome || isErrorPage} />
      <Flex width="100%" flexGrow={1}>
        {!isHome && <SideNav display={['none', 'none', 'block']} />}
        <Flex
          flexGrow={1}
          maxWidth={[
            '100%',
            '100%',
            `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
            `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
          ]}
          mt={`${HEADER_HEIGHT}px`}
          flexDirection="column"
        >
          <Main mx="unset" width={'100%'}>
            <Flex
              flexDirection={['column', 'column', 'row', 'row']}
              maxWidth="108ch"
              mx="auto"
              flexGrow={1}
            >
              {children}
            </Flex>
          </Main>
          {isErrorPage || isHome ? null : <Footer justifySelf="flex-end" />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export { BaseLayout };

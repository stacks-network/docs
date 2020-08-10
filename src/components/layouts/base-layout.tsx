import React from 'react';
import { Flex } from '@blockstack/ui';
import { SideNav } from '../side-nav';
import { Header } from '../header';
import { Main } from '../main';
import { Footer } from '../footer';
import NotFoundPage from '@pages/404';
import { PAGE_WIDTH, SIDEBAR_WIDTH } from '@common/constants';
import { useWatchActiveHeadingChange } from '@common/hooks/use-active-heading';
import { useRouter } from 'next/router';
import { MobileMenu } from '@components/mobile-menu';

const BaseLayout: React.FC<{ isHome?: boolean }> = ({ children }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });

  useWatchActiveHeadingChange();
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <MobileMenu />
      <Header />
      <Flex flexGrow={1} width="100%" mx="auto" px={['0', '0', 'extra-loose', 'extra-loose']}>
        <Flex width="100%" flexGrow={1} maxWidth={`${PAGE_WIDTH}px`} mx="auto">
          <SideNav display={['none', 'none', 'block']} />
          <Flex
            flexGrow={1}
            maxWidth={[
              '100%',
              '100%',
              `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
              `calc(100% - ${isHome ? 0 : SIDEBAR_WIDTH}px)`,
            ]}
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
            {isErrorPage ? null : <Footer justifySelf="flex-end" />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { BaseLayout };

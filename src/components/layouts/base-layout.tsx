import React from 'react';
import { Flex, Box, FlexProps, color, space, CloseIcon, Fade, Transition } from '@blockstack/ui';
import { SideNav } from '../side-nav';
import { Header, HEADER_HEIGHT } from '../header';
import { Main } from '../main';
import { Footer } from '../footer';
import NotFoundPage from '@pages/404';
import { SIDEBAR_WIDTH } from '@common/constants';
import { useWatchActiveHeadingChange } from '@common/hooks/use-active-heading';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { border } from '@common/utils';
import { useRouter } from 'next/router';

const MobileMenu: React.FC<FlexProps> = props => {
  const { isOpen, handleClose } = useMobileMenuState();
  const [slideIn, setSlideIn] = React.useState(false);
  React.useEffect(() => {
    if (isOpen && !slideIn) {
      setTimeout(() => {
        setSlideIn(true);
      }, 0);
    } else if (slideIn && !isOpen) {
      setSlideIn(false);
    }
  }, [isOpen]);

  useLockBodyScroll(isOpen);
  return (
    <Box position="fixed" zIndex={999999} left={0} top={0}>
      <Fade in={isOpen} timeout={250}>
        {styles => (
          <Box style={{ willChange: 'opacity', ...styles }}>
            <Box
              position="fixed"
              onClick={handleClose}
              zIndex={999999}
              left={0}
              top={0}
              size="100%"
              bg="ink"
              opacity={0.5}
            />
            <Transition
              timeout={350}
              styles={{
                init: {
                  opacity: 0,
                  transform: 'translateX(50%)',
                },
                entered: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
                exited: {
                  opacity: 0,
                  transform: 'translateX(50%)',
                },
              }}
              in={isOpen}
            >
              {slideStyles => (
                <Box
                  position="fixed"
                  zIndex={999999}
                  right={0}
                  top={0}
                  width="80%"
                  height="100%"
                  bg={color('bg')}
                  style={{
                    willChange: 'opacity, transform',
                    ...slideStyles,
                  }}
                  borderLeft={border()}
                >
                  <Flex
                    align="center"
                    justifyContent="flex-end"
                    height="72px"
                    px={space(['extra-loose', 'extra-loose', 'base', 'base'])}
                    position="fixed"
                    top={0}
                    right={0}
                    zIndex={999999}
                  >
                    <Box
                      _hover={{
                        cursor: 'pointer',
                      }}
                      onClick={handleClose}
                      size="14px"
                      mr={space('tight')}
                      color={color('invert')}
                    >
                      <CloseIcon />
                    </Box>
                  </Flex>
                  <Box
                    maxHeight="100vh"
                    overflow="auto"
                    px={space(['extra-loose', 'extra-loose', 'base', 'base'])}
                    py={space('extra-loose')}
                  >
                    <SideNav
                      height="unset"
                      overflow="inherit"
                      width="100%"
                      containerProps={{
                        position: 'static',
                        overflow: 'inherit',
                        height: 'unset',
                        pt: 0,
                        pb: 0,
                        px: 0,
                        width: '100%',
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Transition>
          </Box>
        )}
      </Fade>
    </Box>
  );
};

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
      <Flex width="100%" flexGrow={1} maxWidth="1280px" mx="auto">
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
  );
};

export { BaseLayout };

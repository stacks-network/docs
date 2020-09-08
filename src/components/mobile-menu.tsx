import React from 'react';
import { Flex, Box, FlexProps, color, space, CloseIcon, Fade, Transition } from '@stacks/ui';
import { SideNav } from '@components/side-nav';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { border } from '@common/utils';

export const MobileMenu: React.FC<FlexProps> = props => {
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
    <Box position="fixed" zIndex={999999} left={0} top={0} {...props}>
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
                    alignItems="center"
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

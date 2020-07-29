import React from 'react';
import { Box, Flex, Portal, space, Fade, themeColor, color, BoxProps } from '@blockstack/ui';
import { useDocSearchKeyboardEvents } from '@docsearch/react';

import { Text } from '@components/typography';
import { SearchIcon } from '@components/icons/search';
import Router from 'next/router';
import Link from 'next/link';

const getLocalUrl = href => {
  const _url = new URL(href);
  const url = href
    .replace(_url.origin, '')
    .replace('#__next', '')
    .replace('.html', '')
    .replace('storage/clidocs', 'core/cmdLineRef');
  return url;
};

function Hit({ hit, children }: any) {
  const url = getLocalUrl(hit.url);
  return (
    <Link href={url} as={url} passHref scroll={!url.includes('#')}>
      <a>{children}</a>
    </Link>
  );
}

const navigator = {
  navigate: async ({ suggestionUrl }: any) => {
    const url = getLocalUrl(suggestionUrl);
    return Router.push(url, url);
  },
};

const searchOptions = {
  apiKey: '9040ba6d60f5ecb36eafc26396288875',
  indexName: 'blockstack',
  navigator,
};

let DocSearchModal: any = null;

export const SearchBox: React.FC<BoxProps> = React.memo(props => {
  const [isOpen, setIsOpen] = React.useState(false);

  const importDocSearchModalIfNeeded = React.useCallback(function importDocSearchModalIfNeeded() {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([import('@docsearch/react/modal')]).then(([{ DocSearchModal: Modal }]) => {
      DocSearchModal = Modal;
    });
  }, []);

  const onOpen = React.useCallback(
    function onOpen() {
      void importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true);
      });
    },
    [importDocSearchModalIfNeeded, setIsOpen]
  );

  const onClose = React.useCallback(
    function onClose() {
      setIsOpen(false);
    },
    [setIsOpen]
  );

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  return (
    <>
      <Portal>
        <Fade in={isOpen}>
          {styles => (
            <Box position="absolute" zIndex={9999} style={styles}>
              <DocSearchModal
                initialScrollY={window.scrollY}
                {...searchOptions}
                onClose={onClose}
                hitComponent={Hit}
              />
            </Box>
          )}
        </Fade>
      </Portal>
      <Box
        bg={color('bg-alt')}
        minWidth="200px"
        borderRadius="12px"
        display={['none', 'none', 'block', 'block']}
        border="1px solid"
        borderColor={isOpen ? 'rgba(170, 179, 255, 0.8)' : color('bg-alt')}
        boxShadow={
          isOpen ? '0 0 0 3px rgba(170, 179, 255, 0.25)' : '0 0 0 3px rgba(170, 179, 255, 0)'
        }
        transition="border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
        _hover={{
          borderColor: 'rgba(170, 179, 255, 0.8)',
          boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.25)',
        }}
        {...props}
      >
        <Flex
          onClick={onOpen}
          px={space('base-tight')}
          py={space('tight')}
          align="center"
          _hover={{ borderColor: themeColor('blue.400'), cursor: 'pointer' }}
        >
          <Box transform="scaleX(-1)" mr={space('tight')} color={color('text-caption')}>
            <SearchIcon size="18px" />
          </Box>
          <Text fontSize={'14px'} color={color('text-caption')}>
            Search docs
          </Text>
        </Flex>
      </Box>
    </>
  );
});

export default SearchBox;

import React from 'react';
import {
  Box,
  Flex,
  Portal,
  space,
  Fade,
  themeColor,
  color,
  BoxProps,
  Grid,
  Stack,
} from '@stacks/ui';
import { useDocSearchKeyboardEvents } from '@docsearch/react';
import { Text } from '@components/typography';
import { SearchIcon } from '@components/icons/search';
import Router from 'next/router';
import Link from 'next/link';
import { getCapsizeStyles } from '@components/mdx/typography';
import { css } from '@stacks/ui-core';
import { border } from '@common/utils';

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

const Key: React.FC<BoxProps> = React.memo(({ children, ...rest }) => (
  <Grid
    style={{
      placeItems: 'center',
    }}
    size="18px"
    bg={'rgba(0,0,0,0.11)'}
    borderRadius="3px"
    opacity={0.65}
    {...rest}
  >
    <Text
      {...{
        color: color('text-body'),
        display: 'block',
        transform: 'translateY(1px)',
        ...getCapsizeStyles(12, 12),
      }}
    >
      {children}
    </Text>
  </Grid>
));

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

  const searchButtonRef = React.useRef(null);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose, searchButtonRef });

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
        width="100%"
        borderRadius="12px"
        display={['none', 'none', 'block', 'block']}
        border="1px solid"
        borderColor={isOpen ? 'rgba(170, 179, 255, 0.8)' : color('border')}
        boxShadow={
          isOpen ? '0 0 0 3px rgba(170, 179, 255, 0.25)' : '0 0 0 3px rgba(170, 179, 255, 0)'
        }
        transition="border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
        _hover={{
          borderColor: 'rgba(170, 179, 255, 0.8)',
          boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.25)',
          cursor: 'pointer',
        }}
        style={{
          userSelect: 'none',
        }}
        {...props}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Flex
            ref={searchButtonRef}
            onClick={onOpen}
            px={space('base-tight')}
            py={space('tight')}
            alignItems="center"
            _hover={{ borderColor: themeColor('blue.400') }}
          >
            <Box
              transform="scaleX(-1)"
              mr={space('tight')}
              opacity={0.6}
              color={color('text-caption')}
            >
              <SearchIcon size="18px" />
            </Box>
            <Text
              opacity={0.8}
              {...{
                color: color('text-caption'),
                ...getCapsizeStyles(14, 28),
              }}
            >
              Search docs
            </Text>
          </Flex>
          <Stack isInline spacing="3px" pr="base">
            <Key>⌘</Key>
            <Key>K</Key>
          </Stack>
        </Flex>
      </Box>
    </>
  );
});

export default SearchBox;

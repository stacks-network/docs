import React from 'react';
import { Flex, Box, BlockstackIcon, Stack, color, space, BoxProps } from '@blockstack/ui';
import { Link, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

import { css } from '@styled-system/css';
import NextLink from 'next/link';
import { ColorModeButton } from '@components/color-mode-button';
import { PAGE_WIDTH } from '@common/constants';

const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <Flex
      color="var(--colors-invert)"
      display={['flex', 'flex', 'none']}
      onClick={handleClick}
      px={1}
    >
      <Icon color="currentColor" />
    </Flex>
  );
};

const HeaderWrapper: React.FC<any> = React.forwardRef((props, ref) => (
  <Box top={2} ref={ref} width="100%" {...props} />
));

const nav = [
  {
    label: 'Developers',
    chilren: [
      {
        label: 'Documentation',
      },
      {
        label: 'GitHub',
      },
      {
        label: 'Papers',
      },
      {
        label: 'Discord',
      },
    ],
  },
  { label: 'Testnet' },
  { label: 'Discover apps' },
];

export const HEADER_HEIGHT = 132;

const HeaderTextItem: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    color={color('invert')}
    css={css({
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      padding: '0.05px 0',
      '::before': {
        content: "''",
        marginTop: '-0.38948863636363634em',
        display: 'block',
        height: 0,
      },
      '::after': {
        content: "''",
        marginBottom: '-0.38948863636363634em',
        display: 'block',
        height: 0,
      },
      ...rest,
    })}
  >
    {' '}
    {children}
  </Text>
);

const Header = ({ hideSubBar, ...rest }: any) => {
  return (
    <>
      <HeaderWrapper>
        <Flex
          justifyContent="space-between"
          align="center"
          bg={color('bg')}
          style={{
            backdropFilter: 'blur(5px)',
          }}
          height="72px"
          maxWidth={`${PAGE_WIDTH}px`}
          mx="auto"
          px={space(['extra-loose', 'extra-loose', 'base', 'base'])}
          {...rest}
        >
          <NextLink href="/" passHref>
            <Link as="a">
              <Flex align="center">
                <Box color={color('invert')} mr={space('tight')}>
                  <BlockstackIcon size="18px" />
                </Box>
                <Box>
                  <HeaderTextItem>Blockstack</HeaderTextItem>
                </Box>
              </Flex>
            </Link>
          </NextLink>
          <Flex align="center">
            <Box display={['none', 'none', 'block']}>
              <Stack mr={space('base')} isInline spacing={space('extra-loose')}>
                {nav.map(item => (
                  <Box>
                    <HeaderTextItem>{item.label}</HeaderTextItem>
                  </Box>
                ))}
              </Stack>
            </Box>
            <ColorModeButton />
            <MenuButton />
          </Flex>
        </Flex>
      </HeaderWrapper>
    </>
  );
};

export { Header };

import React from 'react';
import {
  Flex,
  Box,
  BlockstackIcon,
  Stack,
  color,
  space,
  BoxProps,
  ChevronIcon,
  FlexProps,
  Fade,
} from '@blockstack/ui';
import { Link, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

import { css } from '@styled-system/css';
import NextLink from 'next/link';
import { ColorModeButton } from '@components/color-mode-button';
import { PAGE_WIDTH } from '@common/constants';
import { border, transition } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';
import { useTouchable } from '@common/hooks/use-touchable';

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
  <Box as="header" ref={ref} width="100%" position="relative" zIndex={9999} {...props} />
));

const nav = [
  {
    label: 'Start building',
    children: [
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
      ...getCapsizeStyles(16, 26),
      ...rest,
    })}
  >
    {children}
  </Text>
);

const NavItem: React.FC<FlexProps & { item: any }> = ({ item, ...props }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Flex justifyContent="center" position="relative" {...props} {...bind}>
      <Link as="a">
        <HeaderTextItem>{item.label}</HeaderTextItem>
      </Link>
      {item.children ? (
        <Box ml={space('extra-tight')}>
          <ChevronIcon direction="down" />
        </Box>
      ) : null}
      {item.children ? (
        <Fade in={hover || active}>
          {styles => (
            <Box
              pt={space('base-loose')}
              top="100%"
              position="absolute"
              transform="translateX(-5px)"
              zIndex={99999999}
              minWidth="200px"
              style={{ ...styles }}
            >
              <Box
                borderRadius="12px"
                border={border()}
                bg={color('bg')}
                overflow="hidden"
                boxShadow="0 0 8px 0 rgba(15,17,23,.03), 0 16px 40px 0 rgba(15,17,23,.06)"
              >
                {item.children.map((child, _key) => (
                  <Box
                    _hover={{
                      bg: color('accent'),
                      color: color('bg'),
                      cursor: 'pointer',
                    }}
                    transition={transition()}
                    color={color('text-title')}
                    borderBottom={_key < item.children.length - 1 && border()}
                    px={space('base')}
                    py={space('base-loose')}
                  >
                    <HeaderTextItem color="currentColor">{child.label}</HeaderTextItem>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Fade>
      ) : null}
    </Flex>
  );
};

const Navigation: React.FC<BoxProps> = props => {
  return (
    <Box
      as="nav"
      position="relative"
      zIndex={99999999}
      display={['none', 'none', 'block']}
      transform="translateY(2px)"
      {...props}
    >
      <Stack mr={space('base')} isInline spacing={space('extra-loose')}>
        {nav.map((item, key) => (
          <NavItem item={item} key={key} />
        ))}
      </Stack>
    </Box>
  );
};

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
                  <BlockstackIcon size="20px" />
                </Box>
                <Box transform="translateY(1px)">
                  <HeaderTextItem>Blockstack</HeaderTextItem>
                </Box>
              </Flex>
            </Link>
          </NextLink>
          <Flex align="center">
            <Navigation />
            <ColorModeButton />
            <MenuButton />
          </Flex>
        </Flex>
      </HeaderWrapper>
    </>
  );
};

export { Header };

import React from 'react';
import {
  Box,
  BoxProps,
  ChevronIcon,
  color,
  Fade,
  Flex,
  FlexProps,
  space,
  Stack,
  StacksLogo,
  StxInline,
} from '@stacks/ui';
import { Link, LinkProps, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
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

const HeaderWrapper: React.FC<BoxProps> = React.forwardRef((props, ref: any) => (
  <Box as="header" ref={ref} width="100%" position="relative" zIndex={9999} {...props} />
));

interface NavChildren {
  label: string;
  href?: string;
  target?: string;
}

interface NavItem {
  label: string;
  href: string;
  target?: string;
  children?: NavItem[];
}

const nav: NavItem[] = [
  {
    label: 'Start building',
    href: '',
    children: [
      {
        label: 'Documentation',
        href: 'https://docs.blockstack.org/',
        target: '_self',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/blockstack',
      },
      {
        label: 'Papers',
        href: 'https://www.blockstack.org/papers',
      },
      {
        label: 'Discord',
        href: 'https://discord.com/invite/6PcCMU',
      },
    ],
  },
  { label: 'Testnet', href: 'https://www.blockstack.org/testnet' },
  { label: 'Discover apps', href: 'https://app.co/' },
];

const HeaderTextItem: ForwardRefExoticComponentWithAs<BoxProps & LinkProps, 'a'> = forwardRefWithAs<
  BoxProps & LinkProps,
  'a'
>(({ children, href, as = 'a', ...rest }, ref) => (
  <Text
    color={color('invert')}
    {...{
      ...getCapsizeStyles(16, 26),
      fontWeight: '400',
      color: 'currentColor',
      _hover: {
        cursor: href ? 'pointer' : 'unset',
        textDecoration: href ? 'underline' : 'none',
        color: href ? color('accent') : 'currentColor',
      },
      ...rest,
    }}
    as={as}
    href={href}
    ref={ref}
  >
    {children}
  </Text>
));

const NavItem: React.FC<FlexProps & { item: NavItem }> = ({ item, ...props }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Flex justifyContent="center" position="relative" {...props} {...bind}>
      <HeaderTextItem
        as={item.href ? 'a' : 'span'}
        href={item.href}
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        {item.label}
      </HeaderTextItem>

      {item.children ? (
        <Box color={color('text-caption')} ml={space('extra-tight')}>
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
                    as="a"
                    display="block"
                    // @ts-ignore
                    href={child.href}
                    target={child.target || '_blank'}
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

const LogoLink = React.memo(() => {
  return (
    <NextLink href="/" passHref>
      <Link _hover={{ textDecoration: 'none' }} as="a" display="flex">
        <Flex as="span" alignItems="center">
          <StacksLogo color={color('text-title')} />
          <HeaderTextItem
            fontWeight="500"
            fontSize={1}
            ml="tight"
            pt="5px"
            textTransform="uppercase"
            color={color('text-caption')}
            _hover={{ color: color('text-caption') }}
          >
            Docs
          </HeaderTextItem>
        </Flex>
      </Link>
    </NextLink>
  );
});

const Header = ({ hideSubBar, ...rest }: any) => {
  return (
    <>
      <HeaderWrapper>
        <Box mx="auto" px="extra-loose">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            bg={color('bg')}
            style={{
              backdropFilter: 'blur(5px)',
            }}
            height="72px"
            maxWidth={`${PAGE_WIDTH}px`}
            mx="auto"
            color={color('text-title')}
            {...rest}
          >
            <LogoLink />
            <Flex alignItems="center">
              <Navigation />
              <ColorModeButton />
              <MenuButton />
            </Flex>
          </Flex>
        </Box>
      </HeaderWrapper>
    </>
  );
};

export { Header };

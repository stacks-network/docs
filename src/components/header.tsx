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
  StxInline,
  IconButton,
} from '@stacks/ui';
import { Link, LinkProps, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import NextLink from 'next/link';
import { StacksDocsLogo } from '@components/stacks-docs-logo';
import { ColorModeButton } from '@components/color-mode-button';
import { SearchButton } from '@components/search-button';
import { border, transition } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';
import { useTouchable } from '@common/hooks/use-touchable';
import { useRouter } from 'next/router';
import {
  COMMUNITY,
  LANGUAGES,
  LEARNING_RESOURCES,
} from '@common/constants_that_require_translations';

const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <IconButton
      color="var(--colors-invert)"
      display={['grid', 'grid', 'none']}
      onClick={handleClick}
      icon={Icon}
    />
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
    label: COMMUNITY,
    href: '',
    children: [
      {
        label: 'Discord',
        href: 'https://discord.gg/5DJaBrf',
      },
      {
        label: 'Forum',
        href: 'https://forum.stacks.org',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/stacks-network',
      },
      {
        label: 'Mailing List',
        href: 'https://stacks.org/updates',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/stacks',
      },
      {
        label: 'Youtube',
        href: 'https://www.youtube.com/channel/UC3J2iHnyt2JtOvtGVf_jpHQ',
      },
    ],
  },
  {
    label: LANGUAGES,
    href: '',
    children: [
      {
        label: 'English',
        href: '/en',
      },
      /*
      {
        label: 'Indonesian',
        href: '/id',
      },
      {
        label: 'Spanish',
        href: '/es',
      },
      */
      {
        label: 'Add another language...',
        href: '/contribute/translations',
      },
    ],
  },
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
          <StacksDocsLogo color={color('text-title')} />
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
            mx="auto"
            color={color('text-title')}
            {...rest}
          >
            <LogoLink />
            <Flex alignItems="center">
              <Navigation />
              <Stack isInline spacing="tight">
                <SearchButton />
                <ColorModeButton />
                <MenuButton />
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </HeaderWrapper>
    </>
  );
};

export { Header };

import React from 'react';
import {
  Flex,
  Box,
  BlockstackIcon,
  Stack,
  color,
  space,
  transition,
  ChevronIcon,
} from '@blockstack/ui';
import { Link, Text, LinkProps } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useLockBodyScroll } from '@common/hooks/use-lock-body-scroll';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SideNav } from './side-nav';
import GithubIcon from 'mdi-react/GithubIcon';
import { IconButton } from '@components/icon-button';
import { border } from '@common/utils';
import routes from '@common/routes';
import { css } from '@styled-system/css';
import NextLink from 'next/link';
import MagnifyIcon from 'mdi-react/MagnifyIcon';
import { useRouter } from 'next/router';
import { ColorModeButton } from '@components/color-mode-button';

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
const BreadCrumbs: React.FC<any> = props => {
  const router = useRouter();
  const [route, setRoute] = React.useState(undefined);
  const [section, setSection] = React.useState(undefined);
  React.useEffect(() => {
    routes.forEach(_section => {
      _section?.routes?.length &&
        _section.routes.forEach(_route => {
          if (router.route === `/${_route.path}`) {
            setSection(_section);
            setRoute(_route);
          }
        });
    });
  }, [router.route]);

  return route && section ? (
    <Flex align="center">
      <Box>
        <Text fontSize="14px" fontWeight="600">
          Docs
        </Text>
      </Box>
      <Box pt="3px" color={color('text-caption')}>
        <ChevronIcon size="20px" />
      </Box>
      <Box>
        <Text fontSize="14px" fontWeight="600">
          {section?.title}
        </Text>
      </Box>
      <Box pt="3px" color={color('text-caption')}>
        <ChevronIcon size="20px" />
      </Box>
      <Box>
        <Text fontSize="14px" fontWeight="600">
          {route?.title || (route?.headings.length && route.headings[0])}
        </Text>
      </Box>
    </Flex>
  ) : (
    <Box />
  );
};

const GithubButton = (props: LinkProps) => (
  <IconButton
    as="a"
    href="https://github.com/blockstack/ux/tree/master/packages/ui#blockstack-ui"
    target="_blank"
    rel="nofollow noopener noreferrer"
    title="Find us on GitHub"
    position="relative"
    overflow="hidden"
    display="flex"
    style={{
      alignItems: 'center',
    }}
    {...props}
  >
    <Text position="absolute" opacity={0} as="label">
      Find us on GitHub
    </Text>
    <GithubIcon size="20px" />
  </IconButton>
);

const MobileSideNav = () => {
  const { isOpen } = useMobileMenuState();
  useLockBodyScroll(isOpen);
  return (
    <SideNav
      position="fixed"
      top={`${HEADER_HEIGHT}px`}
      maxHeight={`calc(100vh - ${HEADER_HEIGHT}px)`}
      width="100%"
      zIndex={99}
      bg={color('bg')}
      display={isOpen ? ['block', 'block', 'none'] : 'none'}
      border="unset"
    />
  );
};

const HeaderWrapper: React.FC<any> = props => (
  <Box position="fixed" zIndex={9999} width="100%" {...props} />
);

const nav = [
  {
    label: 'Developers',
  },
  { label: 'Run a node' },
  { label: 'Build on Blockstack' },
];
const SubBar: React.FC<any> = props => (
  <Flex
    justifyContent="space-between"
    align="center"
    height="60px"
    width="100%"
    px={['extra-loose', 'extra-loose', 'base', 'base']}
    bg={color('bg')}
    borderBottom={border()}
    style={{
      backdropFilter: 'blur(5px)',
    }}
  >
    <BreadCrumbs />
    <Flex
      align="center"
      justifyContent="flex-end"
      bg={color('bg-alt')}
      height="32px"
      width="32px"
      borderRadius="32px"
      transition={transition}
      px={space('tight')}
      color={color('invert')}
      _hover={{
        bg: color('bg-light'),
        width: ['32px', '32px', '225px', '225px'],
        cursor: 'pointer',
        justifyContent: 'flex-end',
      }}
    >
      <MagnifyIcon size="16px" />
    </Flex>
  </Flex>
);

export const HEADER_HEIGHT = 132;

const Header = ({ hideSubBar, ...rest }: any) => {
  return (
    <>
      <HeaderWrapper>
        <Flex
          justifyContent="space-between"
          align="center"
          px={['extra-loose', 'extra-loose', 'base', 'base']}
          bg={color('bg')}
          borderBottom={border()}
          style={{
            backdropFilter: 'blur(5px)',
          }}
          height="72px"
          {...rest}
        >
          <NextLink href="/" passHref>
            <Link as="a">
              <Flex align="center">
                <Box color={color('invert')} mr={space('tight')}>
                  <BlockstackIcon size="20px" />
                </Box>
                <Box>
                  <Text
                    color={color('invert')}
                    css={css({
                      fontWeight: 500,
                      fontSize: '13.75px',
                      lineHeight: '14px',
                      padding: '0.05px 0',
                      ':before': {
                        content: "''",
                        marginTop: '-0.14909090909090908em',
                        display: 'block',
                        height: 0,
                      },
                      ':after': {
                        content: "''",
                        marginBottom: '-0.14909090909090908em',
                        display: 'block',
                        height: 0,
                      },
                    })}
                  >
                    Blockstack
                  </Text>
                </Box>
              </Flex>
            </Link>
          </NextLink>
          <Flex align="center">
            <Box display={['none', 'none', 'block']}>
              <Stack mr={space('base')} isInline spacing={space('base')}>
                {nav.map(item => (
                  <Box>
                    <Text fontSize="14px" fontWeight="600">
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
            <ColorModeButton />
            <GithubButton />
            <MenuButton />
          </Flex>
        </Flex>
        {!hideSubBar && <SubBar />}
      </HeaderWrapper>
      <MobileSideNav />
    </>
  );
};

export { Header };

import React from 'react';
import { Flex, Box, color, space, ChevronIcon } from '@blockstack/ui';
import { border } from '@common/utils';
import { Text, Caption } from '@components/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '@common/routes';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import dynamic from 'next/dynamic';
const SearchBox = dynamic(() => import('./search'));
import { SIDEBAR_WIDTH } from '@common/constants';
import { HEADER_HEIGHT } from '@components/header';

const Wrapper = ({ width = `${SIDEBAR_WIDTH}px`, children, ...rest }: any) => (
  <Box
    position="relative"
    width={width}
    maxWidth={width}
    height={`calc(100vh - ${HEADER_HEIGHT}px)`}
    flexGrow={0}
    flexShrink={0}
    overflow="auto"
    {...rest}
  >
    <Box
      position="fixed"
      top={HEADER_HEIGHT}
      width={width}
      height={`calc(100vh - ${HEADER_HEIGHT}px)`}
      overflow="auto"
      borderRight={['none', border(), border()]}
      pb={space('base-loose')}
    >
      {children}
    </Box>
  </Box>
);

const LinkItem = React.forwardRef(({ isActive, ...rest }: any, ref) => (
  <Text
    ref={ref}
    _hover={
      !isActive
        ? {
            color: 'var(--colors-accent)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }
        : null
    }
    color={isActive ? color('accent') : color('text-body')}
    fontWeight={isActive ? 'semibold' : 'normal'}
    fontSize={['16px', '16px', '14px']}
    lineHeight="20px"
    as="a"
    display="block"
    py={space(['extra-tight', 'extra-tight', 'extra-tight'])}
    {...rest}
  />
));

const Links = ({ routes, prefix = '', ...rest }: any) => {
  const router = useRouter();
  const { handleClose } = useMobileMenuState();
  const { pathname } = router;

  return routes.map((route, linkKey) => {
    const isActive = pathname === `/${route.path}`;
    return (
      <Box width="100%" px="base" py="1px" key={linkKey} onClick={handleClose} {...rest}>
        <Link href={`/${route.path}`} passHref>
          <LinkItem isActive={isActive} width="100%" href={`/${route.path}`}>
            {route.title ||
              (route.headings && route.headings.length && route.headings[0]) ||
              route.path}
          </LinkItem>
        </Link>
      </Box>
    );
  });
};

const SectionTitle = ({ children, textStyles, ...rest }: any) => (
  <Box px={space('base')} pb={space('extra-tight')} {...rest}>
    <Caption fontSize="14px" fontWeight="600" color={color('text-title')} {...textStyles}>
      {children}
    </Caption>
  </Box>
);

const Section = ({ section, isLast, ...rest }: any) => {
  const router = useRouter();
  const { pathname } = router;
  const isActive = section.routes.find(route => pathname === `/${route.path}`);
  const [visible, setVisible] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive && !visible) {
      setVisible(true);
    }
  }, [router, isActive]);

  return (
    <Box width="100%" pt={space('base')} {...rest}>
      {section.title ? (
        <Flex
          align="center"
          pr={space('base')}
          justify="space-between"
          onClick={() => setVisible(!visible)}
          _hover={{
            cursor: 'pointer',
          }}
        >
          <SectionTitle>{section.title}</SectionTitle>
          <Box color={color('text-caption')}>
            <ChevronIcon size="24px" direction={visible ? 'up' : 'down'} />
          </Box>
        </Flex>
      ) : null}
      {visible && <Links routes={section.routes} />}
    </Box>
  );
};

const SideNav = ({ ...rest }: any) => {
  return (
    <Wrapper {...rest}>
      {routes.map((section, sectionKey, arr) => (
        <Section key={sectionKey} section={section} isLast={sectionKey === arr.length - 1} />
      ))}
    </Wrapper>
  );
};

export { SideNav };

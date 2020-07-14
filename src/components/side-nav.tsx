import React from 'react';
import { Box, color, space } from '@blockstack/ui';
import { border, slugify } from '@common/utils';
import { Text, Caption } from '@components/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { routes } from '@common/routes';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import dynamic from 'next/dynamic';
const SearchBox = dynamic(() => import('./search'));
import { SIDEBAR_WIDTH } from '@common/constants';

const Wrapper = ({ width = `${SIDEBAR_WIDTH}px`, children, ...rest }: any) => (
  <Box
    position="relative"
    width={width}
    maxWidth={width}
    height="calc(100vh - 50px)"
    flexGrow={0}
    flexShrink={0}
    overflow="auto"
    {...rest}
  >
    <Box
      position="fixed"
      top={50}
      width={width}
      height="calc(100vh - 50px)"
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

  return routes.map((link, linkKey) => {
    // const slug = slugify(link);
    // const isActive =
    //   router.pathname.includes(slug) || (router.pathname === '/' && slug === 'getting-started');
    return (
      <Box width="100%" px="base" py="1px" key={linkKey} onClick={handleClose} {...rest}>
        <Link href={`/${link.path}`} passHref>
          <LinkItem width="100%" href={`/${link.path}`}>
            {link.path}
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

const Section = ({ section, isLast, ...rest }: any) => (
  <Box width="100%" pt={space('base')} {...rest}>
    {section.title ? <SectionTitle>{section.title}</SectionTitle> : null}
    <Links routes={section.routes} />
  </Box>
);

const SideNav = ({ ...rest }: any) => {
  return (
    <Wrapper {...rest}>
      <SearchBox />
      {routes.map((section, sectionKey, arr) => (
        <Section key={sectionKey} section={section} isLast={sectionKey === arr.length - 1} />
      ))}
    </Wrapper>
  );
};

export { SideNav };

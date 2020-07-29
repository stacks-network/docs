import React from 'react';
import { Flex, Box, color, space, ChevronIcon, BoxProps } from '@blockstack/ui';
import { Text, Caption, LinkProps } from '@components/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '@common/routes';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SIDEBAR_WIDTH } from '@common/constants';

const Wrapper: React.FC<BoxProps & { containerProps?: BoxProps }> = ({
  width = `${SIDEBAR_WIDTH}px`,
  containerProps,
  children,
  ...rest
}) => {
  return (
    <Box width={width} maxWidth={width} flexGrow={0} flexShrink={0} {...rest}>
      <Box
        position="sticky"
        width={width}
        maxHeight={`calc(100vh - 60px)`}
        overflow="auto"
        pb="62px"
        px={space('base')}
        top="60px"
        pt={space('base')}
        {...containerProps}
      >
        {children}
      </Box>
    </Box>
  );
};

const LinkItem: React.FC<LinkProps & { isActive?: boolean }> = React.forwardRef(
  ({ isActive, ...rest }, ref) => (
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
      color={isActive ? color('accent') : color('text-caption')}
      fontSize="14px"
      lineHeight="20px"
      as="a"
      display="block"
      py={space(['extra-tight', 'extra-tight', 'extra-tight'])}
      {...rest}
    />
  )
);

const Links: React.FC<BoxProps & { routes?: any }> = ({ routes, prefix = '', ...rest }) => {
  const router = useRouter();
  const { handleClose } = useMobileMenuState();
  const { pathname } = router;

  return routes.map((route, linkKey) => {
    const isActive = pathname === `/${route.path}`;
    return (
      <Box width="100%" py="1px" key={linkKey} onClick={handleClose} {...rest}>
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

const SectionTitle: React.FC<BoxProps & { textStyles?: BoxProps }> = ({
  children,
  textStyles,
  ...rest
}) => (
  <Box pb={space('extra-tight')} {...rest}>
    <Caption fontSize="14px" fontWeight="500" color={color('text-title')} {...textStyles}>
      {children}
    </Caption>
  </Box>
);

const Section = ({ section, visible, isLast, isFirst, setVisible, ...rest }: any) => {
  const isVisible = section.title === visible?.title;

  return (
    <Box width="100%" pt={isFirst ? 'unset' : space('base')} {...rest}>
      {section.title ? (
        <Flex
          width="100%"
          align="center"
          onClick={() => setVisible(section)}
          _hover={{
            cursor: 'pointer',
          }}
        >
          <SectionTitle>{section.title}</SectionTitle>
          <Box ml="extra-tight" color={color('text-caption')}>
            <ChevronIcon size="20px" direction={visible ? 'up' : 'down'} />
          </Box>
        </Flex>
      ) : null}
      {isVisible && <Links routes={section.routes} />}
    </Box>
  );
};

export const SideNav: React.FC<BoxProps & { containerProps?: BoxProps }> = ({
  containerProps,
  ...rest
}) => {
  const router = useRouter();
  const { pathname } = router;
  const active = routes.find(section =>
    section.routes.find(route => pathname === `/${route.path}`)
  );
  const [visible, setVisible] = React.useState(active);
  const handleSectionClick = (section: any) => {
    if (section?.title === active?.title) {
      setVisible(false);
    } else {
      setVisible(section);
    }
  };
  return (
    <Wrapper containerProps={containerProps} {...rest}>
      {routes.map((section, sectionKey, arr) => (
        <Section
          visible={visible}
          key={sectionKey}
          section={section}
          isLast={sectionKey === arr.length - 1}
          isFirst={sectionKey === 0}
          setVisible={handleSectionClick}
        />
      ))}
    </Wrapper>
  );
};

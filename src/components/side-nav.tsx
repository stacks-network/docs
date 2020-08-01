import React from 'react';
import { Flex, Box, color, space, ChevronIcon, BoxProps } from '@blockstack/ui';
import { Text, Caption, LinkProps } from '@components/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '@common/routes';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SIDEBAR_WIDTH } from '@common/constants';
// @ts-ignore
import nav from '@common/navigation.yaml';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import { slugify } from '@common/utils';

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
        top={0}
        pt="64px"
        {...containerProps}
      >
        {children}
      </Box>
    </Box>
  );
};

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const convertToTitle = (path: string) =>
  !path ? null : path === '/' ? 'Home' : capitalize(path.replace('/', '').replace(/-/g, ' '));

const PageItem = ({ isActive, ...props }: any) => (
  <Flex
    _hover={{
      cursor: 'pointer',
      color: color('text-title'),
    }}
    color={isActive ? color('accent') : color('text-caption')}
    mb={space('tight')}
    fontSize="14px"
    {...props}
  />
);

const SectionTitle: React.FC<BoxProps> = props => (
  <Box
    color={color('text-title')}
    fontSize="16px"
    mb={space('tight')}
    fontWeight="400"
    {...props}
  />
);

const ChildPages = ({ items, handleClick }) =>
  items.pages.map((page, index) => {
    const path = page.pages
      ? `${page.path}${page.pages[0].path}`
      : items.path
      ? '/' + slugify(items.path) + page.path
      : page.path;

    const routePath = routes.find(route => route.path.endsWith(path));

    return (
      <Box mb={space('extra-tight')}>
        <Link href={routePath.path} passHref>
          <PageItem onClick={page.pages ? () => handleClick(page) : undefined} as="a">
            {convertToTitle(page.path)}
          </PageItem>
        </Link>
      </Box>
    );
  });

const ChildSection = ({ sections }) =>
  sections.map(section => {
    return (
      <Box mt={space('base-loose')}>
        <SectionTitle>{section.title}</SectionTitle>
        <ChildPages items={section} />
      </Box>
    );
  });

const BackItem = props => (
  <PageItem align="center" color={color('text-caption')} {...props}>
    <Box mr={space('extra-tight')}>
      <ArrowLeftIcon size="16px" />
    </Box>
    Back
  </PageItem>
);

const NewNav = () => {
  const [selected, setSelected] = React.useState<any | undefined>({
    type: 'default',
    items: nav.sections,
    selected: undefined,
  });

  const handleClick = (page: any) => {
    if (page.pages) {
      setSelected({
        type: 'page',
        items: page,
      });
    } else {
      setSelected({
        type: 'default',
        items: nav.sections,
        selected: page.path,
      });
    }
  };

  const handleBack = () =>
    setSelected({
      type: 'default',
      items: nav.sections,
    });

  if (selected.type === 'page') {
    return (
      <Box>
        <BackItem onClick={handleBack} mb={space('base')} />
        <SectionTitle>{convertToTitle(selected.items.path)}</SectionTitle>
        <Box>
          {selected.items ? <ChildPages handleClick={handleClick} items={selected.items} /> : null}
          {selected.items?.sections ? (
            <ChildSection
              sections={selected.items?.sections?.map(section => ({
                ...section,
                path: selected.items.path,
              }))}
            />
          ) : null}
        </Box>
      </Box>
    );
  }

  if (selected.type === 'default') {
    return selected.items.map((section, i) => {
      const itemProps =
        i === 0
          ? {
              color: color('text-title'),
              mb: space('tight'),
              fontSize: '16px',
              _hover: {
                color: color('accent'),
                cursor: 'pointer',
              },
            }
          : {};
      return (
        <Box mb={space('base')}>
          {section.title ? (
            <Flex width="100%" align="center">
              <SectionTitle>{section.title}</SectionTitle>
              <Box
                transform="translateY(-3px)"
                color={color('text-caption')}
                size="16px"
                ml={space('extra-tight')}
              >
                <ChevronIcon direction="down" />
              </Box>
            </Flex>
          ) : null}
          {section.pages.map(page => {
            const path = page.pages
              ? `${page.path}${page.pages[0].path}`
              : section?.title
              ? '/' + slugify(section?.title) + page.path
              : page.path;

            return (
              <Box mb={space('extra-tight')}>
                <Link href={path}>
                  <PageItem
                    as="a"
                    href={path}
                    {...itemProps}
                    isActive={selected.selected === page.path}
                    onClick={() => handleClick(page)}
                  >
                    {convertToTitle(page.path)}
                  </PageItem>
                </Link>
              </Box>
            );
          })}
        </Box>
      );
    });
  }
};

export const SideNav: React.FC<BoxProps & { containerProps?: BoxProps }> = ({
  containerProps,
  ...rest
}) => {
  // const router = useRouter();
  // const { pathname } = router;
  // const active = routes.find(section =>
  //   section.routes.find(route => pathname === `/${route.path}`)
  // );
  // const [visible, setVisible] = React.useState(active);
  // const handleSectionClick = (section: any) => {
  //   if (section?.title === active?.title) {
  //     setVisible(false);
  //   } else {
  //     setVisible(section);
  //   }
  // };

  const getFlatMap = navigation => {
    return navigation.sections.flatMap(section =>
      section.pages.flatMap(page => {
        if (page.pages) {
          let sectionPages = [];
          if (page.sections) {
            sectionPages = page.sections.flatMap(_section =>
              _section.pages.flatMap(sectionPage => `${page.path}${sectionPage.path}`)
            );
          }
          const pages = page.pages.flatMap(_page => {
            if (_page.pages) {
              return _page.pages.flatMap(p => `${page.path}${_page.path}${p.path}`);
            } else {
              return `${page.path}${_page.path}`;
            }
          });
          return [...pages, ...sectionPages];
        } else {
          return `${section?.title ? '/' + slugify(section.title) : ''}${page.path}`;
        }
      })
    );
  };

  return (
    <Wrapper containerProps={containerProps} {...rest}>
      <NewNav />
      {/*{routes.map((section, sectionKey, arr) => (*/}
      {/*  <Section*/}
      {/*    visible={visible}*/}
      {/*    key={sectionKey}*/}
      {/*    section={section}*/}
      {/*    isLast={sectionKey === arr.length - 1}*/}
      {/*    isFirst={sectionKey === 0}*/}
      {/*    setVisible={handleSectionClick}*/}
      {/*  />*/}
      {/*))}*/}
    </Wrapper>
  );
};

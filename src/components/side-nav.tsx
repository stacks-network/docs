import React from 'react';
import { Flex, Box, color, space, ChevronIcon, BoxProps } from '@blockstack/ui';
import Link from 'next/link';
import routes from '@common/routes';
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

const ChildPages = ({ items, handleClick }: any) =>
  items.pages.map(page => {
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
  return (
    <Wrapper containerProps={containerProps} {...rest}>
      <NewNav />
    </Wrapper>
  );
};

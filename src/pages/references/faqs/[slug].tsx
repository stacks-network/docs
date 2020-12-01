import React from 'react';
import { Components } from '@components/mdx';
import { Box, Flex, ChevronIcon, space, color, Grid } from '@stacks/ui';
import hydrate from 'next-mdx-remote/hydrate';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { border } from '@common/utils';
import { useRouter } from 'next/router';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { BackButton } from '@components/back-button';
import Head from 'next/head';
import { MDContents } from '@components/mdx/md-contents';
export { getStaticProps, getStaticPaths } from '@common/data/faq';
import { slugify, getSlug } from '@common/utils';
import { PageTop } from '@components/page-top';
import { getBetterNames } from '@common/utils/faqs';

const FAQItem = React.memo(({ faq, ...rest }: any) => {
  const id = slugify(faq.title);
  const { isActive } = useActiveHeading(id);

  return (
    <Components.section>
      <Box as={AccordionItem} borderBottom={border()} {...rest}>
        <Flex
          as={AccordionButton}
          _hover={{ color: color('accent') }}
          {...{
            display: 'flex',
            width: '100%',
            outline: 'none',
            bg: 'transparent',
            border: '0',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: space('extra-loose'),
            textAlign: 'left',
            color: isActive ? color('accent') : color('text-title'),
            _hover: {
              cursor: 'pointer',
              color: color('accent'),
            },
          }}
        >
          <Components.h4 my="0px !important" id={id} color="currentColor">
            {faq.title}
          </Components.h4>
          <Box color={color('text-caption')} pl={space('base-loose')}>
            <ChevronIcon direction="down" size="22px" />
          </Box>
        </Flex>
        <Box pb={space('extra-loose')} as={AccordionPanel}>
          {hydrate(faq.body, { components: Components })}
        </Box>
      </Box>
    </Components.section>
  );
});

const FaqItems = ({ articles }) => {
  const router = useRouter();
  const slug = getSlug(router.asPath);
  const slugIndex = articles.findIndex(faq => slugify(faq.title) === slug);
  const [index, setIndex] = React.useState(slugIndex !== -1 ? slugIndex : 0);
  const handleIndexChange = (value: number) => {
    setIndex(value);
  };

  return (
    <Box
      pr={['extra-loose', 'extra-loose', 'base-loose', 'base-loose']}
      pl={['extra-loose', 'extra-loose', '0', '0']}
    >
      <BackButton href="/references/faqs" mb={0} />
      <Accordion multiple collapsible defaultIndex={index} onChange={handleIndexChange}>
        {articles
          // @ts-ignore
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((faq, _index) => {
            return <FAQItem faq={faq} key={_index} />;
          })}
      </Accordion>
    </Box>
  );
};

const FaqPage = props => {
  const { articles, sections, params } = props;

  const section = sections.find(s => {
    const { title } = getBetterNames(s.id);
    const slug = slugify(title);
    return slug === params.slug;
  });

  const { title, description } = getBetterNames(section.id);
  return (
    <>
      <Head>
        <title>{title} | Stacks</title>
        <meta name="description" content={description} />
      </Head>
      <MDContents pageTop={() => <PageTop title={title} description={description} />} headings={[]}>
        <FaqItems articles={articles} />
      </MDContents>
    </>
  );
};

export default FaqPage;

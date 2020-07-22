import React from 'react';
import { MDXComponents } from '@components/mdx';
import { Box, Flex, ChevronIcon, space, color } from '@blockstack/ui';
import { hydrate } from '@common/hydrate-mdx';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@reach/accordion';
import { border } from '@common/utils';
import { slugify } from '@common/utils';
import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useActiveHeading } from '@common/hooks/use-active-heading';
const getSlug = (asPath: string) => {
  if (asPath.includes('#')) {
    const slug = asPath.split('#')[1];
    return slug;
  }
  return;
};

const FAQItem = React.memo(({ faq, ...rest }: any) => {
  const id = slugify(faq.question);
  const { isActive } = useActiveHeading(id);

  return (
    <Box as={AccordionItem} borderBottom={border()} {...rest}>
      <Flex
        as={AccordionButton}
        _hover={{ color: color('accent') }}
        css={css({
          display: 'flex',
          width: '100%',
          outline: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: space('extra-loose'),
          textAlign: 'left',
          pr: space('extra-loose'),
          color: isActive ? color('accent') : color('text-title'),
          '& > h4': {
            pl: space('extra-loose'),
          },
          ':hover': {
            color: color('accent'),
          },
        })}
      >
        <MDXComponents.h4 id={id} my="0px !important" color="currentColor">
          {faq.question}
        </MDXComponents.h4>
        <Box color={color('text-caption')} pl={space('base-loose')}>
          <ChevronIcon direction="down" size="22px" />
        </Box>
      </Flex>
      <Box px={space('extra-loose')} pb={space('extra-loose')} as={AccordionPanel}>
        {hydrate(faq.answer, MDXComponents)}
      </Box>
    </Box>
  );
});
export const FAQs = React.memo(({ category, data }: any) => {
  const router = useRouter();
  const slug = getSlug(router.asPath);
  const faqs = data.filter(faq => faq.category === category);
  const slugIndex = faqs.findIndex(faq => slugify(faq.question) === slug);
  const [index, setIndex] = React.useState(slugIndex !== -1 ? slugIndex : undefined);
  const handleIndexChange = (value: number) => {
    setIndex(value);
  };

  return (
    <Accordion multiple collapsible defaultIndex={index} onChange={handleIndexChange}>
      {faqs.map((faq, _index) => {
        return <FAQItem faq={faq} key={_index} />;
      })}
    </Accordion>
  );
});

import React from 'react';
import { Box, Flex, space } from '@stacks/ui';
import { Pagination } from '@components/pagination';
import { Section, SectionWrapper } from '@components/common';
import { FeedbackSection } from '@components/feedback';
import { VercelLogo } from '@components/vercel';
import { Caption } from '@components/typography';

const Footer = ({ hidePagination, ...rest }: any) => {
  return (
    <Section px={space(['extra-loose', 'extra-loose', 'none', 'none'])} {...rest}>
      <SectionWrapper>
        <Pagination />
        <FeedbackSection />
        <Flex
          justifyContent={['flex-end', 'flex-end', 'flex-start']}
          mt={['extra-loose', 'extra-loose', 'loose']}
          alignItems="center"
        ></Flex>
      </SectionWrapper>
    </Section>
  );
};

export { Footer };

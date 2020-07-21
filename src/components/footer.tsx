import React from 'react';
import { Pagination } from '@components/pagination';
import { Section, SectionWrapper } from '@components/home/common';
import { FeedbackSection } from '@components/feedback';


const Footer = ({ hidePagination, ...rest }: any) => {
  return (
    <Section>
      <SectionWrapper>
        <Pagination />
        <FeedbackSection />
      </SectionWrapper>
    </Section>
  );
};

export { Footer };

import { Box, BoxProps, color, space } from '@blockstack/ui';
import React from 'react';
import { Text } from '@components/typography';
import { BaseHeading } from '@components/mdx/components/heading';

export const H1: React.FC<BoxProps> = props => <BaseHeading as="h1" {...props} />;
export const H2: React.FC<BoxProps> = props => <BaseHeading as="h2" {...props} />;
export const H3: React.FC<BoxProps> = props => <BaseHeading as="h3" {...props} />;
export const H4: React.FC<BoxProps> = props => <BaseHeading as="h4" {...props} />;
export const H5: React.FC<BoxProps> = props => <BaseHeading as="h5" {...props} />;
export const H6: React.FC<BoxProps> = props => <BaseHeading as="h6" {...props} />;

export const Br: React.FC<BoxProps> = props => <Box height="24px" {...props} />;
export const Hr: React.FC<BoxProps> = props => (
  <Box
    as="hr"
    borderTopWidth="1px"
    borderColor={color('border')}
    my={space('extra-loose')}
    mx={space('extra-loose')}
    {...props}
  />
);

export const P: React.FC<BoxProps> = props => <Text as="p" {...props} />;

export const Pre = (props: any) => <Text as="pre" {...props} />;
export const Sup: React.FC<any> = props => <Text as="sup" mr={space('extra-tight')} {...props} />;

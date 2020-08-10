import React from 'react';
import { Flex, FlexProps, space } from '@blockstack/ui';

const ContentWrapper: React.FC<FlexProps> = props => (
  <Flex
    flexShrink={0}
    pt={space(['base', 'base', 'extra-loose'])}
    pb={[4, 4, 6]}
    flexDirection="column"
    {...props}
  />
);

export { ContentWrapper };

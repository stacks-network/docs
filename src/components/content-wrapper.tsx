import React from 'react';
import { Flex, FlexProps, space } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

const ContentWrapper: ForwardRefExoticComponentWithAs<FlexProps, 'div'> = forwardRefWithAs<
  FlexProps,
  'div'
>((props, ref) => (
  <Flex
    flexShrink={0}
    pt={space(['base', 'base', 'extra-loose'])}
    pb={[4, 4, 6]}
    flexDirection="column"
    ref={ref}
    {...props}
  />
));

export { ContentWrapper };

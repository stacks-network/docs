import React from 'react';
import { Box, Grid, space, color } from '@blockstack/ui';
import { CircleIcon } from '@components/home/common';
import { CONTENT_MAX_WIDTH } from '@common/constants';
import { Card } from '@components/home/card';
import { Body, H1, BodyLarge, SubHeading } from '@components/home/text';

export const Hero = ({ cards }: { cards?: any }) => {
  return (
    <>
      <Grid pb="64px" pt="64px" style={{ placeItems: 'center' }} mt="50px">
        <Box maxWidth="62ch" textAlign="center">
          <H1 mb={space('base')}>Easily build decentralized apps</H1>
          <BodyLarge maxWidth="42ch" mt="64px" mx="auto">
            Blockstack is a developer-friendly toolkit for building decentralized apps, anchored in
            the Bitcoin blockchain.
          </BodyLarge>
        </Box>
      </Grid>
      <Grid
        maxWidth={`${CONTENT_MAX_WIDTH}px`}
        width="100%"
        gridGap={space('extra-loose')}
        minHeight="200px"
        gridTemplateColumns={[
          'repeat(1, 1fr)',
          'repeat(1, 1fr)',
          'repeat(2, 1fr)',
          'repeat(3, 1fr)',
        ]}
        mx="auto"
        mt={space('extra-loose')}
        px={space('extra-loose')}
      >
        {cards.map(({ href, title, subtitle, icon: Icon }, index) => (
          <Card href={href} textAlign="center" key={index}>
            {({ hover, active }) => (
              <Box as="span">
                <CircleIcon
                  as="span"
                  hover={hover}
                  icon={Icon}
                  mx="auto"
                  mb={space('base-loose')}
                />
                <SubHeading
                  as="span"
                  display="block"
                  color={hover || active ? color('accent') : color('text-title')}
                  mb={space('base-loose')}
                >
                  {title}
                </SubHeading>
                <Body as="p" maxWidth="26ch" mx="auto">
                  {subtitle}
                </Body>
              </Box>
            )}
          </Card>
        ))}
      </Grid>
    </>
  );
};

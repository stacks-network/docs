import React from 'react';
import { Box, Grid, space, color } from '@blockstack/ui';
import { CircleIcon } from '@components/home/common';
import { CONTENT_MAX_WIDTH } from '@common/constants';
import { AtomAltIcon } from '@components/icons/atom-alt';
import { BoxIcon } from '@components/icons/box';
import { EditIcon } from '@components/icons/edit';
import { Card } from '@components/home/card';
import { Body, H1, BodyLarge, SubHeading } from '@components/home/text';

export const Hero = () => {
  return (
    <>
      <Grid pb="64px" pt="128px" style={{ placeItems: 'center' }} mt="50px">
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
        gridTemplateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(3, 1fr)']}
        mx="auto"
        mt={space('extra-loose')}
        px={space('extra-loose')}
      >
        <Card href="/design-graph/what-is-it" textAlign="center">
          {({ hover, active }) => (
            <Box as="span">
              <CircleIcon
                as="span"
                hover={hover}
                icon={AtomAltIcon}
                mx="auto"
                mb={space('base-loose')}
              />
              <SubHeading
                as="span"
                display="block"
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                Build an app
              </SubHeading>
              <Body as="p">Start building your own decentralized app.</Body>
            </Box>
          )}
        </Card>
        <Card href="/components/box" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={BoxIcon} mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                Write a smart contract
              </SubHeading>
              <Body>Learn how to write your contract in the Clarity language.</Body>
            </Box>
          )}
        </Card>
        <Card href="/contributing" textAlign="center">
          {({ hover, active }) => (
            <Box>
              <CircleIcon hover={hover} icon={EditIcon} mx="auto" mb={space('base-loose')} />
              <SubHeading
                color={hover || active ? color('accent') : color('text-title')}
                mb={space('base-loose')}
              >
                View documentation
              </SubHeading>
              <Body>Dive in to learn all about developing on Blockstack.</Body>
            </Box>
          )}
        </Card>
      </Grid>
    </>
  );
};

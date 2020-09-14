import React from 'react';
import {
  Box,
  Button,
  BoxProps,
  color,
  Flex,
  space,
  Stack,
  transition,
  SlideFade,
} from '@stacks/ui';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { SadIcon, NeutralIcon, HappyIcon } from '@components/icons/feedback';
import { useTouchable } from '@common/hooks/use-touchable';
import { border } from '@common/utils';
import { useRouter } from 'next/router';
import { getHeadingStyles } from '@components/mdx/typography';
import { css } from '@stacks/ui-core';
import { StatusCheck } from '@components/status-check';
import { useColorMode } from '@common/hooks/use-color-mode';

const Icon: React.FC<BoxProps & { icon: React.FC<any> }> = ({ icon: IconComponent, ...props }) => {
  const { bind, hover, active } = useTouchable();
  const isHovered = hover || active;
  const [mode] = useColorMode();
  return (
    <Box
      color={color('text-caption')}
      _hover={{ color: color('bg'), cursor: 'pointer' }}
      size="28px"
      {...props}
      {...bind}
    >
      <IconComponent
        bg={isHovered ? '#9985FF' : mode === 'light' ? color('bg-alt') : color('bg-light')}
      />
    </Box>
  );
};

const FeedbackCard = ({ show, onClose }) => {
  return (
    <SlideFade in={show}>
      {styles => (
        <Box ml={space('base-loose')} p={space('base')}>
          <Flex
            p={space('base')}
            border={border()}
            borderRadius="12px"
            alignItems="center"
            justifyContent="center"
            bg={color('bg')}
            size="100%"
            boxShadow="mid"
            transition={transition}
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: 'high',
            }}
            style={{
              ...styles,
            }}
          >
            <Box>
              <Button
                as="a"
                // @ts-ignore
                href="https://forms.formium.io/f/5f174a3960b46d000139b62f"
                target="_blank"
              >
                Leave feedback
              </Button>
              <Box
                color={color('text-body')}
                _hover={{ color: color('accent'), textDecoration: 'underline', cursor: 'pointer' }}
                onClick={onClose}
                mt={space('tight')}
                textAlign="center"
                mx="auto"
              >
                <Text color="currentColor" fontSize="14px">
                  Dismiss
                </Text>
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </SlideFade>
  );
};

export const FeedbackSection: React.FC<BoxProps> = props => {
  const { pathname } = useRouter();
  const [showButton, setShowButton] = React.useState(false);
  const handleShow = () => {
    setShowButton(!showButton);
  };
  const editPage = pathname === '/' ? '/index' : pathname;
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      justifyContent="space-between"
      borderTop={border()}
      mt={space('extra-loose')}
    >
      <Flex>
        <Box mt={space('extra-loose')} position="relative">
          <Text {...getHeadingStyles('h5')}>Was this page helpful?</Text>
          <Stack isInline spacing={space('base-loose')} mt={space('base-loose')}>
            <Icon onClick={() => handleShow()} icon={SadIcon} />
            <Icon onClick={() => handleShow()} icon={NeutralIcon} />
            <Icon onClick={() => handleShow()} icon={HappyIcon} />
          </Stack>
        </Box>
        <FeedbackCard show={showButton} onClose={() => setShowButton(false)} />
      </Flex>
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="flex-end"
        mt={space(['extra-loose', 'extra-loose', 'base-loose'])}
      >
        <Link
          href={`https://github.com/blockstack/docs/edit/master/src/pages${editPage}.md`}
          target="_blank"
          rel="nofollow noopener noreferrer"
          fontSize="14px"
        >
          Edit this page on GitHub
        </Link>
        <StatusCheck mt={space('base-loose')} />
      </Flex>
    </Flex>
  );
};

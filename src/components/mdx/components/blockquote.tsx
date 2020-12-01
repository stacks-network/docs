import { Box, Flex, BoxProps, color, themeColor, space } from '@stacks/ui';
import React from 'react';

import { border } from '@common/utils';
import { css, Theme } from '@stacks/ui-core';
import { CheckCircleIcon } from '@components/icons/check-circle';
import { AlertTriangleIcon } from '@components/icons/alert-triangle';
import { AlertCircleIcon } from '@components/icons/alert-circle';
import { InfoCircleIcon } from '@components/icons/info-circle';

const getAlertStyles = (className: string) => {
  if (className?.includes('alert-success')) {
    return {
      borderTopColor: themeColor('green'),
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: themeColor('green'),
      icon: CheckCircleIcon,
    };
  }
  if (className?.includes('alert-info')) {
    return {
      border: border(),
      borderRadius: 'md',
      boxShadow: 'mid',
      accent: color('accent'),
      icon: InfoCircleIcon,
    };
  }
  if (className?.includes('alert-warning')) {
    return {
      borderTopColor: '#F7AA00',
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: '#F7AA00',
      icon: AlertTriangleIcon,
    };
  }
  if (className?.includes('alert-danger')) {
    return {
      borderTopColor: themeColor('red'),
      borderTopWidth: '2px',
      borderTopRightRadius: '0px',
      borderTopLeftRadius: '0px',
      accent: themeColor('red'),
      icon: AlertCircleIcon,
    };
  }
  return {};
};

export const Blockquote: React.FC<BoxProps> = React.memo(
  React.forwardRef(({ children, className, ...rest }, ref) => {
    const isAlert = className?.includes('alert');
    const { accent, icon: Icon, ...styles } = getAlertStyles(className);
    return (
      <Box
        as="blockquote"
        display="block"
        my={space('extra-loose')}
        className={className}
        ref={ref as any}
        {...rest}
      >
        <Box
          border="1px solid"
          {...{
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            gridTemplateColumns: Icon ? '22px 1fr' : '1fr',
            alignItems: 'flex-start',
            border: isAlert ? border() : border(),
            bg: isAlert ? color('bg') : color('bg-alt'),
            borderRadius: 'md',
            boxShadow: isAlert ? 'mid' : 'unset',
            py: space('base'),
            px: space('base'),
          }}
          css={(theme: Theme) =>
            css({
              '& p': {
                flexGrow: 1,
                pt: '4px',
              },
            })(theme)
          }
          {...styles}
        >
          {Icon && (
            <Flex alignItems="center" height="28x" flexShrink={0} color={accent} width="22px">
              <Box position="absolute" top="16px" size="22px">
                <Icon />
              </Box>
            </Flex>
          )}
          <Box width="100%" pl={Icon && space('tight')} flexGrow={1}>
            {children}
          </Box>
        </Box>
      </Box>
    );
  })
);

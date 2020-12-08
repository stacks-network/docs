import React, { forwardRef, Ref } from 'react';
import { LinkProps } from '@components/typography';

import { IconButton } from '@stacks/ui';
import { useColorMode } from '@common/hooks/use-color-mode';
import { IconSun, IconSunOff } from '@tabler/icons';

export const ColorModeButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => {
  const [colorMode, toggleColorMode] = useColorMode();
  const Icon = colorMode === 'dark' ? IconSun : IconSunOff;
  return (
    <IconButton
      onClick={toggleColorMode}
      title="Toggle color mode"
      icon={Icon}
      ref={ref}
      {...props}
    />
  );
});

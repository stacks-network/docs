import { useHover, useActive } from 'use-events';

export const useTouchable = (options?: any) => {
  const [hover, hoverBind] = useHover();
  const [active, activeBind] = useActive();
  return {
    bind: {
      ...hoverBind,
      ...activeBind,
    },
    hover,
    active,
  };
};

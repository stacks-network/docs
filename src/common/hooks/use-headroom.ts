import { Ref, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useRect } from '@reach/rect';
import { useScroll } from '@common/hooks/use-scroll';

export const useHeadroom = (target: Ref<HTMLDivElement>, { useStyle = true, wait = 0 } = {}) => {
  const styleInserted = false;
  const rect = useRect(target as any);
  const { scrollY, scrollDirection } = useScroll();

  if (typeof document !== 'undefined') {
    const header = document.querySelector('.headroom');

    const listener = debounce(() => {
      header?.classList?.toggle('unpinned', window.pageYOffset >= rect?.height);
    }, 50);

    useEffect(() => {
      if (
        scrollDirection === 'down' &&
        header.classList.contains('unpinned') &&
        header.classList.contains('hidden')
      ) {
        header.classList.remove('hidden');
      }
      if (
        scrollDirection === 'up' &&
        header.classList.contains('unpinned') &&
        !header.classList.contains('hidden')
      ) {
        header.classList.add('hidden');
      }
    }, [scrollDirection]);

    useEffect(() => {
      if (rect) {
        document.addEventListener('scroll', listener, { passive: true });

        return () => document.removeEventListener('scroll', listener);
      }
    }, [rect]);
  }
};

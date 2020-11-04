import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@common/hooks/use-app-state';

interface ActiveHeadingReturn {
  isActive: boolean;
  doChangeActiveSlug: (value: string) => void;
  location: string;
  slugInView?: string;
  doChangeSlugInView: (value: string) => void;
}

const getHash = (url: string) => url?.includes('#') && url.split('#')[1];

export const useWatchActiveHeadingChange = () => {
  const router = useRouter();
  const asPath = router && router.asPath;
  const { activeSlug, doChangeActiveSlug } = useAppState();
  const urlHash = getHash(asPath);

  const handleRouteChange = url => {
    if (url) {
      const hash = getHash(url);
      if (hash) doChangeActiveSlug(hash);
    }
  };

  useEffect(() => {
    if ((urlHash && !activeSlug) || (urlHash && urlHash !== activeSlug)) {
      doChangeActiveSlug(urlHash);
    }
    router.events.on('hashChangeStart', handleRouteChange);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('hashChangeStart', handleRouteChange);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
};

export const useActiveHeading = (_slug: string): ActiveHeadingReturn => {
  const { activeSlug, slugInView, doChangeActiveSlug, doChangeSlugInView } = useAppState();
  const location = typeof window !== 'undefined' && window.location.href;

  const isActive = _slug === activeSlug;

  return {
    isActive,
    doChangeActiveSlug,
    location,
    slugInView,
    doChangeSlugInView,
  };
};

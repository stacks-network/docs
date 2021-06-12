import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    Fathom.load(process.env.FATHOM_ID, {
      includedDomains: ['docs.stacks.co'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);
};

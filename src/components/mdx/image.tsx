import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { useRouter } from 'next/router';

const imgix = 'https://stacks-documentation.imgix.net';

const params = '?auto=compress,format';

const getUrl = pathname => {
  let url = '';
  const levels = pathname.split('/');
  levels.forEach((level, index) => {
    if (index !== levels.length - 1) {
      url += `${level}/`;
    }
  });
  return url;
};

const useImgix = (src: string) => {
  if (process.env.NODE_ENV !== 'production' || !src)
    return {
      src,
      srcset: undefined,
    };
  let _src = src;
  const router = useRouter();
  if (!src?.startsWith('http')) {
    const path = src.startsWith('/') ? '' : getUrl(router.pathname);
    _src = `${imgix + path + src + params}`;
  }
  const srcset = `${_src}&w=860&dpr=1&fit=max 1x,
          ${_src}&w=480&fit=max&q=40&dpr=2 2x,
          ${_src}&w=480&fit=max&q=20&dpr=3 3x`;

  const base = `${_src}&w=720&dpr=1&fit=max`;
  return {
    srcset,
    src: base,
  };
};

export const Img: React.FC<BoxProps & { loading?: string; src?: string; alt?: string }> = ({
  src: _src,
  ...rest
}) => {
  const { src, srcset } = useImgix(_src);
  const props = {
    src,
    srcSet: srcset,
    ...rest,
  };
  return <Box loading="lazy" maxWidth="100%" display="block" as="img" {...props} />;
};

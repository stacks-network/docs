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
  if (process.env.NODE_ENV !== 'production' || !src) return src;
  let _src = src;
  const router = useRouter();
  if (!src?.startsWith('http')) {
    const path = src.startsWith('/') ? '' : getUrl(router.pathname);
    _src = `${imgix + path + src + params}`;
  }
  return _src;
};

export const Img: React.FC<BoxProps & { loading?: string; src?: string; alt?: string }> = ({
  src: _src,
  ...rest
}) => {
  const src = useImgix(_src);
  const props = {
    src,
    ...rest,
  };
  return <Box loading="lazy" maxWidth="100%" display="block" as="img" {...props} />;
};

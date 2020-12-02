import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { useRouter } from 'next/router';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

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
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production' || !src)
    return {
      src,
      srcset: undefined,
    };
  let _src = src;
  let _srcSet = undefined;
  const router = useRouter();
  if (!src?.startsWith('http')) {
    const path = src.startsWith('/') ? '' : getUrl(router.pathname);
    _src = `${imgix + path + src + params}`;
    _srcSet = `${_src}&w=860&dpr=1&fit=max 1x,
          ${_src}&w=480&fit=max&q=40&dpr=2 2x,
          ${_src}&w=480&fit=max&q=20&dpr=3 3x`;

    const base = `${_src}&w=720&dpr=1&fit=max`;
    const placeholder = `${_src}&w=40&dpr=1&fit=max`;
    return {
      srcset: _srcSet,
      src: base,
      placeholder,
    };
  } else {
    return {
      src: _src,
      srcset: _srcSet,
    };
  }
};

const getAspectRatio = dimensions => {
  if (!dimensions) return;

  const { width, height } = dimensions;

  return (height / width) * 100;
};

const BaseImg: ForwardRefExoticComponentWithAs<BoxProps, 'img'> = forwardRefWithAs<BoxProps, 'img'>(
  ({ as = 'img', style = {}, ...props }, ref) => {
    return (
      <Box
        maxWidth="100%"
        width={['100%', '100%', 'inherit', 'inherit']}
        display="block"
        as={as}
        loading="lazy"
        imageRendering="-webkit-optimize-contrast"
        style={{
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

export const Img: ForwardRefExoticComponentWithAs<
  BoxProps & { loading?: string; dimensions?: any },
  'img'
> = React.memo(({ src: _src, dimensions, ...rest }) => {
  const { src, srcset } = useImgix(_src);

  const props = {
    src,
    srcSet: srcset,
    ...rest,
  };

  if (dimensions) {
    // means the image is local and we can generate the aspect ratio
    // and prevent the page from jumping due to lack of an image being loaded
    // (because of the built in lazy-loading)
    const aspectRatio = getAspectRatio(dimensions);

    const width = dimensions.width <= 720 ? `${dimensions.width}px` : '100%';
    return (
      <Box width={width} maxWidth="100%" padding="0 !important" position="relative" className="img">
        <Box height="0" paddingBottom={`${aspectRatio}%`} width="100%" />
        <BaseImg position="absolute" top={0} left={0} {...(props as any)} />
      </Box>
    );
  }
  return <BaseImg className="img" {...(props as any)} />;
});

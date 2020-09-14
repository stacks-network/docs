import React from 'react';
import { Box, BoxProps, useSafeLayoutEffect } from '@stacks/ui';
import { useSpring, animated, config } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { makeCancelable } from '@common/utils';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

interface ImageProps {
  /** The source of the image to load */
  src: string;

  /** The source set of the image to load */
  srcSet?: string;

  /** The alt text description of the image you are loading */
  alt?: string;

  /** Sizes descriptor */
  sizes?: string;
}

const loadImage = (
  { src, srcSet, alt, sizes }: ImageProps,
  experimentalDecode = false
): Promise<any> =>
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  new Promise((resolve, reject) => {
    if (typeof Image !== 'undefined') {
      const image = new Image();
      if (srcSet) {
        image.srcset = srcSet;
      }
      if (alt) {
        image.alt = alt;
      }
      if (sizes) {
        image.sizes = sizes;
      }
      image.src = src;

      /** @see: https://www.chromestatus.com/feature/5637156160667648 */
      if (experimentalDecode && 'decode' in image) {
        return (
          image
            // NOTE: .decode() is not in the TS defs yet
            // TODO: consider writing the .decode() definition and sending a PR
            //@ts-ignore
            .decode()
            //@ts-ignore
            .then((image: HTMLImageElement) => resolve(image))
            .catch((err: any) => reject(err))
        );
      }

      image.onload = resolve;
      image.onerror = reject;
    }
  });

export const LazyImage: ForwardRefExoticComponentWithAs<BoxProps, 'img'> = forwardRefWithAs<
  BoxProps,
  'img'
>(({ as = 'img', src, srcSet, style = {}, placeholder, ...props }, forwardedRef) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  const [loading, setLoading] = React.useState(false);
  const [source, setSrc] = React.useState({
    src: undefined,
    srcSet: undefined,
  });

  const loadingPromise = makeCancelable(loadImage({ src, srcSet }, true));

  const onLoad = React.useCallback(
    () =>
      requestAnimationFrame(() => {
        console.log('on-load');
        setSrc({ src, srcSet });
      }),
    []
  );

  useSafeLayoutEffect(() => {
    if (!source.src && !loading && inView) {
      setLoading(true);
      loadingPromise.promise
        .then(_res => {
          console.log('loaded');
          onLoad();
        })
        .catch(e => {
          // If the Loading Promise was canceled, it means we have stopped
          // loading due to unmount, rather than an error.
          if (!e.isCanceled) {
            console.error('failed to load image');
          }
        });
    }
  }, [source, loading, inView]);

  const styleProps = useSpring({ opacity: source.src ? 1 : 0, config: config.gentle });
  const placeholderProps = useSpring({ opacity: source.src ? 0 : 1, config: config.gentle });

  return (
    <Box
      as="span"
      maxWidth="100%"
      width={['100%', '100%', 'inherit', 'inherit']}
      display="block"
      position="absolute"
      ref={ref}
      {...props}
    >
      <Box as="span" top={0} left={0} width="100%" position="absolute">
        <Box
          as={animated.img}
          width="100%"
          style={{
            filter: 'blur(5px)',
            ...placeholderProps,
          }}
          //@ts-ignore
          src={placeholder}
        />
      </Box>
      {source.src ? (
        <Box
          maxWidth="100%"
          width={['100%', '100%', 'inherit', 'inherit']}
          display="block"
          as={(animated.img as unknown) as 'img'}
          zIndex={99}
          style={
            {
              opacity: 0,
              willChange: 'opacity',
              ...style,
              ...styleProps,
            } as any
          }
          {...(source as any)}
          {...(props as any)}
        />
      ) : null}
    </Box>
  );
});

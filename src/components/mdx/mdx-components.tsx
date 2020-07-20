import React from 'react';
import { Box, space, BoxProps, color, themeColor } from '@blockstack/ui';
import css from '@styled-system/css';
import {
  Heading,
  Pre,
  THead,
  SmartLink,
  TData,
  Table,
  InlineCode,
} from '@components/mdx/components';
import { Text } from '@components/typography';
import { border } from '@common/utils';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Code = dynamic(() => import('../code-block'));

const BaseHeading: React.FC<BoxProps> = React.memo(props => (
  <Heading width="100%" mt={space('base-loose')} {...props} />
));

export const H1: React.FC<BoxProps> = props => <BaseHeading as="h1" {...props} />;
export const H2: React.FC<BoxProps> = props => <BaseHeading as="h2" {...props} />;
export const H3: React.FC<BoxProps> = props => <BaseHeading as="h3" {...props} />;
export const H4: React.FC<BoxProps> = props => <BaseHeading as="h4" {...props} />;
export const H5: React.FC<BoxProps> = props => <BaseHeading as="h5" {...props} />;
export const H6: React.FC<BoxProps> = props => <BaseHeading as="h6" {...props} />;

export const Br: React.FC<BoxProps> = props => <Box height="24px" {...props} />;
export const Hr: React.FC<BoxProps> = props => (
  <Box
    as="hr"
    borderTopWidth="1px"
    borderColor={color('border')}
    my={space('extra-loose')}
    mx={space('extra-loose')}
    {...props}
  />
);

export const P: React.FC<BoxProps> = props => <Text as="p" {...props} />;
export const Ol: React.FC<BoxProps> = props => (
  <Box pl={space('base')} mt={space('base')} mb={space('base-tight')} as="ol" {...props} />
);
export const Ul: React.FC<BoxProps> = props => (
  <Box pl={space('base-loose')} mt={space('base')} mb={space('base-tight')} as="ul" {...props} />
);
export const Li: React.FC<BoxProps> = props => <Box as="li" pb={space('tight')} {...props} />;

const getAlertStyles = (className: string) => {
  if (className?.includes('alert-success')) {
    return {};
  }
  if (className?.includes('alert-info')) {
    return {};
  }
  if (className?.includes('alert-warning')) {
    return {
      bg: '#FEF0E3',
      borderColor: '#F7AA00',
      accent: '#F7AA00',
    };
  }
  if (className?.includes('alert-danger')) {
    return {
      bg: '#FCEBEC',
      borderColor: themeColor('red'),
      accent: themeColor('red'),
    };
  }
  return {};
};

export const BlockQuote: React.FC<BoxProps> = ({ children, className, ...rest }) => {
  const { accent, ...styles } = getAlertStyles(className);
  return (
    <Box as="blockquote" display="block" my={space('extra-loose')} className={className} {...rest}>
      <Box
        border="1px solid"
        css={css({
          border: border(),
          borderRadius: 'md',
          boxShadow: 'mid',
          py: space('base'),
          px: space('base'),
          bg: color('bg-light'),
          ...styles,
        })}
      >
        <Box
          css={css({
            marginTop: 0,
            py: space('base-tight'),
            borderLeft: '2px solid',
            borderRadius: '2px',
            borderColor: accent || color('accent'),
            pl: space('base'),
          })}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const imgix = 'https://docs-stacks.imgix.net';

const params = '?auto=compress,format';

const getUrl = pathname => {
  let url = '';
  const levels = pathname.split('/');
  levels.forEach((level, index) => {
    if (index !== levels.length - 1) {
      url += level + '/';
    }
  });
  return url;
};

const useImgix = (src: string) => {
  let _src = src;
  const router = useRouter();
  if (!src.startsWith('http')) {
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

export const MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  inlineCode: InlineCode,
  code: Code,
  pre: Pre,
  br: Br,
  hr: Hr,
  table: Table,
  th: THead,
  td: TData,
  a: SmartLink,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  img: Img,
  blockquote: BlockQuote,
};

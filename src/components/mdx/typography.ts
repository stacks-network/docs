import capsize from 'capsize';

const fontMetrics = {
  capHeight: 718,
  ascent: 1040,
  descent: -234,
  lineGap: 0,
  unitsPerEm: 1000,
};

export const baseTypeStyles = {
  letterSpacing: '-0.01em',
  display: 'flex',
  fontFamily: `'Soehne', Inter, sans-serif`,
};

export const getCapsizeStyles = (fontSize, leading) =>
  capsize({
    fontMetrics,
    fontSize,
    leading,
  });

const h1 = {
  fontWeight: 600,
  ...getCapsizeStyles(36, 52),
};

const h2 = {
  fontWeight: 500,
  ...getCapsizeStyles(24, 40),
};

const h3 = {
  fontWeight: 500,
  ...getCapsizeStyles(18, 32),
};

const h4 = {
  fontWeight: 400,
  ...getCapsizeStyles(20, 36),
};

const h5 = {
  fontWeight: 400,
  ...getCapsizeStyles(16, 26),
};

const h6 = {
  fontWeight: 400,
  ...getCapsizeStyles(14, 20),
};

const headings = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
};

export const getHeadingStyles = (as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
  return {
    ...headings[as],
  };
};

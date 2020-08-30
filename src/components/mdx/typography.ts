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

export const getCapsizeStyles = (fontSize, leading, prefix = '_') => {
  const styles = capsize({
    fontMetrics,
    fontSize,
    leading,
  });

  Object.keys(styles).forEach(prop => {
    if (prop.startsWith('::')) {
      styles[prop.replace('::', prefix)] = styles[prop];
      delete styles[prop];
    }
  });

  return styles;
};

const h1 = prefix => ({
  fontWeight: 600,
  ...getCapsizeStyles(36, 42, prefix),
});

const h2 = prefix => ({
  fontWeight: 500,
  ...getCapsizeStyles(24, 32, prefix),
});

const h3 = prefix => ({
  fontWeight: 500,
  ...getCapsizeStyles(18, 28, prefix),
});

const h4 = prefix => ({
  fontWeight: 400,
  ...getCapsizeStyles(20, 32, prefix),
});

const h5 = prefix => ({
  fontWeight: 400,
  ...getCapsizeStyles(16, 26, prefix),
});

const h6 = prefix => ({
  fontWeight: 400,
  ...getCapsizeStyles(14, 20, prefix),
});

const headings = (as, prefix) => ({
  h1: h1(prefix),
  h2: h2(prefix),
  h3: h3(prefix),
  h4: h4(prefix),
  h5: h5(prefix),
  h6: h6(prefix),
});

export const getHeadingStyles = (as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', prefix = '_') => {
  return {
    ...headings(as, prefix)[as],
  };
};

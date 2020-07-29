export const baseTypeStyles = {
  letterSpacing: '-0.01em',
  dispay: 'flex',
  fontFeatureSettings: `'ss01' on`,
};

const h1 = {
  fontWeight: 'bolder',
  fontSize: ['38px', '38px', '44px'],
  lineHeight: '52px',
  padding: '0.05px 0',
  ':before': {
    content: "''",
    marginTop: ['-0.32188995215311006em', '-0.32188995215311006em', '-0.2284090909090909em'],
    display: 'block',
    height: 0,
  },
  ':after': {
    content: "''",
    marginBottom: ['-0.32188995215311006em', '-0.32188995215311006em', '-0.22840909090909092em'],
    display: 'block',
    height: 0,
  },
};
const h2 = {
  fontWeight: 600,
  fontSize: '27.5px',
  lineHeight: '34px',
  padding: '0.05px 0',
  ':before': {
    content: "''",
    marginTop: '-0.25636363636363635em',
    display: 'block',
    height: 0,
  },
  ':after': {
    content: "''",
    marginBottom: '-0.2563636363636364em',
    display: 'block',
    height: 0,
  },
};

const h3 = {
  fontWeight: 500,
  fontSize: '22px',
  lineHeight: '32px',
  padding: '0.05px 0',
  ':before': {
    content: "''",
    marginTop: '-0.3659090909090909em',
    display: 'block',
    height: 0,
  },
  ':after': {
    content: "''",
    marginBottom: '-0.3659090909090909em',
    display: 'block',
    height: 0,
  },
};

const h4 = {
  fontSize: '19.25px',
  lineHeight: '28px',
  padding: '0.05px 0',
  ':before': {
    content: "''",
    marginTop: '-0.36623376623376624em',
    display: 'block',
    height: 0,
  },
  ':after': {
    content: "''",
    marginBottom: '-0.36623376623376624em',
    display: 'block',
    height: 0,
  },
};
const h5 = {
  fontSize: '16px',
  lineHeight: '28px',
  fontWeight: 'bold',
};

const h6 = {
  fontSize: '14px',
  lineHeight: '28px',
  fontWeight: 'bold',
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

export const remarkPlugins = (defaultLang: string) => [
  [
    require('../lib/remark-shiki'),
    { theme: 'Material-Theme-Default', defaultLang: defaultLang },
  ],
  require('remark-slug'),
];

const replaceTicks = value => {
  const _value = value.trim();
  if (_value.startsWith('`') && !_value.endsWith('`')) {
    return _value.replace('`', '');
  }
  return _value;
};

export const wrapValueInTicks = value => '`' + value.replace('`', '').replace('`', '') + '`';

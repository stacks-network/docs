import { PrismTheme } from 'prism-react-renderer';

export const theme: PrismTheme = {
  plain: {
    color: 'rgba(255,255,255,1)',
    backgroundColor: '#0f111a',
  },
  styles: [
    {
      types: ['string'],
      style: {
        color: 'rgb(195, 232, 141)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'rgb(255, 156, 172)',
      },
    },
    {
      types: ['number', 'keyword', 'operator'],
      style: {
        color: 'rgb(247, 140, 108)',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation', 'builtin'],
      style: {
        color: 'rgb(137, 221, 255)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'rgb(240, 113, 120)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(255, 203, 107)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(130, 170, 255)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'rgb(137, 221, 255)',
        fontStyle: 'italic',
      },
    },
  ],
};
// export const theme: PrismTheme = {
//   plain: {
//     color: '#fff',
//     backgroundColor: 'transparent',
//   },
//   styles: [
//     {
//       types: ['prolog'],
//       style: {
//         color: 'rgb(0, 0, 128)',
//       },
//     },
//     {
//       types: ['comment', 'punctuation'],
//       style: {
//         color: 'rgb(106, 153, 85)',
//       },
//     },
//     {
//       types: ['builtin', 'tag', 'changed', 'function', 'keyword'],
//       style: {
//         color: 'rgb(86, 156, 214)',
//       },
//     },
//     {
//       types: ['number', 'variable', 'inserted'],
//       style: {
//         color: '#A58FFF',
//       },
//     },
//     {
//       types: ['operator'],
//       style: {
//         color: 'rgb(212, 212, 212)',
//       },
//     },
//     {
//       types: ['constant'],
//       style: {
//         color: 'rgb(100, 102, 149)',
//       },
//     },
//     {
//       types: ['attr-name'],
//       style: {
//         color: 'rgb(156, 220, 254)',
//       },
//     },
//     {
//       types: ['car'],
//       style: {
//         color: 'rgb(156, 220, 254)',
//       },
//     },
//     {
//       types: ['deleted', 'string'],
//       style: {
//         color: '#FF7B48',
//       },
//     },
//     {
//       types: ['class-name'],
//       style: {
//         color: 'rgb(78, 201, 176)',
//       },
//     },
//     {
//       types: ['char'],
//       style: {
//         color: '#FF7B48',
//       },
//     },
//   ],
// };

import { globalCss } from '@nextui-org/react';

const globalStyles = globalCss({
  p: {
    letterSpacing: 'unset',
  },

  pre: {
    backgroundColor: '$accents2',
    code: {
      background: 'unset',
    }
  },

  ul: {
    listStyle: 'inside disc'
  },

  ol: {
    listStyle: 'inside numeric'
  }
});

export default globalStyles;

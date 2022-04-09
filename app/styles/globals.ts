import { globalCss } from '@nextui-org/react';

const globalStyles = globalCss({
  'html, body': { 
    margin: 0, 
    padding: 0, 
    fontFamily: `'Space Mono', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  a: {
    color: 'inherit',
    textDecoration: 'underline',
  },
  '*': {
    boxSizing: 'border-box',
  },
  '.wallet-adapter-button-trigger': {
    background: `linear-gradient(
      112deg,
      var(--nextui-colors-cyan500) -63.59%,
      var(--nextui-colors-pink500) -20.3%,
      var(--nextui-colors-blue500) 70.46%
    )`,
    fontFamily: `'Space Mono' !important`,
  },
  '.wallet-adapter-dropdown-list': {
    zIndex: `201 !important`,
  },
  p: {
    letterSpacing: 'unset',
  },

  pre: {
    backgroundColor: '$accents2',
  },

  ul: {
    listStyle: 'inside disc',
  },

  ol: {
    listStyle: 'inside numeric',
  }
});

export default globalStyles;
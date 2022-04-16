import { ErrorBoundary } from 'react-error-boundary';
import type { AppProps } from 'next/app';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import globalStyles from '../styles/globals';
import '../styles/global.css';

import WalletContext from 'src/contexts/wallet';
import Layout from 'src/components/layout';

const baseThemeObject = {
  theme: {
    fontSizes: {
      base: '18px'
    }
  }
};

const lightTheme = createTheme({
  type: 'light',
  ...baseThemeObject
});

const darkTheme = createTheme({
  type: 'dark',
  ...baseThemeObject
});

// @ts-ignore
const ErrorFallback = ({ error }) => {
  return (
    <Layout>
      <div role="alert">
        <p>Something broke! Don't say I didn't warn ya</p>
        <pre>{error.message}</pre>
      </div>
    </Layout>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className
        }}
      >
        <NextUIProvider>
          <WalletContext>
            <Component {...pageProps} />
          </WalletContext>
        </NextUIProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

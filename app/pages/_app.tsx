import { ErrorBoundary } from 'react-error-boundary';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider, createTheme, globalCss } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import WalletContext from 'src/contexts/wallet';
import Layout from 'src/components/layout';

const lightTheme = createTheme({
  type: 'light'
});

const darkTheme = createTheme({
  type: 'dark'
});

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

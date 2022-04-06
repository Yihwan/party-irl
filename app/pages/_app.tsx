import {ErrorBoundary} from 'react-error-boundary'
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';

import WalletContext from 'src/contexts/wallet';
import Layout from 'src/components/layout';

const ErrorFallback = ({ error }) => {
  return (
    <Layout>
      <div role="alert">
        <p>Something broke! Don't say I didn't warn ya</p>
        <pre>{error.message}</pre>
      </div>
    </Layout>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <NextUIProvider>
        <WalletContext>
          <Component {...pageProps} />
        </WalletContext>
      </NextUIProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

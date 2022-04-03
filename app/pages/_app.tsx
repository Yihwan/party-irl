import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react';

import WalletContext from '../src/contexts/wallet';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <NextUIProvider>
      <WalletContext>
        <Component {...pageProps} />
      </WalletContext>
    </NextUIProvider>
  )
}

export default MyApp

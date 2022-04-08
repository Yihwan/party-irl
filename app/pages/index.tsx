import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../src/components/layout';
import Home from '../src/components/page/home';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>partyIRL: Built on Solana</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <Home />
      </Layout>
    </>
  );
};

export default HomePage;

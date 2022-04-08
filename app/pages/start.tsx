import type { NextPage } from 'next';
import Head from 'next/head';

import Start from 'src/components/page/start';
import Layout from 'src/components/layout';

const StartPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Start a party | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <Start />
      </Layout>
    </>
  );
};

export default StartPage;

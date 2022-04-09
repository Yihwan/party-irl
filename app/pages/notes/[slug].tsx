import type { NextPage } from 'next';
import Head from 'next/head';

import Layout from 'src/components/layout';

const NotePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Join a party | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        notes
      </Layout>
    </div>
  );
};

export default NotePage;

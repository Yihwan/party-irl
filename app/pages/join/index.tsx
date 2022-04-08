import type { NextPage } from 'next';
import Head from 'next/head';

import Join from 'src/components/page/join';
import Layout from 'src/components/layout';

const JoinPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Join a party</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <Join />
      </Layout>
    </div>
  );
};

export default JoinPage;

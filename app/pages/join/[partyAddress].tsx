import { useRouter } from 'next/router';
import Head from 'next/head';

import Party from 'src/components/page/join/party';
import Layout from 'src/components/layout';

const PartyPage = () => {
  const router = useRouter();
  const { partyAddress } = router.query;

  return (
    <>
      <Head>
        <title>Party time | partyIRL</title>
        <link rel="icon" href="//balloon_favicon.png" />
      </Head>

      <Layout>
        <Party partyAddress={partyAddress} />
      </Layout>
    </>
  );
};

export default PartyPage;

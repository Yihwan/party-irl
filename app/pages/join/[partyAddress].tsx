import { useRouter } from 'next/router';

import Party from 'src/components/page/join/party';
import Layout from 'src/components/layout';

const PartyPage = () => {
  const router = useRouter()
  const { partyAddress } = router.query;

  return(
    <Layout>
      <Party partyAddress={partyAddress} />
    </Layout>
  )
}

export default PartyPage;
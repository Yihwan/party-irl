import { useRouter } from 'next/router';

import Party from 'src/components/page/join/party';

const PartyPage = () => {
  const router = useRouter()
  const { partyAddress } = router.query;
  console.log('partyAddress', partyAddress)

  return(
    <Party partyAddress={partyAddress} />
  )
}

export default PartyPage;
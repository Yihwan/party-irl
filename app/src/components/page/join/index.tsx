import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import useSolana from 'src/hooks/useSolana';

const Join = () => {
  const { program } = useSolana();
  const [parties, setParties] = useState(null);

  useEffect(() => {
    async function fetchParties() {
      if (!program) {
        return;
      }

      try {
        const parties = await program.account.party.all();
        // @ts-ignore
        setParties(parties);
      } catch (e) {
        console.log("initial fetch tx error: ", e);
      }
    }

    fetchParties();
  }, [program]);

  return(
    <>
      <div>
        <div>JOIN!</div>
        <WalletMultiButton />
        <br />
        <code>
          {JSON.stringify(parties, null, 4)}
        </code>
      </div>
    </>
  );
}

export default Join;

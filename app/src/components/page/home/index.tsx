import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import useSolana from 'src/hooks/useSolana';

const Home = () => {
  const { program } = useSolana();

  useEffect(() => {
    async function run() {
      if (!program) {
        return;
      }

      try {
        const parties = await program.account.party.all();
        console.log('parties', parties)
      } catch (e) {
        console.log("initial fetch tx error: ", e);
      }
    }

    run();
  }, [program]);

  return(
    <>
      <div>
        <div>HOME!</div>
        <WalletMultiButton />
      </div>
    </>
  );
}

export default Home;

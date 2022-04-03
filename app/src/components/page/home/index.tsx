import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import useSolana from '../../../hooks/useSolana';

const Home = () => {
  const workspace = useSolana();
  console.log(workspace)
  useEffect(() => {
    async function run() {
      try {
        const parties = await workspace.program?.account.party.all();
        console.log(parties)
      } catch (e) {
        console.log("initial fetch tx error: ", e);
      }
    }

    run();
  }, [workspace.program]);

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

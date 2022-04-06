import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import useSolana from 'src/hooks/useSolana';

import PartyAction from './components/partyAction';

const Party = ({ partyAddress }) => {
  const { program, wallet } = useSolana();
  const [partyData, setPartyData] = useState(null);
  const [guestPda, setGuestPda] = useState(null);
  const [guestData, setGuestData] = useState(null);

  /**
   * if guest+party does not exist, render ADD GUEST flow
   * if guest+party pda exists, render CHECK IN flow 
   */

  useEffect(() => {
    async function fetchPartyData() {
      if (!program || !partyAddress) {
        return;
      }

      try {
        const partyPublicKey = new PublicKey(partyAddress);
        const partyData = await program.account.party.fetch(partyPublicKey);
        // @ts-ignore
        setPartyData(partyData);

        if (!wallet || !partyData) {
          return;
        }

        const [guestPda, bump] = await PublicKey.findProgramAddress(
          ['guest', partyPublicKey.toBytes(), wallet.publicKey.toBytes()],
          program.programId,
        )

        setGuestPda(guestPda);

        try {
          const guestData = await program.account.guest.fetch(guestPda);

          setGuestData(guestData);
        } catch(error) {
          console.log(error);
        }
        
        
      } catch (e) {
        console.log("error: ", e);
        return;
      }
    }

    fetchPartyData();
  }, [program, partyAddress]);

  return(
    <>
      <div>Party: {partyAddress}</div>
      <code>
        {JSON.stringify(partyData, null, 4)}
      </code>
      <PartyAction 
        partyAddress={partyAddress} 
        partyData={partyData}
        guestPda={guestPda}
        guestData={guestData}
      />
    </>
  )
};

export default Party;
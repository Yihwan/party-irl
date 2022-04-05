import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import useSolana from 'src/hooks/useSolana';
import { web3 } from '@project-serum/anchor';

import AddGuest from './components/addGuest';
import CheckInGuest from './components/checkInGuest';

const Party = ({ partyAddress }) => {
  const { program, wallet } = useSolana();
  const [party, setParty] = useState(null);
  const [guestPda, setGuestPda] = useState(null);
  const [guestAccount, setGuestAccount] = useState(null);

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
        const party = await program.account.party.fetch(partyPublicKey);
        // @ts-ignore
        setParty(party);

        if (!wallet || !party) {
          return;
        }

        const [guestPda, bump] = await PublicKey.findProgramAddress(
          ['guest', partyPublicKey.toBytes(), wallet.publicKey.toBytes()],
          program.programId,
        )

        setGuestPda(guestPda);

        try {
          const guestAccount = await program.account.guest.fetch(guestPda);
          console.log('guestAccount', guestAccount)

          setGuestAccount(guestAccount);
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
        {JSON.stringify(party, null, 4)}
      </code>
      {guestAccount ? (
        <CheckInGuest partyData={party} partyAddress={partyAddress} guestPda={guestPda} />
      ) : (
        <AddGuest party={party} partyAddress={partyAddress} guestPda={guestPda} />
      )}
    </>
  )
};

export default Party;
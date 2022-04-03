import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import useSolana from 'src/hooks/useSolana';

const Party = ({ partyAddress }) => {
  const { program } = useSolana();
  const [party, setParty] = useState(null);

  useEffect(() => {
    async function fetchParties() {
      if (!program) {
        return;
      }

      try {
        const partyPublicKey = new PublicKey(partyAddress);
        console.log(partyPublicKey)
        const party = await program.account.party.fetch(partyPublicKey);
        // @ts-ignore
        setParties(party);
      } catch (e) {
        console.log("initial fetch tx error: ", e);
      }
    }

    fetchParties();
  }, [program]);

  return(
    <div>Party: {partyAddress}</div>
  )
};

export default Party;
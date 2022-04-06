import { useEffect } from 'react';
import useSolana from 'src/hooks/useSolana';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from "@solana/web3.js";
import { web3 } from '@project-serum/anchor';

const AddGuest = ({ partyData, partyAddress, guestPda }) => {
  const { wallet, program } = useSolana(); 

  const addGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    await program.rpc.addGuest({
      accounts: {
        party: partyAddress,
        guest: guestPda,
        guestAuthority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    })
  }

  return(
    <div>
      <h2>Add Guest Flow</h2>
      <button
        onClick={addGuest}
      >Add Guest</button>
    </div>
  );
}

export default AddGuest;
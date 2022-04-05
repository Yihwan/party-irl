import { useEffect } from 'react';
import useSolana from 'src/hooks/useSolana';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { web3 } from '@project-serum/anchor';

const CheckInGuest = ({ partyData, partyAddress, guestPda }) => {
  const { wallet, program } = useSolana();

  const addGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    await program.rpc.checkInGuest({
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
      <h2>Check In Guest Flow</h2>
      <button
        onClick={addGuest}
      >Check In Guest</button>
    </div>
  );
}

export default CheckInGuest;
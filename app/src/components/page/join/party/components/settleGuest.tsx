import { useEffect } from 'react';
import useSolana from 'src/hooks/useSolana';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { web3 } from '@project-serum/anchor';

const SettleGuest = ({ partyData, partyAddress, guestPda }) => {
  const { wallet, program } = useSolana();

  const settleGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    await program.rpc.settleGuest({
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
      <h2>Settle Guest Flow</h2>
      <button
        onClick={settleGuest}
      >Settle Guest</button>
    </div>
  );
}

export default SettleGuest;
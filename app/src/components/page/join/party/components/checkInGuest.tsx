import dayjs from 'dayjs';
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
        systemProgram: web3.SystemProgram.programId
      }
    });
  };

  if (Date.now() < partyData.partyAt.toNumber() * 1000) {
    return <h2>Check In is not open yet</h2>;
  }

  if (partyData.checkInEndsAt.toNumber() * 1000 < Date.now()) {
    return <h2>Check In has closed :(</h2>;
  }

  return (
    <div>
      <h2>Check In Guest Flow</h2>
      <button onClick={addGuest}>Check In Guest</button>
    </div>
  );
};

export default CheckInGuest;

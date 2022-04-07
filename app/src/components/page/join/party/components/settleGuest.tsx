import useSolana from 'src/hooks/useSolana';
import { web3 } from '@project-serum/anchor';

const SettleGuest = ({ partyData, partyAddress, guestPda, guestData }) => {
  const { wallet, program } = useSolana();

  console.log(guestData);
  const settleGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    try {
      await program.rpc.settleGuest({
        accounts: {
          party: partyAddress,
          guest: guestPda,
          guestAuthority: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });
    } catch(error) {
      console.error(error);
    }
  };

  if (guestData.hasSettledStake) {
    return <h2>You have already settled!</h2>;
  }

  return (
    <div>
      <h2>Settle Guest Flow</h2>
      <button onClick={settleGuest}>Settle Guest</button>
    </div>
  );
};

export default SettleGuest;

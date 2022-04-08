import useSolana from 'src/hooks/useSolana';
import { web3 } from '@project-serum/anchor';
import { Text, Button, Spacer } from '@nextui-org/react';

const SettleGuest = ({ partyData, partyAddress, guestPda, guestData }) => {
  const { wallet, program } = useSolana();
  const { stakeInLamports, checkedInGuestsCount, addedGuestsCount } = partyData;

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
    return (
      <>
        <Text h2>You've already settled</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          Hope you had fun! :) 
        </Text>
      </>
    );
  }

  return (
      <>
        <Text h2>Settle your stake</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          You'll get your {stakeInLamports / 1_000_000_000} SOL back {addedGuestsCount !== checkedInGuestsCount ? `, plus ${(addedGuestsCount - checkedInGuestsCount * stakeInLamports)/addedGuestsCount * 1_000_000} SOL from people who didn't check in` : ''}.
        </Text>
        <Spacer y={2} />

        <Button size="lg" color="success" onClick={settleGuest}>Settle</Button>
      </>
  );
};

export default SettleGuest;

import useSolana from 'src/hooks/useSolana';
import { web3 } from '@project-serum/anchor';
import { Text, Button, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';

const AddGuest = ({ partyData, partyAddress, guestPda }) => {
  const router = useRouter();
  const { wallet, program } = useSolana();
  const { maximumGuests, addedGuestsCount, stakeInLamports } = partyData;

  const addGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    try {
      await program.rpc.addGuest({
        accounts: {
          party: partyAddress,
          guest: guestPda,
          guestAuthority: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId
        }
      });

      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  if (addedGuestsCount >= maximumGuests) {
    return (
      <>
        <Text h2>This party is full :(</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          Try joining another one — or start your own!
        </Text>
      </>
    );
  }

  return (
    <>
      <Text h2>There's a spot for you</Text>
      {stakeInLamports > 0 ? (
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          Stake {partyData.stakeInLamports / 1_000_000_000} SOL to claim your
          spot. Get it back when you check-in.
        </Text>
      ) : (
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          No SOL needed to claim your spot.
        </Text>
      )}
      <Spacer y={2} />

      <Button size="lg" color="success" onClick={addGuest}>
        Join {partyData.name.length > 24 ? 'this party' : partyData.name}
      </Button>
    </>
  );
};

export default AddGuest;

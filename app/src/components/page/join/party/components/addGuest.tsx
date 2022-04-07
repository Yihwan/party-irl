import { useEffect } from 'react';
import useSolana from 'src/hooks/useSolana';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';
import { Text, Button, Spacer } from '@nextui-org/react';

const AddGuest = ({ partyData, partyAddress, guestPda }) => {
  const { wallet, program } = useSolana();
  const { maximumGuests, addedGuestsCount } = partyData;

  const addGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    await program.rpc.addGuest({
      accounts: {
        party: partyAddress,
        guest: guestPda,
        guestAuthority: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId
      }
    });
  };

  if (addedGuestsCount >= maximumGuests) {
    return(
      <>
        <Text h2>This party is full :(</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>Try joining another one — or start your own!</Text>
      </>
    )
  }
  return (
    <>
      <Text h2>There's a spot for you</Text>
      <Text css={{ fontFamily: 'Space Mono' }} size={18}>You'll need to stake ## SOL to add</Text>
      <Spacer y={2} />
      <WalletMultiButton />
      <Spacer y={0.5} />
      {!wallet && (
        <Text css={{ fontFamily: 'Space Mono' }} small>
          Connect your wallet (Devnet) to join this party.
        </Text>
      )}
      <Spacer y={1} />
      {wallet && (
        <Button size="lg" color="success" onClick={addGuest}>Join {partyData.name}</Button>
      )}
    </>
  );
};

export default AddGuest;

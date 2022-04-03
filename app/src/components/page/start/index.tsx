import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { web3 } from '@project-serum/anchor';
import { Input, Grid, Spacer } from '@nextui-org/react';

import useSolana from 'src/hooks/useSolana';

const Start = () => {
  const { wallet, program } = useSolana();

  const createParty = async () => {
    if (!wallet || !program) {
      return;
    }

    const party = web3.Keypair.generate();
  }

  if (!wallet) {
    return(
      <>
        <div>Connect your wallet to start a party.</div>
        <WalletMultiButton />
      </>
    )
  }

  return (
    <div>
      <div>Wallet connected</div>
      <WalletMultiButton />

      <h1>Test Form</h1>
      <form>
        <Grid.Container gap={4} direction='column'>
          <Input 
            required
            type="text"
            maxLength={64}
            underlined 
            labelPlaceholder="party name" 
          />
          <Spacer y={2} />
          <Input 
            required
            underlined 
            type="date"
            label="party_at (date)" 
          />
          <Spacer y={2} />
          <Input 
            required
            underlined 
            type="time"
            label="party_at (time)" 
          />
          <Spacer y={2} />
          <Input 
            required
            underlined 
            type="number"
            min={5}
            labelPlaceholder="check_in_time (minutes)" 
          />
          <Spacer y={2} />
          <Input 
            underlined 
            type="number"
            step={0.1}
            inputMode="decimal"
            min={0}
            labelPlaceholder="stake (optional)" 
          />
          <Spacer y={2} />
          <Input 
            underlined 
            type="number"
            min={1}
            labelPlaceholder="max guests (optional)" 
          />
          <Input 
            type="submit"
          />
        </Grid.Container>
      </form>
    </div>
  );
};

export default Start;

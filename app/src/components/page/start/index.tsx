import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { web3, BN } from '@project-serum/anchor';
import { Input, Grid, Spacer } from '@nextui-org/react';
import { useState } from 'react';
import useSolana from 'src/hooks/useSolana';
import dayjs from 'dayjs';

const Start = () => {
  const { wallet, program } = useSolana();
  const [name, setName] = useState('');
  const [partyAtDate, setPartyAtDate] = useState('');
  const [partyAtTime, setPartyAtTime] = useState('');
  const [checkInDuration, setCheckInDuration] = useState('15');
  const [stakeInSol, setStakeInSol] = useState('0');
  const [maximumGuests, setMaximumGuests] = useState('10');

  const createParty = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wallet || !program) {
      return;
    }

    const party = web3.Keypair.generate();
    const date = dayjs(`${partyAtDate}T${partyAtTime}`);
    const checkInDate = date.add(Number(checkInDuration), 'minutes');

    const partyAtUnix = date.unix();
    const checkInEndsAtUnix = checkInDate.unix();

    try {
      await program.rpc.createParty(
        name,
        new BN(Number(maximumGuests)),
        new BN(partyAtUnix),
        new BN(checkInEndsAtUnix),
        new BN(Number(stakeInSol) * 1_000_000_000), // convert to lamports,
        {
          accounts: {
            party: party.publicKey,
            creator: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId
          },
          signers: [party]
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!wallet) {
    return (
      <>
        <div>Connect your wallet to start a party.</div>
        <WalletMultiButton />
      </>
    );
  }

  return (
    <div>
      <div>Wallet connected</div>
      <WalletMultiButton />

      <h1>Test Form</h1>
      <form onSubmit={createParty}>
        <Grid.Container gap={4} direction="column">
          <Input
            required
            type="text"
            maxLength={64}
            underlined
            labelPlaceholder="party name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Spacer y={2} />
          <Input
            required
            underlined
            type="date"
            label="party_at (date)"
            value={partyAtDate}
            onChange={(event) => setPartyAtDate(event.target.value)}
          />
          <Spacer y={2} />
          <Input
            required
            underlined
            type="time"
            label="party_at (time)"
            value={partyAtTime}
            onChange={(event) => setPartyAtTime(event.target.value)}
          />
          <Spacer y={2} />
          <Input
            required
            underlined
            type="number"
            min={5}
            labelPlaceholder="check_in_duration (minutes)"
            helperText="Minimum: 5 minutes"
            value={checkInDuration}
            onChange={(event) => setCheckInDuration(event.target.value)}
          />
          <Spacer y={2} />
          <Input
            underlined
            type="number"
            step={0.1}
            inputMode="decimal"
            min={0}
            labelPlaceholder="stake_in_sol"
            helperText="Optional"
            value={stakeInSol}
            onChange={(event) => setStakeInSol(event.target.value)}
          />
          <Spacer y={2} />
          <Input
            underlined
            type="number"
            min={1}
            labelPlaceholder="max_guests"
            helperText="Optional"
            value={maximumGuests}
            onChange={(event) => setMaximumGuests(event.target.value)}
          />
          <Spacer y={2} />
          <Input type="submit" />
        </Grid.Container>
      </form>
    </div>
  );
};

export default Start;

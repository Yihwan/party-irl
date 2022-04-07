import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { web3, BN } from '@project-serum/anchor';
import { Input, Spacer, Text, Button } from '@nextui-org/react';
import { useState } from 'react';
import useSolana from 'src/hooks/useSolana';
import dayjs from 'dayjs'
import { useRouter } from 'next/router';

const Start = () => {
  const { wallet, program } = useSolana();
  const router = useRouter();
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

      router.push('/join');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Text h1 css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}>
        Start a party
      </Text>

      <Spacer y={2} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <WalletMultiButton />
        <Spacer y={0.5} />
        {!wallet && (
          <Text css={{ fontFamily: 'Space Mono' }} small>
            Connect your wallet (Devnet) to start a party.
          </Text>
        )}
      </div>

      {wallet && (
        <ul style={{ maxWidth: '700px', listStyle: 'disc' }}>
          <Text as="li" size={18}>
            Required fields: `party_name`{' '}
          </Text>
          <Text as="li" size={18}>
            (If you start a party, you still have to "join" separately because
            blockchain stuff.)
          </Text>
          <Text as="li" size={18}>
            Stake some SOL to join a party.
          </Text>
        </ul>
      )}

      <Spacer y={2} />

      {wallet && (
        <form onSubmit={createParty} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
          <Input
            required
            type="text"
            maxLength={64}
            label="party_name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Spacer y={1} />
          <Input
            required
            type="date"
            label="party_at (date)"
            value={partyAtDate}
            onChange={(event) => setPartyAtDate(event.target.value)}
          />
          <Spacer y={1} />
          <Input
            required
            type="time"
            label="party_at (time)"
            value={partyAtTime}
            onChange={(event) => setPartyAtTime(event.target.value)}
          />
          <Spacer y={1} />
          <Input
            required
            type="number"
            min={5}
            label="check_in_duration (minutes)"
            value={checkInDuration}
            onChange={(event) => setCheckInDuration(event.target.value)}
          />
          <Spacer y={1} />
          <Input
            type="number"
            step={0.1}
            inputMode="decimal"
            min={0}
            label="stake_in_sol"
            value={stakeInSol}
            onChange={(event) => setStakeInSol(event.target.value)}
          />
          <Spacer y={1} />
          <Input
            type="number"
            min={1}
            label="max_guests"
            value={maximumGuests}
            onChange={(event) => setMaximumGuests(event.target.value)}
          />
          <Spacer y={2} />
          <Input status="success" type="submit" />
        </form>
      )}
    </>
  );
};

export default Start;

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
  const [partyAtDate, setPartyAtDate] = useState(dayjs().add(1,'day').format('YYYY-MM-DD'));
  const [partyAtTime, setPartyAtTime] = useState('12:00');
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

    // idk why validation against solana clock doesn't work
    if (partyAtUnix * 1000 < Date.now()) {
      return;
    }
    
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
            Required: `party_name`, `party_at` (date and time), `check_in_duration` (min: 5 minutes), max_guests.
          </Text>
          <Text as="li" size={18}>
            Optional: `stake_in_sol`. This is how much guests need to "stake" in order to get added to party. You get your stake back after you check-in (you lose it if you don't).
          </Text>
          <Text as="li" size={18}>
            You have to add yourself as a guest after creating a party for now. Maybe I'll re-architect this some day.
          </Text>
          <Text as="li" size={18}>
            After creating a party, you'll be re-directed to /join. Wait a couple seconds and refresh the page to see and join your party. (sns this was a hackathon project)
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
            min={dayjs().format('YYYY-MM-DD')}
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
            min={1}
            label="max_guests"
            value={maximumGuests}
            onChange={(event) => setMaximumGuests(event.target.value)}
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
          <Spacer y={2} />
          <Input status="success" type="submit" />
        </form>
      )}
    </>
  );
};

export default Start;

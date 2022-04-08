import dayjs from 'dayjs';
import useSolana from 'src/hooks/useSolana';
import { web3 } from '@project-serum/anchor';
import { Text, Button, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';

import LocalizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(LocalizedFormat);

const CheckInGuest = ({ partyData, partyAddress, guestPda }) => {
  const router = useRouter();
  const { wallet, program } = useSolana();
  const { partyAt, checkInEndsAt } = partyData;

  const checkInGuest = async () => {
    if (!program || !wallet) {
      return;
    }

    try {
      await program.rpc.checkInGuest({
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

  const partyAtDayJs = dayjs(partyAt.toNumber() * 1000);
  const checkInEndsAtDayJs = dayjs(checkInEndsAt.toNumber() * 1000);

  if (Date.now() < partyData.partyAt.toNumber() * 1000) {
    return (
      <>
        <Text h2>You're on the list!</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          Don't forget to check-in at {partyAtDayJs.format('LT')} on{' '}
          {partyAtDayJs.format('LL')}.<br />
          Check-in closes at {checkInEndsAtDayJs.format('LT')} on{' '}
          {checkInEndsAtDayJs.format('LL')}.
        </Text>
      </>
    );
  }

  if (partyData.checkInEndsAt.toNumber() * 1000 < Date.now()) {
    return (
      <>
        <Text h2>Check-in has closed. :(</Text>
        <Text css={{ fontFamily: 'Space Mono' }} size={18}>
          Good thing this is on Devnet! This <Text i>is</Text> on Devnet ...
          right?
        </Text>
      </>
    );
  }

  return (
    <>
      <Text h2>It's time to check-in!</Text>
      <Spacer y={1} />

      <Button size="lg" color="success" onClick={checkInGuest}>
        Check-in
      </Button>
    </>
  );
};

export default CheckInGuest;

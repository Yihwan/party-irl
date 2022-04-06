import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import useSolana from 'src/hooks/useSolana';
import {
  Text,
  Spacer,
  Loading
} from '@nextui-org/react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

import PartyAction from './components/partyAction';

const Party = ({ partyAddress }) => {
  const { program, wallet } = useSolana();
  const [partyData, setPartyData] = useState(null);
  const [guestPda, setGuestPda] = useState(null);
  const [guestData, setGuestData] = useState(null);

  /**
   * if guest+party does not exist, render ADD GUEST flow
   * if guest+party pda exists, render CHECK IN flow
   */

  useEffect(() => {
    async function fetchPartyData() {
      if (!program || !partyAddress) {
        return;
      }

      try {
        const partyPublicKey = new PublicKey(partyAddress);
        const partyData = await program.account.party.fetch(partyPublicKey);
        // @ts-ignore
        setPartyData(partyData);

        if (!wallet || !partyData) {
          return;
        }

        const [guestPda, bump] = await PublicKey.findProgramAddress(
          ['guest', partyPublicKey.toBytes(), wallet.publicKey.toBytes()],
          program.programId
        );

        setGuestPda(guestPda);

        try {
          const guestData = await program.account.guest.fetch(guestPda);

          setGuestData(guestData);
        } catch (error) {
          console.log(error);
        }
      } catch (e) {
        console.log('error: ', e);
        return;
      }
    }

    fetchPartyData();
  }, [program, partyAddress]);

  if (!partyData) {
    return <Loading />;
  }

  const {
    name,
    partyAt,
    creator,
    checkInEndsAt,
    stakeInLamports,
    maximumGuests,
    addedGuestsCount,
    checkedInGuestsCount
  } = partyData;

  console.log(partyData);

  const createdBy = `${creator.toBase58().slice(0, 5)}...${creator
    .toBase58()
    .slice(creator.toBase58().length - 4, creator.toBase58().length)}`;

  return (
    <>
      <Text h1>{name}</Text>
      <Spacer y={1} />
      <Text h4 i>
        created_by:{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://explorer.solana.com/address/${creator.toBase58()}?cluster=devnet`}
          style={{ fontWeight: 400 }}
        >
          {createdBy}
        </a>
      </Text>
      <Text h4 i>
        party_at:{' '}
        <span style={{ fontWeight: 400 }}>
          {dayjs(partyAt.toNumber() * 1000).format('LLL')}
        </span>
      </Text>
      <Text h4 i>
        check_in_ends_at:{' '}
        <span style={{ fontWeight: 400 }}>
          {dayjs(checkInEndsAt.toNumber() * 1000).format('LLL')}
        </span>
      </Text>
      <Text h4 i>
        stake_in_sol:{' '}
        <span style={{ fontWeight: 400 }}>
          {stakeInLamports / 1_000_000_000}
        </span>
      </Text>
      <Text h4 i>
        maximum_guests: <span style={{ fontWeight: 400 }}>{maximumGuests}</span>
      </Text>
      <Text h4 i>
        added_guests_count:{' '}
        <span style={{ fontWeight: 400 }}>{addedGuestsCount}</span>
      </Text>
      <Text h4 i>
        checked_in_guests_count:{' '}
        <span style={{ fontWeight: 400 }}>{checkedInGuestsCount}</span>
      </Text>
    </>
  );
};

export default Party;

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loading, Text, Spacer } from '@nextui-org/react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

import useSolana from 'src/hooks/useSolana';

const Join = () => {
  const { program } = useSolana();
  const [parties, setParties] = useState(null);

  useEffect(() => {
    async function fetchParties() {
      if (!program) {
        return;
      }

      try {
        const parties = await program.account.party.all();
        // @ts-ignore
        setParties(parties);
      } catch (e) {
        console.log('initial fetch tx error: ', e);
      }
    }

    fetchParties();
  }, [program]);

  if (!parties) {
    return (
      <>
        <Text h1 css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}>
          Join a party
        </Text>

        <Spacer y={2} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Text h1 css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}>
        Join a party
      </Text>

      <Spacer y={2} />

      {parties
        .sort(
          (a, b) => b.account.partyAt.toNumber() - a.account.partyAt.toNumber()
        )
        .map((party, idx) => (
          <div key={`${party.account.name}-${idx}`}>
            <Text h2>
              <Link href={`/join/${party.publicKey}`}>
                <a>{party.account.name}</a>
              </Link>
            </Text>
            <Text h4 i weight="normal">
              {getPartyStatusText({
                partyAt: party.account.partyAt,
                checkInEndsAt: party.account.checkInEndsAt,
                maximumGuests: party.account.maximumGuests,
                addedGuestsCount: party.account.addedGuestsCount,
                checkedInGuestsCount: party.account.checkedInGuestsCount
              })}
            </Text>
            <Text weight="medium" small transform="uppercase">
              {dayjs(party.account.partyAt.toNumber() * 1000).format('LLL')}
            </Text>
            <Spacer y={2} />
          </div>
        ))}
    </>
  );
};

const getPartyStatusText = ({
  partyAt,
  checkInEndsAt,
  maximumGuests,
  addedGuestsCount,
  checkedInGuestsCount
}) => {
  if (partyAt * 1000 > Date.now() && addedGuestsCount === maximumGuests) {
    return `This party is full!`;
  }

  if (partyAt * 1000 > Date.now()) {
    return `${maximumGuests - addedGuestsCount}/${maximumGuests} spots left.`;
  }

  if (Date.now() < checkInEndsAt * 1000) {
    return `Check-in open.`;
  }

  return `Check-in closed, ${checkedInGuestsCount}/${addedGuestsCount} guests checked in.`;
};

export default Join;

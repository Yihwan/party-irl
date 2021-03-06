import Link from 'next/link';
import { Text, Spacer, Container, Button } from '@nextui-org/react';

const Home = () => {
  return (
    <>
      <Text
        h1
        weight="normal"
        css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}
      >
        party<span style={{ fontWeight: 700 }}>IRL</span>
      </Text>
      <Text h4 weight="normal">
        Built on Solana, just for fun. 🎈
      </Text>

      <Spacer y={2} />

      <Container
        css={{
          padding: 0,
          display: 'flex'
        }}
      >
        <Link href="/join">
          <Button color="gradient" auto>
            join
          </Button>
        </Link>

        <Link href="/start">
          <Button light auto css={{ padding: 0, marginLeft: '1.5rem' }}>
            start
          </Button>
        </Link>
      </Container>

      <Spacer y={3} />

      <Text h3>How it (should) work:</Text>

      <ol style={{ maxWidth: '700px', marginLeft: '1rem' }}>
        <Text as="li" size={18}>
          <Link href="/join">Join</Link> or <Link href="/start">start</Link> a
          party.
        </Text>
        <Text as="li" size={18}>
          Stake some SOL to join a party.
        </Text>
        <Text as="li" size={18}>
          When party time rolls around, check-in.
        </Text>
        <Text as="li" size={18}>
          Settle to get your SOL back, plus any SOL from people who didn't
          check-in on time.
        </Text>
      </ol>

      <Spacer y={1} />

      <Text
        weight="normal"
        size={18}
        css={{ fontFamily: 'Space Mono', maxWidth: '700px' }}
      >
        I hacked this together over a few days, mostly at the Miami Hacker
        House. I had fun, learned a lot, and met some great people. While party
        <b>IRL</b> shouldn't be deployed to mainnet (the code's a mess), it made
        me realize chewing glass wasn't so bad after all.
      </Text>
    </>
  );
};

export default Home;

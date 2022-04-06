import Link from 'next/link';
import { Text, Spacer, Container, Button } from '@nextui-org/react';

const Home = () => {
  return (
    <>
      <Text h1 weight="normal">
        party<span style={{ fontWeight: 700 }}>IRL</span>
      </Text>
      <Text h4 weight="normal">
        Built on Solana, just for fun. 🎉
      </Text>

      <Spacer y={2} />

      <Container css={{
        padding: 0,
        display: 'flex'
      }}>
        <Link href="/join">
          <Button color="gradient" auto>
            join
          </Button>
        </Link>

        <Link href="/start">
          <Button light auto css={{ padding: 0, marginLeft: '1.5rem'}}>
            start
          </Button>
        </Link>
      </Container>

      <Spacer y={3} />

      <Text h3>How it (should) work:</Text>
      <Container>
        <ol>
          <li>Join or start a party.</li>
          <li>(If you start a party, you still have to "join" separately because blockchain stuff.)</li>
          <li>Stake some SOL to join a party.</li>
          <li>When party time rolls around, check-in.</li>
          <li>You get your SOL back, plus the SOL from no-shows.</li>
          <li>Pretty cool, huh?</li>
        </ol>
      </Container>
    </>
  );
};

export default Home;

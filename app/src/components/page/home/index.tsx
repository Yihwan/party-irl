import Link from 'next/link';
import { Text, Spacer } from '@nextui-org/react';

const Home = () => {

  return(
    <>
      <Text h1 css={{ fontWeight: 'unset'}}>party<span style={{ fontWeight: 700}}>IRL</span> 🎉</Text>
      <Text h4 css={{ fontWeight: 400 }}>Built on Solana, just for fun.</Text>

      <Spacer y={2} />

      <Link href="/join">join</Link>

      <Spacer y={1} />
      <Link href="/start">start</Link>
    </>
  );
}

export default Home;

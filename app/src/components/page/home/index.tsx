import { Container, Text } from '@nextui-org/react';

const Home = () => {

  return(
    <Container css={{
      padding: 0,
      display: 'flex',
      flexWrap: 'no-wrap',
      flexDirection: 'column',
      '@xs': {
        flexDirection: 'row',
      }
    }}>
      <Container>a</Container>
      <Container>
        <Text h1 css={{ fontWeight: 'unset'}}>party<span style={{ fontWeight: 700}}>IRL</span></Text>
        <Text css={{ fontWeight: 400 }}>Built on Solana, just for fun.</Text>
      </Container>
    </Container>
  );
}

export default Home;

import { Container } from '@nextui-org/react';

const Footer = () => {
  return (
    <footer style={{ padding: '1rem' }}>
      <Container css={{ padding: 0 }}>
        built by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/yihwan`}
        >
          yihwan
        </a>
        .
      </Container>
    </footer>
  );
};

export default Footer;

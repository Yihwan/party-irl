import { FC } from 'react';
import { Container } from '@nextui-org/react';
import Nav from './nav';
import Footer from './footer';

const Layout: FC = ({ children }) => {
  return(
    <div style={{
      minHeight: '100vh',
    }}>
      <Nav />

      <Container css={{ padding: '3rem 1rem', minHeight: 'calc(100vh - 112px)'}}>
        <main>
          {children}
        </main>
      </Container>


      <Footer />
    </div>
  )
}

export default Layout;

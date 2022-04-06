import { FC, useState, useEffect } from 'react';
import { Container } from '@nextui-org/react';

const Nav: FC = () => {
  const [scrollPosition, setScrollPosition] = useState(
    (typeof window !== 'undefined' && window.pageYOffset) || 0
  );

  const hasScrolled = scrollPosition > 0;

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => {
        setScrollPosition(window.pageYOffset);
      });
    };
    window.addEventListener('scroll', onScroll.bind(this));
    return () => {
      window.removeEventListener('scroll', onScroll.bind(this));
    };
  }, []);
  
  return (
    <nav 
      style={{ 
        fontSize: '18px',
        padding: '1rem 0', 
        height: '56px',
        position: 'sticky',
        top: 0, 
        left: 0,
        backdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: hasScrolled ? '1px solid' : 'none',

    }}>
      <Container>
        party<span style={{ fontWeight: 700 }}>IRL</span>
      </Container>
    </nav>
  );
};

export default Nav;

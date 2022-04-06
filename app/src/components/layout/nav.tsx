import { FC, useState, useEffect } from 'react';
import { Container } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Nav: FC = () => {
  // from nextjs-breadcrumbs
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(
    (typeof window !== 'undefined' && window.pageYOffset) || 0
  );
  console.log(breadcrumbs)
  const hasScrolled = scrollPosition > 0;

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => {
        setScrollPosition(window.pageYOffset);
      });
    };
    window.addEventListener('scroll', onScroll.bind(this));

    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: '/' + linkPath.slice(0, i + 1).join('/') };
      });

      setBreadcrumbs(pathArray);
    }
    return () => {
      window.removeEventListener('scroll', onScroll.bind(this));
    };
  }, [router]);
  
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
        <Link href="/">
          <a>
            party<span style={{ fontWeight: 700 }}>IRL</span>
          </a>
        </Link>

        {breadcrumbs && breadcrumbs.map(({ breadcrumb, href }, idx) => (
          <span>
            <span style={{ padding: '0 0.5rem'}}>
              /
            </span>
            <Link href={href} key={`${breadcrumb}-idx`}>
              <a style={{ fontWeight: idx === breadcrumbs.length - 1 ? 700 : 400}}>
                {breadcrumb.length > 20 ? `${breadcrumb.slice(0,4)}...${breadcrumb.slice(breadcrumb.length - 4, breadcrumb.length)}`: breadcrumb}
              </a>
            </Link>
          </span>
        ))}
      </Container>
    </nav>
  );
};

export default Nav;

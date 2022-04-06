import { FC, useState, useEffect } from 'react';
import { Container } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme as useNextTheme } from 'next-themes'
import { useTheme } from '@nextui-org/react'

const Nav: FC = () => {
  // from nextjs-breadcrumbs
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(
    (typeof window !== 'undefined' && window.pageYOffset) || 0
  );

  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

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
    <div
      style={{
        borderBottom: hasScrolled ? '1px solid' : 'none',
        position: 'sticky',
        top: 0, 
        left: 0,
      }}
    >
      <Container 
        as="nav"
        css={{ 
          fontSize: '18px',
          padding: '1rem',
          height: '56px',
          backgroundColor: '$background',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
      }}>
          <div>
            <Link href="/">
              <a>
                party<span style={{ fontWeight: 700 }}>IRL</span>
              </a>
            </Link>

            {breadcrumbs && breadcrumbs.map(({ breadcrumb, href }, idx) => (
              <span key={`${breadcrumb}-idx`}>
                {href !== '/' && (
                  <span style={{ padding: '0 0.5rem'}}>
                    /
                  </span>
                )}
                <Link href={href}>
                  <a style={{ fontWeight: idx === breadcrumbs.length - 1 ? 700 : 400}}>
                    {breadcrumb.length > 20 ? `${breadcrumb.slice(0,4)}...${breadcrumb.slice(breadcrumb.length - 4, breadcrumb.length)}`: breadcrumb}
                  </a>
                </Link>
              </span>
            ))}
          </div>

          <div>
            <button
              style={{
                fontSize: '24px',
                padding: 0,
                border: 0,
                backgroundColor: 'transparent',
                lineHeight: 1,
                cursor: 'pointer',
              }}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              ◑
            </button>
          </div>
      </Container>
    </div>
  );
};

export default Nav;

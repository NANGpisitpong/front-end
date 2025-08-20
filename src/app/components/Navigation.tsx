"use client";

  import Link from 'next/link';
  import { usePathname, useRouter } from 'next/navigation';
  import { useEffect, useMemo, useState } from 'react';
  import styles from './Navigation.module.css';
  import { mainNav, contactNav } from './navigation.config';

  export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

  // Theme (auto from OS)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // สำหรับ hydration fix
  const [mounted, setMounted] = useState(false);

    // Auth state from localStorage token
    const [token, setToken] = useState<string | null>(null);

    // Read token on mount and sync across tabs
    useEffect(() => {
      try {
        const t = localStorage.getItem('token');
        setToken(t);
      } catch {
        setToken(null);
      }

      const onStorage = (e: StorageEvent) => {
        if (e.key === 'token') {
          setToken(e.newValue);
        }
      };
      window.addEventListener('storage', onStorage);

      // theme & hydration fix
      setMounted(true);
      if (typeof window === 'undefined' || !window.matchMedia) return;
      const m = window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => setTheme(m.matches ? 'dark' : 'light');
      update();
      if ('addEventListener' in m) {
        m.addEventListener('change', update);
        return () => m.removeEventListener('change', update);
      } else if ('addListener' in m) {
        // Safari fallback
        // @ts-expect-error legacy API
        m.addListener(update);
        // @ts-expect-error legacy API
        return () => m.removeListener(update);
      }
    }, []);

    const handleSignOut = () => {
      try {
        localStorage.removeItem('token');
      } catch {
        // ignore
      }
      setToken(null);
      router.push('/login');
    };

    // Active route helper (memoized)
    const isActive = useMemo(() => {
      return (href: string) => (pathname === href || (pathname?.startsWith(href + '/') ?? false));
    }, [pathname]);

    // Hide navigation on specific routes (after all hooks to preserve hook order)
    if (pathname === '/login' || pathname === '/' || pathname === '/register') {
      return null;
    }

    // Hydration fix: render minimal nav ก่อน mount
    if (!mounted) {
      return (
        <nav className={["navbar","navbar-expand-lg","sticky-top",styles.offsetTop,styles.navGlass].filter(Boolean).join(' ')} data-theme="dark" lang="th" suppressHydrationWarning />
      );
    }

    // Link className compose
    const linkClass = (href: string) => {
      const base = ['nav-link', 'fw-bold', 'px-3', styles.navLink].filter(Boolean).join(' ');
      return isActive(href) ? [base, styles.navLinkActive].filter(Boolean).join(' ') : base;
    };

    return (
      <nav className={['navbar','navbar-expand-lg','sticky-top',styles.offsetTop,theme === 'dark' ? 'navbar-dark' : 'navbar-light',styles.navGlass].filter(Boolean).join(' ')} data-theme={theme} lang="th" suppressHydrationWarning>
        <div className="container-fluid position-relative">
          {/* โลโก้/แบรนด์ */}
          <Link className="navbar-brand d-flex align-items-center gap-2 m-0 position-absolute start-50 translate-middle-x" href="/">
            <img src="/images/GreenPip-logo.png" alt="Logo" width={60} height={45} />
            <span className={styles.brandText}>
              <span className={styles.brandGreen}>Green</span>
              <span className={styles.brandPip}>Pip</span>
            </span>
            <span className={styles.brandBadge}>BETA</span>
          </Link>
          {/* Hamburger toggler (mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          
          {/* เมนูกลาง (จะยุบในมือถือ) */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav d-flex align-items-lg-center gap-2 gap-lg-3 py-2 py-lg-0">
              {mainNav.map((item) => (
                <li className="nav-item" key={item.href}>
                  <Link className={linkClass(item.href)} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="nav-item dropdown">
                <a
                  className={['nav-link','dropdown-toggle','px-3','rounded',styles.navLink].filter(Boolean).join(' ')}
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  Contact
                </a>
                <ul className={['dropdown-menu', styles.dropdownMenu].filter(Boolean).join(' ')}>
                  {contactNav.map((c) => (
                    <li key={c.label}>
                        {c.external ? (
                          <a
                            className={['dropdown-item', styles.dropdownItem].filter(Boolean).join(' ')}
                            href={c.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {c.label}
                          </a>
                        ) : (
                          <Link
                            className={['dropdown-item', styles.dropdownItem].filter(Boolean).join(' ')}
                            href={c.href}
                          >
                            {c.label}
                          </Link>
                        )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            </div>

          {/* Action buttons (right) */}
          <div className="d-flex gap-2 ms-auto align-items-center">
            {token ? (
              <>
                <Link href="/admin/user" className={['btn','btn-sm','fw-bold','btn-outline-success',styles.btnGlow].filter(Boolean).join(' ')}>แดชบอร์ด</Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={['btn','btn-sm','fw-bold','btn-outline-danger',styles.btnGlow].filter(Boolean).join(' ')}
                >
                  <i className="bi bi-box-arrow-right" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={['btn','btn-sm','fw-bold','btn-outline-success',styles.btnGlow].filter(Boolean).join(' ')}>เข้าสู่ระบบ</Link>
                <Link href="/register" className={['btn','btn-success','btn-sm','fw-bold',styles.btnGlow].filter(Boolean).join(' ')}>สมัครสมาชิก</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
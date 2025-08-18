"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from './Navigation.module.css';
import { mainNav, contactNav } from './navigation.config';

export default function Navigation() {
  const pathname = usePathname();

  
  // Theme (auto from OS)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // ติดตามธีมจากระบบ (OS) อัตโนมัติ ไม่ต้องมีปุ่มสลับ
  useEffect(() => {
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

  // Active route helper (memoized)
  const isActive = useMemo(() => {
    return (href: string) => (pathname === href || (pathname?.startsWith(href + '/') ?? false));
  }, [pathname]);

  // Hide navigation on specific routes (after all hooks to preserve hook order)
  if (pathname === '/login' || pathname === '/' || pathname === '/register') {
    return null;
  }

  // Link className compose
  const linkClass = (href: string) => {
    const base = ['nav-link', 'fw-bold', 'px-3', styles.navLink].filter(Boolean).join(' ');
    return isActive(href) ? [base, styles.navLinkActive].filter(Boolean).join(' ') : base;
  };

  return (
    <nav className={['navbar','navbar-expand-lg','sticky-top',styles.offsetTop,theme === 'dark' ? 'navbar-dark' : 'navbar-light',styles.navGlass].filter(Boolean).join(' ')} data-theme={theme} lang="th">
      <div className="container-fluid">
        {/* โลโก้/แบรนด์ */}
        <Link className="navbar-brand d-flex align-items-center gap-2 m-0" href="/">
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
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
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

          {/* เส้นคั่นเมื่ออยู่ในมือถือ */}
          <div className={['d-lg-none','my-2',styles.mobileDivider].filter(Boolean).join(' ')} />

          {/* ปุ่มด้านขวา */}
          <div className="d-flex gap-2 ms-lg-auto align-items-center">
            <Link href="/admin/user" className={['btn','btn-sm','fw-bold','btn-outline-success',styles.btnGlow].filter(Boolean).join(' ')}>💀</Link>
            <Link href="/login" className={['btn','btn-sm','fw-bold','btn-outline-success',styles.btnGlow].filter(Boolean).join(' ')}>เข้าสู่ระบบ</Link>
            <Link href="/register" className={['btn','btn-success','btn-sm','fw-bold',styles.btnGlow].filter(Boolean).join(' ')}>สมัครสมาชิก</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
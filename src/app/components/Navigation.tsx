"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-light shadow" lang="th" style={{ borderBottom: '2px solid #22c55e' }}>

      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/*  กลาง: เมนูหลัก + โลโก้ */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {/* โลโก้ซ้ายสุด */}
            <li className="nav-item d-flex align-items-center mx-2">
              <Link className="navbar-brand d-flex align-items-center gap-2 text-light m-0" href="/">
                <img src="data:image/webp;base64,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" alt="Logo" width={60} height={45} />
                <span className="fw-bold">
                  <span style={{ color: '#22c55e' }}>Green</span>
                  <span style={{ color: '#facc15' }}>Pip</span>
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-bold px-3 border border-success rounded" href="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-bold px-3 border border-info rounded" href="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-bold px-3 border border-danger rounded" href="/service">Service</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-light px-3 border border-warning rounded"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                onClick={e => e.preventDefault()}
              >
                Contact
              </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link className="dropdown-item" href="https://www.facebook.com/">Facebook</Link></li>
                <li><Link className="dropdown-item" href="https://www.line.me/en/">Line</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="d-flex gap-2">
          <Link href="/login" className="btn btn-outline-light btn-sm fw-bold border-success">เข้าสู่ระบบ</Link>
          <Link href="/register" className="btn btn-success btn-sm fw-bold">สมัครสมาชิก</Link>
        </div>
      </div>
    </nav>
  );
}
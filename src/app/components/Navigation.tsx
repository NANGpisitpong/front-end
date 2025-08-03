"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function Navigation() {
  const pathname = usePathname();
  if (pathname === '/login'  || pathname === '/' || pathname === '/register' ) return null; 

  
  return (
    <nav className="navbar navbar-expand-lg bg-dark text-light shadow" lang="th" style={{ borderBottom: '2px solid #22c55e' }}>

      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/*  กลาง: เมนูหลัก + โลโก้ */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {/* โลโก้ซ้ายสุด */}
            <li className="nav-item d-flex align-items-center mx-2">
              <Link className="navbar-brand d-flex align-items-center gap-2 text-light m-0" href="/">
                <img src="/images/GreenPip-logo.png" alt="Logo" width={60} height={45} />
                <span className="fw-bold">
                  <span style={{ color: '#22c55e' }}>Green</span>
                  <span style={{ color: '#facc15' }}>Pip</span>
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light fw-bold px-3 border border-success rounded" href="/Home">Home</Link>
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
            >
              Contact
                      </a>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li>
                    <Link href="https://www.facebook.com/" className="dropdown-item" target="_blank">
                  Facebook
              </Link>
                </li>
              <li>
                    <Link href="https://www.line.me/en/" className="dropdown-item" target="_blank">
                  Line
              </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* 🔸 ขวาสุด: ปุ่มเข้าสู่ระบบ / สมัคร */}
        <div className="d-flex gap-2">
          <Link href="/login" className="btn btn-outline-light btn-sm fw-bold border-success">เข้าสู่ระบบ</Link>
          <Link href="/register" className="btn btn-success btn-sm fw-bold">สมัครสมาชิก</Link>
        </div>
      </div>
    </nav>
  );
}

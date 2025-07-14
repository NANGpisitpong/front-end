'use client';

import Link from 'next/link';

const Navigation = () => {
  return (
    <nav style={{ padding: '1rem', background: '#f8f9fa' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', margin: 0 }}>
        <li>
          <Link href="/">หน้าหลัก</Link>
        </li>
        <li>
          <Link href="/login">เข้าสู่ระบบ</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
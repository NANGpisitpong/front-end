import Link from 'next/link';

export default function Navigation() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
       <center> <li><Link href="/">หน้าแรก</Link></li></center>
       <center> <li><Link href="/about">เกี่ยวกับ</Link></li></center>
       <center> <li><Link href="/service">บริการ</Link></li></center>
       <center> <li><Link href="/contect">ติดต่อ</Link></li></center>
     </ul>
    </nav>
  );
}
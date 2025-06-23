import Link from 'next/link';

export default function Navigation() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        <li><h2><Link href="/">หน้าแรก(1)</Link></h2></li>
        <li><h3><Link href="/about">เกี่ยวกับ(2)</Link></h3></li>
        <li><h4><Link href="/service">บริการ(3)</Link></h4></li>
        <li><h5><Link href="/contect">ติดต่อ(4)</Link></h5></li>
     </ul>
    </nav>
    
  );
}
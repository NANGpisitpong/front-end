'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import './user.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Data model from backend
type UserItem = {
  id: string | number;
  firstname?: string; // given name
  fullname?: string;  // may contain prefix + first + last
  lastname?: string;
  username?: string;
  password?: string;
  address?: string;
  sex?: 'male' | 'female' | 'other' | string;
  gender?: 'male' | 'female' | 'other' | string;
  birthday?: string; // YYYY-MM-DD
  birthdate?: string; // fallback
};

const HONORIFICS = ['นาย', 'นาง', 'นางสาว'] as const;

function getPrefixFromFullname(fullname?: string): string {
  if (!fullname) return '';
  const found = HONORIFICS.find(h => fullname.startsWith(h));
  return found || '';
}

function formatGender(v?: string): string {
  const g = (v || '').toLowerCase();
  if (g === 'male') return 'ชาย';
  if (g === 'female') return 'หญิง';
  if (g === 'other') return 'อื่นๆ';
  return v || '-';
}

function formatDate(iso?: string): string {
  const val = iso || '';
  if (!val) return '-';
  const parts = val.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`; // DD/MM/YYYY
  }
  const dt = new Date(val);
  if (!isNaN(dt.getTime())) {
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yy = String(dt.getFullYear());
    return `${dd}/${mm}/${yy}`;
  }
  return val;
}

export default function Page() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    async function getUsers() {
      try {
        const res = await fetch('https://backend-nextjs-virid.vercel.app/api/users');
        if (!res.ok) {
          console.error('Failed to fetch data');
          if (isMounted) setLoading(false);
          return;
        }
        const data: UserItem[] = await res.json();
        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) setLoading(false);
      }
    }

    getUsers();
    const interval = setInterval(getUsers, 3000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [router]);

  // Enrich each row to match register semantics
  const enriched = useMemo(() => {
    return items.map(u => {
      const prefix = getPrefixFromFullname(u.fullname);
      const given = u.firstname || '';
      const last = u.lastname || '';
      const full = u.fullname || [prefix, given, last].filter(Boolean).join(' ');
      const gender = formatGender(u.sex || u.gender);
      const bday = formatDate(u.birthday || u.birthdate);
      return { ...u, prefix, given, last, full, gender, bday };
    });
  }, [items]);

  const handleDelete = async (u: UserItem & { full?: string }) => {
    const name = u.full || [getPrefixFromFullname(u.fullname), u.firstname, u.lastname].filter(Boolean).join(' ') || u.username || String(u.id);
    const confirm = await Swal.fire({
      title: 'ยืนยันการลบ',
      html: `ต้องการลบสมาชิก <b>${name}</b> ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
    });
    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(u.id);
      const res = await fetch('https://backend-nextjs-virid.vercel.app/api/users', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: u.id }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok) {
        setItems(prev => prev.filter(it => it.id !== u.id));
        Swal.fire({ icon: 'success', title: 'ลบสำเร็จ', text: `ลบ ${name} เรียบร้อย`, timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'ลบไม่สำเร็จ', text: (result as any)?.message || 'เกิดข้อผิดพลาดในการลบ' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'ข้อผิดพลาดเครือข่าย', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center"><h1>Loading...</h1></div>;
  }

  return (
    <div className="user-wrapper">
      <div className="user-card">
        <div className="user-header">
          <h2>📋 รายชื่อสมาชิก</h2>
          <p className="subtitle">ข้อมูลจัดรูปแบบให้สอดคล้องกับหน้าสมัครสมาชิก</p>
          <Link href="/register" className="btn-add">➕ เพิ่มสมาชิก</Link>
        </div>

        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ(จริง)</th>
                <th>นามสกุล(จริง)</th>
                <th>ชื่อเต็ม</th>
                <th>Username</th>
                <th>รหัสผ่าน</th>
                <th>ที่อยู่</th>
                <th>เพศ</th>
                <th>วันเกิด</th>
                <th>แก้ไข</th>
                <th>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {enriched.length > 0 ? (
                enriched.map((u, index) => (
                  <tr key={u.id}>
                    <td>{index + 1}</td>
                    <td>{u.prefix || '-'}</td>
                    <td>{u.given || '-'}</td>
                    <td>{u.last || '-'}</td>
                    <td>{u.full || '-'}</td>
                    <td>{u.username || '-'}</td>
                    <td>{'*'.repeat(u.password?.length || 0)}</td>
                    <td>{u.address || '-'}</td>
                    <td>{u.gender}</td>
                    <td>{u.bday}</td>
                    <td><Link href={`/admin/user/edit/${u.id}`} className="btn-warning">แก้ไข</Link></td>
                    <td><button className="btn-danger" onClick={() => handleDelete(u)} disabled={deletingId === u.id}>{deletingId === u.id ? 'กำลังลบ...' : 'ลบ'}</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

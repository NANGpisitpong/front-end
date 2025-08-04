'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './user.css';

export default function Page() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const res = await fetch('http://itdev.cmtc.ac.th:3000/api/users');
        if (!res.ok) return console.error('Failed to fetch data');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getUsers();
    const interval = setInterval(getUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-wrapper">
      <div className="user-card">
        <div className="user-header">
          <h2>📋 รายชื่อสมาชิก</h2>
          <p className="subtitle">แสดงข้อมูลที่ลงทะเบียนทั้งหมด</p>
          <Link href="/register" className="btn-add">➕ เพิ่มสมาชิก</Link>
        </div>

        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อ</th>
                <th>ชื่อเต็ม</th>
                <th>นามสกุล</th>
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
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.firstname}</td>
                    <td>{item.fullname}</td>
                    <td>{item.lastname}</td>
                    <td>{item.username}</td>
                    <td>{'*'.repeat(item.password?.length || 0)}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.sex === 'male' ? 'ชาย' : item.sex === 'female' ? 'หญิง' : 'อื่นๆ'}
                    </td>
                    <td>{item.birthday}</td>
                    <td><button className="btn-warning">แก้ไข</button></td>
                    <td><button className="btn-danger">ลบ</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

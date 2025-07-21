'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // **App Router ไม่มี events เหมือน pages router**
import Loading from '../components/load'; // **สร้างคอมโพเนนต์ Loading เอง**

export default function RouteChangeHandler() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Next.js App Router ไม่มี event listener แบบ pages router
    // แต่เราสามารถใช้ trick โดยใช้ useRouter().push และ track loading state

    // หรือใช้งาน useTransition แทน

    // ตัวอย่างง่ายๆ ใช้ useTransition (React 18) ดัก transition pending
  }, []);

  return loading ? <Loading /> : null;
}

'use client';

import { ReactNode, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import Loading from '../components/load'; // **สร้างคอมโพเนนต์ Loading เอง**

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  const [isPending, startTransition] = useTransition();

  return (
    <>
      {!hideLayout && <Navigation />}

      {/* แสดง spinner ตอน transition กำลังโหลด */}
      {isPending && <Loading />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}

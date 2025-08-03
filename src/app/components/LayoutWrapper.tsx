'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay'; // 

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsLoading(true);
      setCurrentPath(pathname);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // ปรับเวลาตามความต้องการ

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      {!hideLayout && <Navigation />}
      <div style={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.3s' }}>
        {children}
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}

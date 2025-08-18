'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay'; // 
import './LayoutWrapper.css'; 

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  const [isLoading, setIsLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Smooth route change effect (fade/slide + overlay)
  useEffect(() => {
    // Trigger overlay + slight dim
    setIsLoading(true);

    // Start enter animation key update to re-trigger CSS animation
    setAnimKey((k) => k + 1);

    const t = setTimeout(() => {
      // Hide overlay after short delay (let page mount/paint)
      setIsLoading(false);
    }, 450); // duration should align with CSS
    return () => clearTimeout(t);
  }, [pathname]);
  return (
    <>
      {/* Optional existing overlay, kept for compatibility */}
      {isLoading && <LoadingOverlay />}

      {/* New gradient overlay for smoother transitions */}
      <div className={["route-overlay", isLoading ? 'visible' : ''].join(' ')} aria-hidden="true" />

      {!hideLayout && <Navigation />}

      <div
        key={animKey}
        className={['route-container','route-animate-in'].join(' ')}
        style={{ opacity: isLoading ? 0.6 : 1 }}
      >
        {children}
      </div>

      {!hideLayout && !pathname.startsWith('/admin/user/edit') && <Footer />}
    </>
  );
}

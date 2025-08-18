'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay'; // 
import './LayoutWrapper.css'; 

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/register';

  const [isLoading, setIsLoading] = useState(false);
  const [exitNode, setExitNode] = useState<React.ReactNode | null>(null);
  const lastChildrenRef = useRef<React.ReactNode>(children);

  // keep reference of last rendered children for exit animation snapshot
  useEffect(() => {
    lastChildrenRef.current = children;
  }, [children]);

  // Smooth route change effect (stacked exit/enter + overlay)
  useEffect(() => {
    // mount snapshot of previous content in exit layer
    setExitNode(lastChildrenRef.current);
    // show overlay for a short moment
    setIsLoading(true);

    const timer = setTimeout(() => {
      setExitNode(null); // remove exit layer after animation
      setIsLoading(false); // hide overlay
    }, 480); // keep in sync with CSS durations (~0.42s)

    return () => clearTimeout(timer);
  }, [pathname]);
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className={["route-overlay", isLoading ? 'visible' : ''].join(' ')} aria-hidden="true" />
      {!hideLayout && <Navigation />}
      <div className="route-stack">
        {exitNode && (
          <div className="route-layer route-exit">
            {exitNode}
          </div>
        )}
        <div className="route-layer route-enter">
          {children}
        </div>
      </div>
      {!hideLayout && !pathname.startsWith('/admin/user/edit') && <Footer />}
    </>
  );
}

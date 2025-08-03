'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './welcome.css';

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
      setShowWelcome(true);
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const hintTimeout = setTimeout(() => {
        setShowHint(true);
      }, 1500);

      return () => clearTimeout(hintTimeout);
    }
  }, [showWelcome]);

  // canvas effect: กราฟเส้นแสงเคลื่อนไหว
  useEffect(() => {
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // กราฟเส้นแสงแบบง่าย
    const lines = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 30 + Math.random() * 70,
      speed: 0.3 + Math.random(),
      alpha: 0.1 + Math.random() * 0.5,
    }));

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00ff00';

      lines.forEach(line => {
        ctx.beginPath();
        ctx.globalAlpha = line.alpha;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y - line.len);
        ctx.stroke();

        line.y -= line.speed;
        if (line.y + line.len < 0) line.y = window.innerHeight + line.len;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleClick = () => {
    if (!loading) router.push('/Home');
  };

  return (
    <div className="welcome-container" onClick={handleClick}>
      <canvas id="bgCanvas" className="background-canvas"></canvas>

      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <div className={`welcome-content ${showWelcome ? 'fade-zoom-in' : ''}`}>
          <h1>W E L C O M E</h1>
          {showHint && <p className="hint-text">กดที่ใดก็ได้เพื่อเข้าสู่ระบบ</p>}
        </div>
      )}
    </div>
  );
}

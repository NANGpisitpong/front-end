'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './welcome.css';

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [displayText, setDisplayText] = useState('');
  const fullText = 'WELCOME';

  // Loading 2 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowWelcome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Hint ขึ้นหลัง Welcome 1.5 วินาที
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Canvas เส้นแสงเหมือนเดิม
  useEffect(() => {
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

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

  // อัปเดตเวลาแบบเรียลไทม์
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hacker text effect + typewriter + sound effect
  useEffect(() => {
    if (!loading && showWelcome) {
      const chars = '!@#$%^&*()-_=+[]{}<>?/|\\';
      let iterations = 0;
      let intervalId: any = null;

      // เสียงพิมพ์ดีด
      const audio = new Audio('/type.mp3');
      audio.volume = 0.1;

      const scramble = () => {
        if (iterations >= fullText.length) {
          clearInterval(intervalId);
          // พิมพ์ทีละตัวพร้อมเสียง
          typeWriterEffect();
          return;
        }
        let scrambled = '';
        for (let i = 0; i < fullText.length; i++) {
          if (i < iterations) scrambled += fullText[i];
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplayText(scrambled);
        iterations += 1 / 3;
      };

      const typeWriterEffect = () => {
        let idx = 0;
        let textToShow = '';
        const typeInterval = setInterval(() => {
          if (idx >= fullText.length) {
            clearInterval(typeInterval);
            return;
          }
          textToShow += fullText[idx];
          setDisplayText(textToShow);
          audio.currentTime = 0;
          audio.play().catch(() => {}); // เล่นเสียงพิมพ์ดีด
          idx++;
        }, 150);
      };

      intervalId = setInterval(scramble, 50);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [loading, showWelcome]);

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
          <h1 className="animated-text">{displayText}</h1>
          {showHint && <p className="hint-text">กดที่ใดก็ได้เพื่อเข้าสู่ระบบ</p>}
          <p className="neon-clock">{timeString}</p>
        </div>
      )}
    </div>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './welcome.css';

export default function WelcomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [showExtra, setShowExtra] = useState(false);

  const baseText = "WELCOME";
  const chars = '!@#$%^&*()-_=+[]{}<>?/|\\';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowWelcome(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowHint(true), 1800);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  if (!loading && showWelcome) {
    let scrambleInterval: NodeJS.Timeout;
    let typeInterval: NodeJS.Timeout;

    const startLoop = () => {
      setShowExtra(false);
      let iterations = 0;

      scrambleInterval = setInterval(() => {
        if (iterations >= baseText.length) {
          clearInterval(scrambleInterval);
          startTypeEffect();
          return;
        }
        let scrambled = '';
        for (let i = 0; i < baseText.length; i++) {
          if (i < iterations) scrambled += baseText[i];
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplayText(scrambled);
        iterations += 0.3;
      }, 35);
    };

    const startTypeEffect = () => {
      let idx = 0;
      let textToShow = '';
      typeInterval = setInterval(() => {
        if (idx >= baseText.length) {
          clearInterval(typeInterval);
          setShowExtra(true);
          // ลบ triggerParticles(); ออก
          return;
        }
        textToShow += baseText[idx];
        setDisplayText(textToShow);
        idx++;
      }, 90);
    };

    startLoop();

    const loopInterval = setInterval(() => {
      startLoop();
    }, 12000);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(typeInterval);
      clearInterval(loopInterval);
    };
  }
}, [loading, showWelcome]);


  useEffect(() => {
    const canvas = document.getElementById('bgCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix rain parameters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'.split('');
    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    const laserCount = 12;
    const glowRadius = 180;

    const draw = () => {
      if (!ctx) return;

      // Radial glow background
      const grd = ctx.createRadialGradient(canvas.width/2, canvas.height/3, glowRadius/4, canvas.width/2, canvas.height/3, glowRadius);
      grd.addColorStop(0, 'rgba(34,255,136,0.5)');
      grd.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix rain
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      });

      // Laser beams with glowing gradient
      ctx.lineWidth = 2;
      for(let i=0; i<laserCount; i++) {
        const time = Date.now() / 1000;
        const y = (time * 200 + i * 140) % canvas.height;

        const grad = ctx.createLinearGradient(0, y, canvas.width, y - 120);
        grad.addColorStop(0, 'rgba(34,255,136,0)');
        grad.addColorStop(0.5, 'rgba(34,255,136,0.3)');
        grad.addColorStop(1, 'rgba(34,255,136,0)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y - 120);
        ctx.shadowColor = '#22ff88';
        ctx.shadowBlur = 20;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const floatingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = floatingRef.current;
    if (!el) return;

    let frameId: number | null = null;
    let t = 0;
    let alive = true;

    const animate = () => {
      if (!alive) return;
      t += 0.025;
      const floatY = Math.sin(t) * 10;
      const rotateX = Math.sin(t * 0.7) * 7;
      const rotateZ = Math.sin(t * 1.3) * 5;
      el.style.transform = `translateY(${floatY}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      alive = false;
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [showWelcome]);

  const handleClick = () => {
    if (!loading) router.push('/Home');
  };

  return (
    <div className="welcome-container" onClick={handleClick} role="button" tabIndex={0}>
      <canvas id="bgCanvas" className="background-canvas"></canvas>

      {loading && (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {!loading && (
        <div className={`welcome-content ${showWelcome ? 'fade-zoom-in' : ''}`} ref={floatingRef}>
          <h1 className="animated-text glitch" data-text={displayText}>
            {displayText}
            <span aria-hidden="true" className="glitch-layer glitch-layer1">{displayText}</span>
            <span aria-hidden="true" className="glitch-layer glitch-layer2">{displayText}</span>
            <span aria-hidden="true" className="glitch-layer glitch-layer3">{displayText}</span>
          </h1>

          {showExtra && (
            <h2 className="extra-text neon-text glitch-rgb-floating">
              <span style={{ color: '#22c55e' }}>Green</span>
              <span style={{ color: '#facc15', marginLeft: '14px' }}>Pip</span>
            </h2>
          )}

          {showHint && <p className="hint-text blinking">กดที่ใดก็ได้เพื่อเข้าสู่ระบบ</p>}

          <p className="neon-clock">{timeString}</p>
        </div>
      )}
    </div>
  );
}

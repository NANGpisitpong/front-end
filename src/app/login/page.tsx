"use client";
import React, { useRef, useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import './login.css';

type Particle = {
  x: number;
  y: number;
  element: HTMLDivElement;
};

const ParticleFollowMouse: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);

  const NUM_PARTICLES = 20;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // สร้าง element
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const el = document.createElement('div');
      el.className = 'particle';
      el.style.position = 'absolute';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.borderRadius = '50%';
      el.style.background = `hsl(${(i * 30) % 360}, 100%, 60%)`;
      el.style.pointerEvents = 'none';
      container.appendChild(el);
      particles.current.push({ x: window.innerWidth / 2, y: window.innerHeight / 2, element: el });
    }

    // เม้าส์เคลื่อนที่
    const onMouseMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // อนิเมชัน
    const animate = () => {
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles.current[i];
        const targetX = i === 0 ? pointer.current.x : particles.current[i - 1].x;
        const targetY = i === 0 ? pointer.current.y : particles.current[i - 1].y;

        // คำนวณองศา
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const angle = Math.atan2(dy, dx);

        // เคลื่อนที่แบบมีหน่วง
        p.x += Math.cos(angle) * 5;
        p.y += Math.sin(angle) * 5;

        // วางตำแหน่ง
        p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      particles.current.forEach(p => p.element.remove());
      particles.current = [];
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />;
};

const Login: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [bgColor, setBgColor] = useState('#121212');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== 'test@example.com' || password !== '123456') {
      setError('❌ไม่พบบัญชีนี้ กรุณาตรวจสอบข้อมูลอีกครั้ง');
      return;
    }
    setError('');
    console.log({ email, password, remember });
  };

  const handleChangeBackground = () => {
    const colors = ['#121212', '#1e1e1e', '#002200', '#003300', '#001122'];
    const next = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(next);
  };

  return (
    <>
      {/* แสดง Particle animation */}
      <ParticleFollowMouse />

      {pathname === '/login' && (
        <Link href="/" className="back-button" aria-label="ย้อนกลับ">
          <span>{'←'}</span>
          <span>ย้อนกลับ</span>
        </Link>
      )}

      <div className="login-wrapper" style={{ backgroundColor: bgColor }}>
        <div className="login-container">
          <div className="login-box">
            <div className="logo">🚀Let's go right now🚀</div>
            <h2>
              Welcome to <span style={{ color: '#22c55e' }}>Green</span>
              <span style={{ color: '#facc15' }}>Pip</span>🤗
            </h2>

            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}

              <label htmlFor="email">Account👤</label>
              <input
                type="email"
                id="email"
                placeholder="Username or Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password">Password🔑</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="form-row">
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember for 30 days
                </label>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot password
                </Link>
              </div>

              <button type="submit" className="btn-primary">Sign in</button>
              <button type="button" className="btn-google">
                <FaGoogle />
                Sign in with Google
              </button>
            </form>

            <p className="footer">
              Don’t have an account? <Link href="/register">Sign up</Link>
            </p>
          </div>

          <div className="login-image-container">
            <img
              src="/images/Patterns.png"
              alt="Forex Graph Pattern"
              className="login-image"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* ปุ่มแก้เบื่ออยู่มุมขวาล่าง */}
      <button className="change-bg-btn-fixed" onClick={handleChangeBackground}>
        🎨 ปุ่มแก้เบื่อ
      </button>
    </>
  );
};

export default Login;

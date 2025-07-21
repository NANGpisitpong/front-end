"use client";
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import './login.css';
import { FaGoogle } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

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
            <h2>Welcome to <span style={{ color: '#22c55e' }}>Green</span>
                           <span style={{ color: '#facc15' }}>Pip</span>🤗</h2>

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
'use client';
import React, { useState, FormEvent } from 'react';
import './login.css';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [bgColor, setBgColor] = useState('#f9f9fc');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ตัวอย่างเช็คอีเมล/รหัสผ่าน (สมมุติ)
    if (email !== 'test@example.com' || password !== '123456') {
      setError('❌ไม่พบบัญชีนี้ กรุณาตรวจสอบข้อมูลอีกครั้ง');
      return; 
    }
    setError('');
    console.log({ email, password, remember });
  };

  const handleChangeBackground = () => {
    // เปลี่ยนสีพื้นหลังแบบสุ่ม
    const colors = ['#f9f9fc', '#f0eaff', '#e1f5fe', '#fff3e0', '#fce4ec'];
    const next = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(next);
  };

  return (
    <div className="login-wrapper" style={{ backgroundColor: bgColor }}>
      <div className="login-split-container">
        {/* Left: Form */}
        <div className="login-left">
          <div className="logo text-center text-size:200%">🚀Let's go right now🚀</div>
          <h2 className="text-center">Welcome🤗</h2>
  

          <form onSubmit={handleSubmit}>
            {/* แสดง error ถ้ามี */}
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <label htmlFor="exampleFormControlInput1">Account👤</label>
            <input
              type="email"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Username or Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="exampleFormControlInput2">Password🔑</label>
            <input
              type="password"
              className="form-control"
              id="exampleFormControlInput2"
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
              <a href="/forgot-password">Forgot password</a>
            </div>

            <button type="submit" className="btn-primary">Sign in</button>

            <button className="btn-google" type="button">
              <FaGoogle style={{ marginRight: '8px' }} />
              Sign in with Google
            </button>

           <p className="footer">
                 Don’t have an account? <Link href="/register">Sign up</Link>
            </p>
          </form>
        </div>

        {/* Right: Image */}
        <div className="login-right">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/customer-support-4488870-3733167.png"
            alt="Illustration"
          />
        </div>
      </div>

      {/* ปุ่มเปลี่ยนสีพื้นหลัง */}
      <button className="change-bg-btn" onClick={handleChangeBackground}>
        🎨 ปุ่มแก้เบื่อ
      </button>
    </div>
  );
};

export default Login;

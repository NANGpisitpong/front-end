"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import './res.css';

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    prefix: '',
    firstName: '',
    lastName: '',
    address: '',
    gender: '',
    birthdate: '',
    acceptedTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert('กรุณายอมรับเงื่อนไขก่อนสมัครสมาชิก');
      return;
    }
    console.log(formData);
    router.push('/login');
  };

  // ⚡ เอฟเฟกต์พาร์ติเคิลพื้นหลัง
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'bg-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: { x: number, y: number, radius: number }[] = [];
    const total = 30;
    const mouse = { x: W / 2, y: H / 2 };

    for (let i = 0; i < total; i++) {
      particles.push({
        x: mouse.x,
        y: mouse.y,
        radius: Math.random() * 3 + 2
      });
    }

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animate() {
      ctx.fillStyle = 'rgba(18,18,18,0.2)';
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < total; i++) {
        const p = particles[i];
        const target = i === 0 ? mouse : particles[i - 1];
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * 6;
        p.y += Math.sin(angle) * 6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${i * 12}, 100%, 70%)`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-header">
          <a href="/login" className="back-btn">◀ กลับเข้าสู่ระบบ</a>
          <h2>ลงทะเบียนสมาชิก</h2>
          <p className="subtitle">สมัครใช้งานเพื่อเข้าสู่ระบบเทรด Forex/หุ้น อย่างมีสไตล์</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* บัญชีผู้ใช้ */}
          <div className="form-section">
            <h3>บัญชีผู้ใช้🤵📊</h3>
            <label>ชื่อผู้ใช้ หรือ อีเมลล์</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />

            <label>รหัสผ่าน</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>รหัสผ่าน(ยื่นยันอีกรอบ)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {/* ข้อมูลส่วนตัว */}
          <div className="form-section">
            <h3>ข้อมูลส่วนตัว📝</h3>
            <label>คำนำหน้าชื่อ</label>
            <select name="prefix" value={formData.prefix} onChange={handleChange} required>
              <option value="">-- เลือก --</option>
              <option value="mr">นาย</option>
              <option value="mrs">นาง</option>
              <option value="miss">นางสาว</option>
            </select>

            <label>ชื่อ</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

            <label>นามสกุล</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

            <label>วันเกิด</label>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />

            <label>เพศ</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
                ชาย
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                หญิง
              </label>
              <label>
                <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
                อื่นๆ
              </label>
            </div>

            <label>ที่อยู่</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows={3} required className="address-textarea" />
          </div>

          <div className="checkbox-inline">
            <input type="checkbox" id="acceptedTerms" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleChange} required />
            <label htmlFor="acceptedTerms">ฉันยอมรับเงื่อนไขการใช้งาน</label>
          </div>

          <button type="submit" className="btn-register">ลงทะเบียน</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

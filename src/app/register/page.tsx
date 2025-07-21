"use client";
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './res.css';

type Particle = {
  x: number;
  y: number;
  element: HTMLDivElement;
};

const ParticleFollowMouse: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particles = useRef<Particle[]>([]);

  const NUM_PARTICLES = 20;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      particles.current.push({ x: pointer.current.x, y: pointer.current.y, element: el });
    }

    const onMouseMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles.current[i];
        const targetX = i === 0 ? pointer.current.x : particles.current[i - 1].x;
        const targetY = i === 0 ? pointer.current.y : particles.current[i - 1].y;

        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const angle = Math.atan2(dy, dx);

        p.x += Math.cos(angle) * 5;
        p.y += Math.sin(angle) * 5;

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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

const Register: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    prefix: '',
    firstName: '',
    lastName: '',
    address: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    acceptedTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
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
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    // คุณสามารถส่งข้อมูล formData ไป backend ได้ที่นี่
    console.log('สมัครสมาชิกเรียบร้อย:', formData);
    router.push('/login');
  };

  return (
    <>
      <ParticleFollowMouse />

      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <a href="/login" className="back-btn">◀ กลับเข้าสู่ระบบ</a>
            <h2>ลงทะเบียนสมาชิก</h2>
            <p className="subtitle">สมัครใช้งานเพื่อเข้าสู่ระบบเทรด Forex/หุ้น อย่างมีสไตล์</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-section">
              <h3>บัญชีผู้ใช้🤵📊</h3>
              <label>ชื่อผู้ใช้ หรือ อีเมลล์</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="ชื่อผู้ใช้ หรือ อีเมลล์"
              />

              <label>รหัสผ่าน</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="รหัสผ่าน"
              />

              <label>รหัสผ่าน (ยืนยันอีกรอบ)</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="ยืนยันรหัสผ่าน"
              />
            </div>

            <div className="form-section">
              <h3>ข้อมูลส่วนตัว📝</h3>

              <label>คำนำหน้าชื่อ</label>
              <select
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                required
              >
                <option value="">-- เลือก --</option>
                <option value="mr">นาย</option>
                <option value="mrs">นาง</option>
                <option value="miss">นางสาว</option>
              </select>

              <label>ชื่อ(จริง)</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="ชื่อ"
              />

              <label>นามสกุล(จริง)</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="นามสกุล"
              />

              <label>วันเกิด</label>
              <div className="birthdate-select">
                <select
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  required
                >
                  <option value="">วัน</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>

                <select
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  required
                >
                  <option value="">เดือน</option>
                  {[
                    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
                  ].map((month, i) => (
                    <option key={i + 1} value={i + 1}>{month}</option>
                  ))}
                </select>

                <select
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  required
                >
                  <option value="">ปี</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>

              <label>เพศ👩🧑</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    required
                  />
                  ชาย
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  />
                  หญิง
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                  />
                  อื่นๆ
                </label>
              </div>

              <label>ที่อยู่</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="address-textarea"
                placeholder="ที่อยู่บ้านเลขที่"
              />
            </div>

            <div className="checkbox-inline">
              <input
                type="checkbox"
                id="acceptedTerms"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="acceptedTerms">ฉันยอมรับเงื่อนไขการใช้งาน</label>
            </div>

            <button type="submit" className="btn-register">ลงทะเบียน</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

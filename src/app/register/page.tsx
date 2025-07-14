"use client";
import React, { useState, FormEvent } from 'react';
import './res.css';

const Register: React.FC = () => {
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
    alert('ลงทะเบียนเรียบร้อย!');
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-header">
          <a href="/login" className="back-btn">◀ กลับเข้าสู่ระบบ</a>
          <h2 className="text-center">ลงทะเบียน</h2>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <label>ชื่อผู้ใช้</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>คำนำหน้าชื่อ</label>
          <select name="prefix" value={formData.prefix} onChange={handleChange} required>
            <option value="">-- เลือก --</option>
            <option value="mr">นาย</option>
            <option value="mrs">นาง</option>
            <option value="miss">นางสาว</option>
          </select>

          <label>ชื่อ</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label>นามสกุล</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <label>ที่อยู่</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            required
          ></textarea>

          <label>เพศ</label>
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
              อื่น ๆ
            </label>
          </div>

          <label>วันเกิด</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                required
              />
              ฉันยอมรับเงื่อนไขการใช้งาน
            </label>
          </div>

          <button type="submit" className="btn-register">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

'use client';

import { useEffect } from 'react';
import './about.css';
import { animateCounters, initParticles } from './about.js';

export default function About() {
  useEffect(() => {
    animateCounters();
    initParticles();
  }, []);

  return (
    <section className="about-container">
      <canvas id="particle-canvas"></canvas>

      <div className="about-card">
        {/* Hero Image */}
        <div className="hero-image">
          <img src="/images/GreenPip-logo.png" alt="GreenPip Hero" />
        </div>

        <h1 className="brand-title">
          Green<span className="pip">Pip</span>
        </h1>
        <p className="brand-description">
          GreenPip คือแพลตฟอร์มสำหรับนักเทรดที่เน้นความเข้าใจตลาดหุ้นด้วยดีไซน์ทันสมัย
          ผสมผสานสีเขียวเพื่อสัญลักษณ์ของการเติบโต และสีเหลืองเพื่อความโดดเด่น
        </p>

        <p className="brand-description">
          เราเชื่อว่าข้อมูลคือพลัง ทุกฟีเจอร์ของ GreenPip ถูกออกแบบให้คุณเข้าถึงสถิติ
          และเครื่องมือวิเคราะห์หุ้นได้ง่ายและเร็วที่สุด เหมาะกับนักลงทุนทุกระดับ
        </p>

        <div className="stats">
          <div className="stat">
            <span className="counter" data-target="1200">0</span>
            <p>ผู้ใช้งาน</p>
          </div>
          <div className="stat">
            <span className="counter" data-target="350">0</span>
            <p>หุ้นติดตาม</p>
          </div>
          <div className="stat">
            <span className="counter" data-target="85">0</span>
            <p>เครื่องมือวิเคราะห์</p>
          </div>
          <div className="stat">
            <span className="counter" data-target="15">0</span>
            <p>ตลาดใหม่</p>
          </div>
          <div className="stat">
            <span className="counter" data-target="50">0</span>
            <p>บทความวิเคราะห์</p>
          </div>
        </div>

        <div className="features">
          <h2>ฟีเจอร์เด่นของ GreenPip</h2>
          <ul>
            <li>
              <img src="/images/icons/icon01.jpg" alt="chart" className="feature-icon" />
              แผนภูมิหุ้นเรียลไทม์พร้อมสัญญาณซื้อ/ขาย
            </li>
            <li>
              <img src="/images/icons/icon01.jpg" alt="tools" className="feature-icon" />
              เครื่องมือวิเคราะห์ Technical / Fundamental
            </li>
            <li>
              <img src="/images/icons/icon01.jpg" alt="alert" className="feature-icon" />
              แจ้งเตือนข่าวสารตลาดและหุ้นที่คุณติดตาม
            </li>
            <li>
              <img src="/images/icons/icon01.jpg" alt="portfolio" className="feature-icon" />
              ระบบ Portfolio ช่วยจัดการความเสี่ยง
            </li>
            <li>
              <img src="/images/icons/icon01.jpg" alt="dashboard" className="feature-icon" />
              Dashboard สรุปภาพรวมการลงทุนแบบ AI
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

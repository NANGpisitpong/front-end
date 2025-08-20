'use client';

import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { SiX } from 'react-icons/si'; // ใช้ X Icon
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>DO YOU WANT<span className="pip"> CALL ME ?</span></h2>
          <p>Empowering traders with futuristic design and insights</p>
        </div>

        <div className="footer-social-text">
          <a href="https://www.facebook.com/PisitpongAS" className="social-box fb" target="_blank"><FaFacebookF /></a>
          <a href="https://x.com/Pisitpong04" className="social-box x"  target="_blank"><SiX /></a>
          <a href="https://www.instagram.com/arm_pisitpong/" className="social-box ig" target="_blank"><FaInstagram /></a>
        </div>
      </div>

      <p className="footer-copy">© 2025 GreenPip. All rights reserved.</p>
    </footer>
  );
}

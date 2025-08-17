'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './home.css';

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(p);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [target, duration]);

  return value;
}

export default function HomeFuturistic() {
  // Stats
  const traders = useCountUp(12540, 1600);
  const signals = useCountUp(982, 1600);
  const strategies = useCountUp(156, 1600);

  // Ticker content (duplicated for seamless loop)
  const ticker = useMemo(
    () => [
      'BTC +2.31%', 'ETH +1.12%', 'XAUUSD −0.42%', 'US500 +0.95%', 'EURUSD +0.18%',
      'AAPL +1.02%', 'NVDA +2.84%', 'USDJPY −0.21%'
    ],
    []
  );

  useEffect(() => {
    const canvas = document.getElementById('bg-chart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w: number, h: number;
    const resize = () => {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight * 0.9);
    };
    resize();
    window.addEventListener('resize', resize);
    const points = Array.from({ length: 40 }, (_, i) => ({
      x: (w / 39) * i,
      y: h / 2 + Math.sin(i) * 40,
    }));
    let rafId: number;
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        points[i].y += (Math.random() - 0.5) * 6;
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = 'rgba(0,255,128,0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,255,128,0.8)';
      ctx.shadowBlur = 15;
      ctx.stroke();
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="home-root">
      {/* HERO */}
      <section className="hero">
        <canvas id="bg-chart" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></canvas>
        {/* layered bg */}
        <div className="hero-bg">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orb orb-1" aria-hidden="true" />
          <div className="hero-orb orb-2" aria-hidden="true" />
          <div className="hero-scan" aria-hidden="true" />
        </div>
        <div className="hero-content container">
          <h1 className="hero-title">
            Trade the <span className="fx-gradient">Future</span>
            <br /> with <span className="fx-brand">GreenPip</span>
          </h1>
          <p className="hero-sub">
            AI-driven insights, lightning-fast execution, and next‑gen analytics. Enter the neon market.
          </p>
          <div className="hero-cta">
            <Link href="/register" className="btn-neon primary">Get Started</Link>
            <Link href="/service" className="btn-neon ghost">Explore Tools</Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="num">{traders.toLocaleString()}+</div>
              <div className="label">Active Traders</div>
            </div>
            <div className="stat">
              <div className="num">{signals.toLocaleString()}</div>
              <div className="label">AI Signals / day</div>
            </div>
            <div className="stat">
              <div className="num">{strategies.toLocaleString()}</div>
              <div className="label">Strategies</div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="ticker" aria-label="Market ticker">
        <div className="ticker-track">
          <div className="ticker-row">
            {ticker.concat(ticker).map((t, i) => (
              <span className="tick" key={i}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features container">
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <i className="bi bi-cpu" aria-hidden="true" />
            <h3>AI Alpha</h3>
            <p>Predictive models scanning multi‑market signals with millisecond inference.</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <i className="bi bi-speedometer2" aria-hidden="true" />
            <h3>Low Latency</h3>
            <p>Edge‑accelerated order routing engineered for speed under heavy load.</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <i className="bi bi-shield-lock" aria-hidden="true" />
            <h3>Secure Core</h3>
            <p>Zero‑trust architecture with multi‑layer encryption and anomaly detection.</p>
          </div>
        </div>
      </section>

      {/* TRENDING CAROUSEL */}
      <section className="carousel-wrapper">
        <h2 className="carousel-title">Hot trend</h2>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          coverflowEffect={{ rotate: 55, stretch: 0, depth: 150, modifier: 1.8, slideShadows: true }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide className="slide">
            <Image src="/images/01.jpg" alt="Slide 1" width={400} height={500} />
            <div className="slide-caption">XAUUSD - Gold</div>
          </SwiperSlide>
          <SwiperSlide className="slide">
            <Image src="/images/02.png" alt="Slide 2" width={400} height={500} />
            <div className="slide-caption">BTC - Bitcoin</div>
          </SwiperSlide>
          <SwiperSlide className="slide">
            <Image src="/images/03.jpg" alt="Slide 3" width={400} height={500} />
            <div className="slide-caption">US500 - S&P 500</div>
          </SwiperSlide>
          <SwiperSlide className="slide">
            <Image src="/images/04.png" alt="Slide 4" width={400} height={500} />
            <div className="slide-caption">ETH - Ethereum</div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* CTA STRIPE */}
      <section className="cta-stripe">
        <div className="container cta-inner">
          <h3>Ready to upgrade your edge?</h3>
          <Link href="/register" className="btn-neon primary">Create Account</Link>
        </div>
      </section>
    </main>
  );
}

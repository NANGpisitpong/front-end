'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

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

  useEffect(() => {
    const wave = document.getElementById('sys-wave') as HTMLCanvasElement | null;
    const bars = document.getElementById('sys-bars') as HTMLCanvasElement | null;
    const radar = document.getElementById('sys-radar') as HTMLCanvasElement | null;

    const setCanvas = (canvas: HTMLCanvasElement, height: number) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const ctx = canvas.getContext('2d');
      const resize = () => {
        const rectW = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.width = Math.floor(rectW * dpr);
        canvas.height = Math.floor(height * dpr);
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      return { ctx, resize } as const;
    };

    let rafWave = 0, rafBars = 0, rafRadar = 0;
    let onWaveResize: ((this: Window, ev: UIEvent) => any) | undefined;
    let onBarsResize: ((this: Window, ev: UIEvent) => any) | undefined;
    let onRadarResize: ((this: Window, ev: UIEvent) => any) | undefined;

    if (wave) {
      const { ctx, resize } = setCanvas(wave, 180);
      onWaveResize = resize;
      window.addEventListener('resize', onWaveResize);
      let t = 0;
      const drawWave = () => {
        if (!ctx) return;
        const w = wave.clientWidth; const h = 180;
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = h / 2 + Math.sin((x + t) / 60) * 24 + Math.sin((x + t) / 18) * 6;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(34,197,94,0.8)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(34,197,94,0.8)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        t += 2;
        rafWave = requestAnimationFrame(drawWave);
      };
      rafWave = requestAnimationFrame(drawWave);
    }

    if (bars) {
      const { ctx, resize } = setCanvas(bars, 180);
      onBarsResize = resize;
      window.addEventListener('resize', onBarsResize);
      const n = 24; let vals = new Array(n).fill(0).map(() => Math.random());
      const drawBars = () => {
        if (!ctx) return;
        const w = bars.clientWidth; const h = 180;
        ctx.clearRect(0, 0, w, h);
        const bw = w / (n * 1.5);
        vals = vals.map(v => Math.min(1, Math.max(0, v + (Math.random() - 0.5) * 0.2)));
        vals.forEach((v, i) => {
          const x = i * bw * 1.5 + 8;
          const bh = v * (h * 0.75);
          const y = h - bh;
          const g = ctx!.createLinearGradient(0, y, 0, h);
          g.addColorStop(0, 'rgba(250,204,21,0.9)');
          g.addColorStop(1, 'rgba(34,197,94,0.5)');
          ctx!.fillStyle = g;
          ctx!.shadowColor = 'rgba(250,204,21,0.6)';
          ctx!.shadowBlur = 8;
          ctx!.fillRect(x, y, bw, bh);
        });
        rafBars = requestAnimationFrame(drawBars);
      };
      rafBars = requestAnimationFrame(drawBars);
    }

    if (radar) {
      const { ctx, resize } = setCanvas(radar, 220);
      onRadarResize = resize;
      window.addEventListener('resize', onRadarResize);
      let ang = 0;
      const drawRadar = () => {
        if (!ctx) return;
        const w = radar.clientWidth; const h = 220; const cx = w / 2, cy = h / 2;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(34,197,94,0.4)';
        ctx.lineWidth = 1; ctx.shadowBlur = 0; ctx.beginPath();
        [40, 80, 110].forEach(r => { ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, Math.PI * 2); });
        ctx.stroke();
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
        grd.addColorStop(0, 'rgba(34,197,94,0.45)');
        grd.addColorStop(1, 'rgba(34,197,94,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, 110, ang, ang + Math.PI / 5);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.9)'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * 110, cy + Math.sin(ang) * 110);
        ctx.stroke();
        ang += 0.04;
        rafRadar = requestAnimationFrame(drawRadar);
      };
      rafRadar = requestAnimationFrame(drawRadar);
    }

    return () => {
      if (onWaveResize) window.removeEventListener('resize', onWaveResize);
      if (onBarsResize) window.removeEventListener('resize', onBarsResize);
      if (onRadarResize) window.removeEventListener('resize', onRadarResize);
      if (rafWave) cancelAnimationFrame(rafWave);
      if (rafBars) cancelAnimationFrame(rafBars);
      if (rafRadar) cancelAnimationFrame(rafRadar);
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
            <p>แบบจำลองเชิงทำนายที่สแกนสัญญาณหลายตลาดด้วยการอนุมานแบบมิลลิวินาที</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <i className="bi bi-speedometer2" aria-hidden="true" />
            <h3>Low Latency</h3>
            <p>การกำหนดเส้นทางคำสั่งแบบเร่งความเร็วที่ขอบออกแบบมาเพื่อความเร็วภายใต้ภาระงานหนัก</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <i className="bi bi-shield-lock" aria-hidden="true" />
            <h3>Secure Core</h3>
            <p>สถาปัตยกรรม Zero Trust ที่มีการเข้ารหัสหลายชั้นและการตรวจจับความผิดปกติ</p>
          </div>
        </div>
      </section>

      {/* SYSTEMS VISUALS */}
      <section className="features container">
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Wave Monitor</h3>
            <canvas id="sys-wave" style={{ width: '100%', height: 180, display: 'block', pointerEvents: 'none' }} />
            <p>สัญญาณคลื่นหลายความถี่จำลอง สะท้อนสภาวะความผันผวนแบบเรียลไทม์</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Pulse Bars</h3>
            <canvas id="sys-bars" style={{ width: '100%', height: 180, display: 'block', pointerEvents: 'none' }} />
            <p>พลังานของช่องสัญญาณปรับขึ้นลงแบบสุ่มถ่วงน้ำหนัก ให้ความรู้สึกเหมือนมิเตอร์ระบบ</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Radar Sweep</h3>
            <canvas id="sys-radar" style={{ width: '100%', height: 220, display: 'block', pointerEvents: 'none' }} />
            <p>ลำแสงกวาดแบบเรดาร์เพื่อค้นหาสัญญาณใหม่ เคลื่อนไหวนุ่มนวลต่อเนื่อง</p>
          </div>
        </div>
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

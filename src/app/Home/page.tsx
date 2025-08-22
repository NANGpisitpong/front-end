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

  // Ticker content
  const ticker = useMemo(
    () => [
      'BTC +2.31%', 'ETH +1.12%', 'XAUUSD −0.42%', 'US500 +0.95%', 'EURUSD +0.18%',
      'AAPL +1.02%', 'NVDA +2.84%', 'USDJPY −0.21%', 'TSLA +3.15%', 'GOOGL +1.67%',
      'AMZN +0.89%', 'NFLX +2.45%', 'META +1.23%', 'BABA +0.76%', 'MSFT +1.98%'
    ],
    []
  );

  // HERO background canvas (zoom/HiDPI/reduced-motion friendly)
  useEffect(() => {
    const canvas = document.getElementById('bg-chart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    let points: { x: number; y: number }[] = [];
    let rafId = 0;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const parent = canvas.parentElement as HTMLElement | null;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: Math.floor(window.innerHeight * 0.9) } as any;
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = Array.from({ length: 40 }, (_, i) => ({ x: (w / 39) * i, y: h / 2 + Math.sin(i) * 40 }));
    };

    const drawFrame = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = 'rgba(0,255,128,0.6)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0,255,128,0.8)';
      ctx.shadowBlur = 15;
      ctx.stroke();
    };

    const draw = () => {
      for (let i = 1; i < points.length; i++) points[i].y += (Math.random() - 0.5) * 6;
      drawFrame();
      rafId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    const heroRO = 'ResizeObserver' in window ? new ResizeObserver(() => resize()) : null;
    if (heroRO && canvas.parentElement) heroRO.observe(canvas.parentElement);

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) drawFrame(); else rafId = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }
      else if (!reduceMotion && !rafId) { rafId = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('resize', resize);
      if (heroRO && canvas.parentElement) heroRO.unobserve(canvas.parentElement);
      heroRO?.disconnect?.();
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // SYSTEM canvases (wave, bars, radar) with ResizeObserver & reduced‑motion
  useEffect(() => {
    const wave = document.getElementById('sys-wave') as HTMLCanvasElement | null;
    const bars = document.getElementById('sys-bars') as HTMLCanvasElement | null;
    const radar = document.getElementById('sys-radar') as HTMLCanvasElement | null;

    const setCanvas = (canvas: HTMLCanvasElement, fallbackHeight: number) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const ctx = canvas.getContext('2d');
      const resize = () => {
        const rectW = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
        const rectH = canvas.clientHeight || fallbackHeight;
        canvas.width = Math.floor(rectW * dpr);
        canvas.height = Math.floor(rectH * dpr);
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      return { ctx, resize } as const;
    };

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafWave = 0, rafBars = 0, rafRadar = 0;
    let onWaveResize: ((this: Window, ev: UIEvent) => any) | undefined;
    let onBarsResize: ((this: Window, ev: UIEvent) => any) | undefined;
    let onRadarResize: ((this: Window, ev: UIEvent) => any) | undefined;
    let restartWave: (() => void) | null = null;
    let restartBars: (() => void) | null = null;
    let restartRadar: (() => void) | null = null;

    if (wave) {
      const { ctx, resize } = setCanvas(wave, 180);
      onWaveResize = resize;
      window.addEventListener('resize', onWaveResize);
      const roWave = 'ResizeObserver' in window ? new ResizeObserver(() => resize()) : undefined;
      roWave?.observe(wave);
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
        if (!reduceMotion) rafWave = requestAnimationFrame(drawWave);
      };
      restartWave = () => { if (!rafWave && !reduceMotion) rafWave = requestAnimationFrame(drawWave); };
      if (reduceMotion) drawWave(); else rafWave = requestAnimationFrame(drawWave);
    }

    if (bars) {
      const { ctx, resize } = setCanvas(bars, 180);
      onBarsResize = resize;
      window.addEventListener('resize', onBarsResize);
      const roBars = 'ResizeObserver' in window ? new ResizeObserver(() => resize()) : undefined;
      roBars?.observe(bars);
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
        if (!reduceMotion) rafBars = requestAnimationFrame(drawBars);
      };
      restartBars = () => { if (!rafBars && !reduceMotion) rafBars = requestAnimationFrame(drawBars); };
      if (reduceMotion) drawBars(); else rafBars = requestAnimationFrame(drawBars);
    }

    if (radar) {
      const { ctx, resize } = setCanvas(radar, 220);
      onRadarResize = resize;
      window.addEventListener('resize', onRadarResize);
      const roRadar = 'ResizeObserver' in window ? new ResizeObserver(() => resize()) : undefined;
      roRadar?.observe(radar);
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
        if (!reduceMotion) rafRadar = requestAnimationFrame(drawRadar);
      };
      restartRadar = () => { if (!rafRadar && !reduceMotion) rafRadar = requestAnimationFrame(drawRadar); };
      if (reduceMotion) drawRadar(); else rafRadar = requestAnimationFrame(drawRadar);
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (rafWave) { cancelAnimationFrame(rafWave); rafWave = 0; }
        if (rafBars) { cancelAnimationFrame(rafBars); rafBars = 0; }
        if (rafRadar) { cancelAnimationFrame(rafRadar); rafRadar = 0; }
      } else if (!reduceMotion) {
        if (restartWave) restartWave();
        if (restartBars) restartBars();
        if (restartRadar) restartRadar();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (onWaveResize) window.removeEventListener('resize', onWaveResize);
      if (onBarsResize) window.removeEventListener('resize', onBarsResize);
      if (onRadarResize) window.removeEventListener('resize', onRadarResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (rafWave) cancelAnimationFrame(rafWave);
      if (rafBars) cancelAnimationFrame(rafBars);
      if (rafRadar) cancelAnimationFrame(rafRadar);
    };
  }, []);

  // FX: Starfield, Cursor Trail, Parallax, Noise, Glitch
  useEffect(() => {
    const canvas = document.getElementById('fx-stars') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = 0;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stars: { x: number; y: number; z: number; s: number }[] = [];
    const N = 180;
    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length) {
        for (let i = 0; i < N; i++) {
          stars.push({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.5 + 0.5, s: Math.random() * 1.2 + 0.2 });
        }
      }
    };
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        ctx.globalAlpha = 0.35 * st.z + 0.15;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
        ctx.fill();
        st.x += 0.05 + st.z * 0.25;
        if (st.x > w + 2) { st.x = -2; st.y = Math.random() * h; }
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    if (reduceMotion) draw(); else raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('fx-cursor') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = 0;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const trail: { x: number; y: number; life: number }[] = [];
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          trail.push({ x: e.clientX, y: e.clientY, life: 1 });
          ticking = false;
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const r = 22 * (p.life);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, 'rgba(34,255,128,0.65)');
        g.addColorStop(0.5, 'rgba(0,255,255,0.35)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        p.life -= 0.025;
        if (p.life <= 0) trail.splice(i, 1);
      }
      ctx.globalCompositeOperation = 'source-over';
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    if (!reduceMotion) raf = requestAnimationFrame(draw);
    const onVisibility = () => {
      if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
      else if (!reduceMotion && !raf) { raf = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (!hero) return;
    const orb1 = hero.querySelector('.hero-orb.orb-1') as HTMLElement | null;
    const orb2 = hero.querySelector('.hero-orb.orb-2') as HTMLElement | null;
    const grid = hero.querySelector('.hero-grid') as HTMLElement | null;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let req = 0; let mx = 0; let my = 0;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx = (e.clientX - cx) / rect.width;
      my = (e.clientY - cy) / rect.height;
      if (!req && !reduceMotion) req = requestAnimationFrame(apply);
    };
    const apply = () => {
      if (orb1) orb1.style.transform = `translate3d(${mx * 22}px, ${my * 18}px, 0)`;
      if (orb2) orb2.style.transform = `translate3d(${mx * -18}px, ${my * -14}px, 0)`;
      if (grid) grid.style.backgroundPosition = `${mx * 20}px ${my * 20}px, ${mx * 20}px ${my * 20}px`;
      req = 0;
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); if (req) cancelAnimationFrame(req); };
  }, []);

  useEffect(() => {
    const noise = document.getElementById('fx-noise') as HTMLDivElement | null;
    if (!noise) return;
    const c = document.createElement('canvas'); const s = 128;
    c.width = s; c.height = s;
    const nctx = c.getContext('2d');
    if (nctx) {
      const img = nctx.createImageData(s, s);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 28;
      }
      nctx.putImageData(img, 0, 0);
      const url = c.toDataURL();
      noise.style.background = `url(${url}) repeat`;
      noise.style.opacity = '0.05';
      noise.style.mixBlendMode = 'overlay';
    }
  }, []);

  useEffect(() => {
    const title = document.querySelector('.hero-title') as HTMLElement | null;
    if (!title) return;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t: any;
    const glitchOnce = () => {
      if (!title) return;
      const frames = 8;
      let c = 0;
      const step = () => {
        title.style.textShadow = c % 2 === 0 ? `2px 0 var(--cyan), -2px 0 var(--magenta)` : `-2px 0 var(--cyan), 2px 0 var(--magenta)`;
        title.style.filter = `brightness(1.06)`;
        c++;
        if (c <= frames) requestAnimationFrame(step);
        else { title.style.textShadow = ''; title.style.filter = ''; }
      };
      step();
    };
    const loop = () => {
      glitchOnce();
      t = setTimeout(loop, 5000 + Math.random() * 3000);
    };
    if (!reduceMotion) t = setTimeout(loop, 2000);
    return () => { if (t) clearTimeout(t); if (title) { title.style.textShadow = ''; title.style.filter = ''; } };
  }, []);

  return (
    <main className="home-root">
      <canvas id="fx-stars" aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      <div id="fx-noise" aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3 }} />
      <canvas id="fx-cursor" aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }} />
      {/* HERO */}
      <section className="hero">
        <canvas id="bg-chart" aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></canvas>
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
          <div className="hero-stats" role="list" aria-label="Key metrics">
            <div className="stat" role="listitem">
              <div className="num">{traders.toLocaleString()}+</div>
              <div className="label">Active Traders</div>
            </div>
            <div className="stat" role="listitem">
              <div className="num">{signals.toLocaleString()}</div>
              <div className="label">AI Signals / day</div>
            </div>
            <div className="stat" role="listitem">
              <div className="num">{strategies.toLocaleString()}</div>
              <div className="label">Strategies</div>
            </div>
          </div>
        </div>
      </section>

      <section className="carousel-section" aria-label="Mega Market Highlights">
        <div className="carousel-container">
          <div className="carousel-track">
            {[
              '/images/slide1.jpg',
              '/images/slide2.png',
              '/images/slide3.png',
              '/images/slide4.jpg',
            ].map((src, idx) => (
              <div className="carousel-slide" key={idx}>
                <img src={src} alt={`Market visual ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="features container" aria-label="Core capabilities">
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

      {/* SYSTEMS VISUALS */}
      <section className="features container" aria-label="Live systems visuals">
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Wave Monitor</h3>
            <canvas id="sys-wave" className="canvas-visual cv-wave" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
            <p>สัญญาณคลื่นหลายความถี่จำลอง สะท้อนสภาวะความผันผวนแบบเรียลไทม์</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Pulse Bars</h3>
            <canvas id="sys-bars" className="canvas-visual cv-bars" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
            <p>พลังงานของช่องสัญญาณปรับขึ้นลงแบบสุ่มถ่วงน้ำหนัก ให้ความรู้สึกเหมือนมิเตอร์ระบบ</p>
          </div>
        </div>
        <div className="holo-card">
          <div className="holo-glow" />
          <div className="holo-content">
            <h3>Radar Sweep</h3>
            <canvas id="sys-radar" className="canvas-visual cv-radar" style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
            <p>ลำแสงกวาดแบบเรดาร์เพื่อค้นหาสัญญาณใหม่ เคลื่อนไหวนุ่มนวลต่อเนื่อง</p>
          </div>
        </div>
      </section>

      {/* ANALYTICS SPLIT */}
      <section className="container" aria-label="Analytics highlights" style={{ margin: '24px auto 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '18px' }}>
          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))',
            border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.04)'
          }}>
            <pre aria-label="Neon terminal" style={{
              margin: 0, whiteSpace: 'pre-wrap', color: '#dbeafe',
              textShadow: '0 0 8px rgba(34,197,94,.35)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}>
{`> boot --neon --analytics\n✓ GPU kernels loaded\n✓ Signal graph compiled\n> subscribe markets: [BTC, XAUUSD, US500]\n> stream --fps 60 --latency <2ms\n> alerts --risk adaptive --mode conservative\n… running`}
            </pre>
          </div>
          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))',
            border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.04)'
          }}>
            <h3 style={{ marginTop: 0 }}>Highlights</h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#93a4c7' }}>
              <li>Streaming analytics with adaptive risk engine</li>
              <li>Composable strategies with visual feedback</li>
              <li>Low-latency routing and snapshot consistency</li>
            </ul>
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
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

type Trend = "up" | "down" | "neutral";
interface Ticker {
  symbol: string;
  price: number;
  change: number; // percent
  trend: Trend;
  points: number[]; // for sparkline
}

function makePoints(n = 24, base = 100, vol = 1.2) {
  const pts: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.5) * vol;
    pts.push(v);
  }
  return pts;
}

function makeTicker(symbol: string, base: number, vol = 1) : Ticker {
  const price = base + (Math.random() - 0.5) * vol * 2;
  const change = (Math.random() - 0.5) * 2.5; // +/- 2.5%
  const trend: Trend = change > 0.1 ? "up" : change < -0.1 ? "down" : "neutral";
  return { symbol, price, change, trend, points: makePoints(24, base, vol) };
}

function pathFromPoints(points: number[], width = 96, height = 28) {
  if (!points || points.length === 0) return "";
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1e-6, max - min);
  const stepX = width / Math.max(1, points.length - 1);
  const toY = (v: number) => height - ((v - min) / span) * height;

  let d = `M 0 ${toY(points[0]).toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const x = (i * stepX).toFixed(2);
    const y = toY(points[i]).toFixed(2);
    d += ` L ${x} ${y}`;
  }
  return d;
}

export default function AboutClient() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const setRef = (el: HTMLElement | null) => {
    if (!el) return;
    if (!revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const [counter, setCounter] = useState(0);
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    // IntersectionObserver for reveal animation
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Initialize tickers on client to avoid SSR/client mismatch
  useEffect(() => {
    setTickers([
      makeTicker("SET", 1560, 0.6),
      makeTicker("PTT", 34.5, 0.25),
      makeTicker("AOT", 66.2, 0.28),
      makeTicker("DELTA", 78.8, 0.9),
      makeTicker("SCB", 97.1, 0.35),
      makeTicker("BBL", 143.3, 0.4),
      makeTicker("ADVANC", 210.5, 0.5),
    ]);
  }, []);

  useEffect(() => {
    // Lightweight simulated price updates
    const id = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const drift = (Math.random() - 0.5) * 0.6; // +/- 0.3
          const newPrice = Math.max(0.01, t.price + drift);
          const pct = ((newPrice - t.price) / Math.max(0.0001, t.price)) * 100;
          const newPoints = [...t.points.slice(1), newPrice];
          const trend: Trend = pct > 0.05 ? "up" : pct < -0.05 ? "down" : "neutral";
          return { ...t, price: newPrice, change: pct, trend, points: newPoints };
        })
      );
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={`container ${styles.page}`} aria-labelledby="about-title">
      <div className={`mb-4 ${styles.hero}`} ref={setRef as any}>
        <h1 id="about-title" className={styles.heroTitle}>
          เกี่ยวกับเรา
        </h1>
        <p className={styles.heroSubtitle}>
          เราสร้างโซลูชันเว็บสำหรับโลกการล���ทุน เน้นความเร็ว ความน่าเชื่อถือ และประสบการณ์ผู้ใช้ที่ลื่นไหล
        </p>
      </div>

      {/* Live-like ticker */}
      <div className={styles.section}>
        <div className={`${styles.ticker} ${styles.reveal}`} ref={setRef as any} aria-label="Live market ticker">
          <div className={styles.tickerTrack}>
            {[...tickers, ...tickers].map((t, idx) => (
              <div key={`${t.symbol}-${idx}`} className={styles.tickerItem}>
                <span className={styles.symbol}>{t.symbol}</span>
                <svg className={styles.sparkline} viewBox="0 0 96 28" aria-hidden="true">
                  <path
                    className={
                      `${styles.sparklinePath} ${t.trend === "down" ? styles.sparklineDown : styles.sparklineUp}`
                    }
                    d={pathFromPoints(t.points)}
                  />
                </svg>
                <span className={styles.price}>{t.price.toFixed(2)}</span>
                <span
                  className={`${styles.change} ${
                    t.trend === "up" ? styles.up : t.trend === "down" ? styles.down : styles.neutral
                  }`}
                >
                  {(t.change >= 0 ? "+" : "") + t.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <h3 className={styles.cardHeader}>พันธกิจ</h3>
            <p className={styles.cardBody}>ขับเคลื่อนตลาดทุนด้วยข้อมูลที่เข้าถึงง่าย แม่นยำ และทันเวลา</p>
          </article>
          <article className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <h3 className={styles.cardHeader}>วิสัยทัศน์</h3>
            <p className={styles.cardBody}>ทำให้ทุกคนเข้าถึงเครื่องมือวิเคราะห์และเทรดอย่างมืออาชีพ</p>
          </article>
          <article className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <h3 className={styles.cardHeader}>คุณค่า</h3>
            <p className={styles.cardBody}>โปร่งใส เร็ว เสถียร และปลอดภัย</p>
          </article>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.values}>
          <div className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.statNumber}>1ms</div>
              <div className={styles.statLabel}>Median API Latency</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.statNumber}>99.99%</div>
              <div className={styles.statLabel}>อัปไทม์</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.reveal}`} ref={setRef as any}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>การสนับสนุนลูกค้า</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={`${styles.cta} ${styles.reveal}`} ref={setRef as any}>
          <p className={styles.ctaText}>ตัวนับโต้ตอบ: {counter}</p>
          <button
            type="button"
            className={styles.ctaButton}
            onClick={() => setCounter((c) => c + 1)}
            aria-label="เพิ่มตัวนับ"
          >
            เพิ่ม +1
          </button>
        </div>
      </div>
    </section>
  );
}

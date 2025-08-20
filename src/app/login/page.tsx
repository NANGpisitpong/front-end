"use client";
import React, {
  useState,
  useCallback,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";

const NUM_PARTICLES = 48;
const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export default function Login() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // preload saved email if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedEmail");
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const particlesRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // particles positions (generate only on client to avoid hydration mismatch)
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      top: number;
      left: number;
      size: number;
      delay: number;
      dur: number;
      hueShift: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    const arr = Array.from({ length: NUM_PARTICLES }).map((_, idx) => {
      const size = 2 + Math.random() * 12;
      return {
        id: idx,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size,
        delay: Math.random() * 6000,
        dur: 4000 + Math.random() * 7000,
        hueShift: -20 + Math.random() * 40,
        opacity: 0.25 + Math.random() * 0.75,
      };
    });
    setParticles(arr);
  }, []);

  // Parallax: card tilt on mouse move
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = (dy / rect.height) * -8;
      const ry = (dx / rect.width) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
    function onLeave() {
      if (!el) return;
      el.style.transform = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave as any);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave as any);
    };
  }, []);

  // particles parallax container slight follow
  useEffect(() => {
    const node = particlesRef.current;
    if (!node) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30; // px
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // submit with real backend auth
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      if (!validateEmail(email)) {
        setError("❌ อีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
        return;
      }
      if (!password) {
        setError("❌ กรุณาใส่รหัสผ่าน");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          "https://backend-nextjs-virid.vercel.app/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // API expects { username, password } — we pass the email as username
            body: JSON.stringify({ username: email, password }),
          }
        );

        // attempt to parse the body even on non-2xx
        let data: any = {};
        try {
          data = await res.json();
        } catch {
          // non-JSON response
        }

        if (res.ok && data?.token) {
          // persist token
          localStorage.setItem("token", data.token);

          // remember email if requested
          if (remember) localStorage.setItem("savedEmail", email);
          else localStorage.removeItem("savedEmail");

          setLoading(false);
          await Swal.fire({
            icon: "success",
            title: "<h3>Login Successfully!</h3>",
            showConfirmButton: false,
            timer: 1500,
          });

          // navigate to admin/users
          router.push("/admin/user");
        } else {
          const message =
            data?.message ||
            (res.status === 401
              ? "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
              : "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้");
          throw new Error(message);
        }
      } catch (err: any) {
        console.error("Login error:", err);
        setLoading(false);
        setError(`❌ ${err?.message || "Login Failed"}`);
        await Swal.fire({
          icon: "warning",
          title: "<h3>Login Failed!</h3>",
          text: err?.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
    [email, password, remember, router]
  );

  return (
    <>
      {/* layered background */}
      <div className="bg-layer animated-gradient" aria-hidden />
      <div className="bg-layer bg-grid" aria-hidden>
        <svg
          className="stock-graph"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[...Array(6)].map((_, i) => {
            const yBase = 220 - i * 18;
            const d = `M0 ${yBase} C 150 ${yBase - (40 + i * 8)}, 300 ${
              yBase + (20 + i * 6)
            }, 450 ${yBase - (30 + i * 10)} C 600 ${
              yBase + 40
            }, 750 ${yBase - 60}, 900 ${yBase - 10} C1050 ${
              yBase - 40
            }, 1200 ${yBase - 20}, 1200 ${yBase - 20}`;
            return (
              <path
                key={i}
                className={`stock-path line${i + 1}`}
                d={d}
                style={{ animationDelay: `${i * 0.8}s` }}
              />
            );
          })}
        </svg>
      </div>

      {/* particles */}
      <div className="glowing-particles" ref={particlesRef} aria-hidden>
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.dur}ms`,
              opacity: p.opacity,
              filter: `hue-rotate(${p.hueShift}deg) blur(${
                p.size > 8 ? 1.6 : 0.4
              }px)`,
            }}
          />
        ))}
      </div>

      <Link
        href="/Home"
        className="back-btn"
        aria-label="กลับหน้า Home"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: 12,
          border: "1.5px solid #4ad8ff",
          color: "#e7f0ff",
          textDecoration: "none",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 0 12px rgba(74,216,255,.4), inset 0 0 18px rgba(74,216,255,.12)",
          fontWeight: 800,
        }}
      >
        <span className="back-arrow" style={{ fontSize: "1.2rem", lineHeight: 1 }}>
          ◀
        </span>
        กลับหน้า Home
      </Link>
      <main className="login-page">
        <div className="login-card" ref={cardRef} role="region" aria-label="Login">
          <section className="panel form-panel">
            <div className="brand">
              <div className="logo">
                <img src="/images/GreenPip-logo.png" />
              </div>
              <div className="brand-text">
                <div className="brand-title">Let's go right now🚀</div>
                <div className="brand-sub">Sign in to your dashboard</div>
              </div>
            </div>

            <h2 className="panel-heading">Welcome 👋</h2>

            <form className="panel-form" onSubmit={handleSubmit} noValidate>
              {error && <div className="alert">{error}</div>}

              <label className="form-label" htmlFor="email">
                Account🤵
              </label>
              <input
                id="email"
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                aria-describedby="emailHelp"
              />

              <label className="form-label" htmlFor="password">
                Password🔐
              </label>
              <div className="password-field">
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="row between small">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />{" "}
                  Remember 30 days
                </label>
                <Link href="/forgot-password" className="link muted">
                  Forgot?
                </Link>
              </div>

              <button
                className="btn primary"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                <span className="btn-text">
                  {loading ? "Loading..." : "Sign in"}
                </span>
                <span className="btn-emoji">➡️</span>
              </button>

              <button
                type="button"
                className="btn ghost btn-google"
                onClick={() => alert("Google placeholder")}
              >
                <FaGoogle /> <span>Sign in with Google</span>
              </button>
            </form>

            <p className="signup">
              Don’t have an account?{" "}
              <Link href="/register" className="link">
                Sign up
              </Link>
            </p>
          </section>

          <aside className="panel visual-panel" aria-hidden>
            <div className="visual-overlay">
              <img
                src="/images/Patterns.jpg"
                alt="Visual pattern"
                className="visual-image"
                draggable={false}
              />
              <div className="visual-caption">
                <h3>Real-time insights</h3>
                <p>
                  Realtime charts, subtle motion, and micro interactions — built
                  for pros.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
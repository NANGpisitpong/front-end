"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./res.css";

const StockThemeRegister: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    prefix: "",
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    acceptedTerms: false,
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "username":
        if (!value) return "กรุณากรอกชื่อผู้ใช้หรืออีเมลล์";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.includes("@") && !emailRegex.test(value)) {
          return "รูปแบบอีเมลล์ไม่ถูกต้อง";
        }
        return "";
      case "password":
        if (value.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        return "";
      case "confirmPassword":
        if (value !== formData.password) return "รหัสผ่านไม่ตรงกัน";
        return "";
      case "firstName":
      case "lastName":
        if (!value) return "กรุณากรอกข้อมูลนี้";
        return "";
      case "prefix":
        if (!value) return "กรุณาเลือกคำนำหน้า";
        return "";
      case "birthYear":
      case "birthMonth":
      case "birthDay":
        if (!value) return "กรุณาเลือกวันเกิดให้ครบถ้วน";
        return "";
      case "gender":
        if (!value) return "กรุณาเลือกเพศ";
        return "";
      case "address":
        if (!value) return "กรุณากรอกที่อยู่";
        return "";
      case "acceptedTerms":
        if (!formData.acceptedTerms) return "คุณต้องยอมรับเงื่อนไขการใช้งาน";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Validate real-time
    const error = validateField(name, val as string);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, val]) => {
      const error = validateField(key, typeof val === "boolean" ? String(val) : val);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง",
      });
      return;
    }

    setIsSubmitting(true);

    const bodyData = {
      username: formData.username,
      password: formData.password,
      firstname: formData.firstName,
      lastname: formData.lastName,
      fullname: `${formData.prefix} ${formData.firstName} ${formData.lastName}`,
      gender: formData.gender,
      address: formData.address,
      birthdate: `${formData.birthYear}-${formData.birthMonth.padStart(
        2,
        "0"
      )}-${formData.birthDay.padStart(2, "0")}`,
    };

    try {
      const res = await fetch("https://backend-nextjs-virid.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ 🎉",
          text: "ยินดีต้อนรับ! ไปเข้าสู่ระบบกันเลย",
          confirmButtonText: "ไปยังหน้าล็อกอิน",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "สมัครไม่สำเร็จ",
          text: result?.message || "เกิดข้อผิดพลาดในการลงทะเบียน",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Canvas particle effect (interactive glowing energy particles)
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.className = "particle-canvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > W) this.speedX *= -1;
        if (this.y < 0 || this.y > H) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 70;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse interaction
    const mouse = { x: W / 2, y: H / 2 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animate() {
      ctx.clearRect(0, 0, W, H);
      // Draw connections
      for (let i = 0; i < particleCount; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Draw line to mouse if close
        const dxm = particles[i].x - mouse.x;
        const dym = particles[i].y - mouse.y;
        const distMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (distMouse < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distMouse / 150})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(animate);
    }
    animate();

    // Resize handler
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    
    <div className="register-wrapper stock-theme">
       <a href="/login" className="back-btn" aria-label="กลับเข้าสู่ระบบ">
    <span className="back-arrow">◀</span> กลับเข้าสู่ระบบ
  </a>
      <div className="register-card">
        <div className="register-header">


          <h2 className="glow-text">ลงทะเบียนสมาชิก</h2>
          <p className="subtitle">สมัครใช้งานเพื่อเข้าสู่ระบบเทรด Forex/หุ้น อย่างมือโปร</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {/* บัญชีผู้ใช้ */}
          <div className="form-section">
            <h3>บัญชีผู้ใช้ 🤵📊</h3>
            <label>
              ชื่อผู้ใช้ หรือ อีเมลล์
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="ชื่อผู้ใช้ หรือ อีเมลล์"
                className={errors.username ? "input-error" : ""}
                required
                autoComplete="username"
              />
              {errors.username && (
                <small className="error-text">{errors.username}</small>
              )}
            </label>

            <label>
              รหัสผ่าน
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="รหัสผ่าน"
                className={errors.password ? "input-error" : ""}
                required
                autoComplete="new-password"
              />
              {errors.password && (
                <small className="error-text">{errors.password}</small>
              )}
            </label>

            <label>
              รหัสผ่าน (ยืนยันอีกรอบ)
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="ยืนยันรหัสผ่าน"
                className={errors.confirmPassword ? "input-error" : ""}
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <small className="error-text">{errors.confirmPassword}</small>
              )}
            </label>
          </div>

          {/* ข้อมูลส่วนตัว */}
          <div className="form-section">
            <h3>ข้อมูลส่วนตัว 📝</h3>
            <label>
              คำนำหน้าชื่อ
              <select
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                className={errors.prefix ? "input-error" : ""}
                required
              >
                <option value="">-- เลือก --</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
              {errors.prefix && (
                <small className="error-text">{errors.prefix}</small>
              )}
            </label>

            <label>
              ชื่อ(จริง)
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="ชื่อ"
                className={errors.firstName ? "input-error" : ""}
                required
              />
              {errors.firstName && (
                <small className="error-text">{errors.firstName}</small>
              )}
            </label>

            <label>
              นามสกุล(จริง)
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="นามสกุล"
                className={errors.lastName ? "input-error" : ""}
                required
              />
              {errors.lastName && (
                <small className="error-text">{errors.lastName}</small>
              )}
            </label>

            <label>
              วันเกิด
              <div className="birthdate-select">
                <select
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className={errors.birthDay ? "input-error" : ""}
                  required
                >
                  <option value="">วัน</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  className={errors.birthMonth ? "input-error" : ""}
                  required
                >
                  <option value="">เดือน</option>
                  {[
                    "มกราคม",
                    "กุมภาพันธ์",
                    "มีนาคม",
                    "เมษายน",
                    "พฤษภาคม",
                    "มิถุนายน",
                    "กรกฎาคม",
                    "สิงหาคม",
                    "กันยายน",
                    "ตุลาคม",
                    "พฤศจิกายน",
                    "ธันวาคม",
                  ].map((month, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  className={errors.birthYear ? "input-error" : ""}
                  required
                >
                  <option value="">ปี</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              {(errors.birthDay || errors.birthMonth || errors.birthYear) && (
                <small className="error-text">กรุณาเลือกวันเกิดให้ครบถ้วน</small>
              )}
            </label>

            <label>
              เพศ 👩🧑
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
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
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  หญิง
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                  />
                  อื่นๆ
                </label>
              </div>
              {errors.gender && (
                <small className="error-text">{errors.gender}</small>
              )}
            </label>

            <label>
              ที่อยู่
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="ที่อยู่บ้านเลขที่"
                className={errors.address ? "input-error" : ""}
                required
              />
              {errors.address && (
                <small className="error-text">{errors.address}</small>
              )}
            </label>
          </div>

          {/* ยอมรับเงื่อนไข */}
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
            {errors.acceptedTerms && (
              <small className="error-text">{errors.acceptedTerms}</small>
            )}
          </div>

          {/* ปุ่ม */}
          <button
            type="submit"
            className="btn-register"
            disabled={isSubmitting}
            style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockThemeRegister;

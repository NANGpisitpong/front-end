'use client'
import './service.css'

export default function ServicePage() {
  return (
    <div className="service-wrapper">
      <div className="service-container">
        {/* Hero */}
        <section className="service-hero">
          <h1>บริการของเรา • Our Services</h1>
          <p>
            ยกระดับประสบการณ์ของคุณด้วยบริการจากทีม IT ที่เชี่ยวชาญ ครอบคลุมตั้งแต่การพัฒนาเว็บแอป ระบบหลังบ้าน ไปจนถึงการดูแลโครงสร้างพื้นฐาน
            ดีไซน์ในโทน Modern Glass + Neon ที่ทั้งเท่และใช้งานง่าย
          </p>
        </section>

        {/* Services Grid */}
        <section className="service-grid">
          <article className="service-card">
            <div className="service-icon">⚡</div>
            <div className="service-title">Web Applications</div>
            <div className="service-desc">พัฒนาเว็บแอประบบงาน รองรับการขยายตัว ยืดหยุ่น ครอบคลุมทั้ง Frontend/Backend</div>
          </article>
          <article className="service-card">
            <div className="service-icon">🔐</div>
            <div className="service-title">Authentication & Security</div>
            <div className="service-desc">ระบบเข้าสู่ระบบ SSO, JWT, RBAC พร้อมแนวปฏิบัติด้านความปลอดภัย</div>
          </article>
          <article className="service-card">
            <div className="service-icon">📊</div>
            <div className="service-title">Data Dashboards</div>
            <div className="service-desc">แดชบอร์ดสรุปผลแบบเรียลไทม์ รองรับกราฟ ตาราง และการกรองข้อมูล</div>
          </article>
          <article className="service-card">
            <div className="service-icon">☁️</div>
            <div className="service-title">DevOps & Infra</div>
            <div className="service-desc">CI/CD, Containerization, Monitoring เพื่อความเสถียรและความคล่องตัว</div>
          </article>
        </section>

        {/* Styled Form Panel (Showcase) */}
        <section className="service-panel" aria-labelledby="panel-title">
          <h2 id="panel-title" className="panel-title">ลองใช้งานแบบฟอร์ม — Form Showcase</h2>

          <div className="fields">
            {/* Username with left addon */}
            <div className="field">
              <label htmlFor="username">Username</label>
              <div className="addon-row">
                <span className="addon" aria-hidden="true">@</span>
                <input id="username" name="username" type="text" placeholder="yourname" aria-label="Username" />
              </div>
            </div>

            {/* Recipient with right addon */}
            <div className="field">
              <label htmlFor="recipient">Recipient7s username</label>
              <div className="addon-row" style={{ gridTemplateColumns: '1fr auto' }}>
                <input id="recipient" name="recipient" type="text" placeholder="recipient" aria-label="Recipient username" />
                <span className="addon" id="domain">@example.com</span>
              </div>
            </div>

            {/* Vanity URL with long left addon and helper */}
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label htmlFor="vanity">Your vanity URL</label>
              <div className="addon-row">
                <span className="addon" id="base-url">https://example.com/users/</span>
                <input id="vanity" name="vanity" type="text" aria-describedby="vanity-help" placeholder="username" />
              </div>
              <small id="vanity-help" className="help" style={{ color: 'var(--text-dim)' }}>
                Example help text goes outside the input group.
              </small>
            </div>

            {/* Amount with left and right addon */}
            <div className="field">
              <label htmlFor="amount">Amount</label>
              <div className="addon-row">
                <span className="addon" aria-hidden="true">$</span>
                <input id="amount" name="amount" type="text" aria-label="Amount (to the nearest dollar)" placeholder="0" />
                <span className="addon" aria-hidden="true">.00</span>
              </div>
            </div>

            {/* Username + @ + Server */}
            <div className="field">
              <label htmlFor="user">User & Server</label>
              <div className="addon-row">
                <input id="user" name="user" type="text" placeholder="username" aria-label="Username" />
                <span className="addon">@</span>
                <input id="server" name="server" type="text" placeholder="server" aria-label="Server" />
              </div>
            </div>

            {/* Textarea */}
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" rows={4} placeholder="Write something..." aria-label="With textarea" />
            </div>
          </div>
        </section>

        <div className="service-footer">
          © {new Date().getFullYear()} CMTC • Information Technology — Built with passion and neon
        </div>
      </div>
    </div>
  )
}

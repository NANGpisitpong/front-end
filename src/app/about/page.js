'use client'
import './about.css'

export default function Page() {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <section className="about-hero">
          <h1>แนะนำทีมงาน • สาขาวิชาเทคโนโลยีสารสนเทศ</h1>
          <p>
            พบกับทีมอาจารย์ของเราในโทน Modern Glass + Neon Gradient พร้อมเอฟเฟกต์โกลว์และการโต้ตอบที่ลื่นไหล
            ออกแบบมาให้ดูเท่ เรียบหรู และใช้งานได้บนทุกอุปกรณ์
          </p>
        </section>

        <section className="team-grid">
          <article className="team-card">
            <div className="img-wrap">
              <img src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Thapanan1.png" alt="อาจารย์ฐาปนันท์ ปัญญามี" />
            </div>
            <div className="card-content">
              <div className="card-name">อาจารย์ฐาปนันท์ ปัญญามี</div>
              <div className="card-role">อาจารย์ผู้สอน</div>
            </div>
          </article>

          <article className="team-card">
            <div className="img-wrap">
              <img src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Anuchat2.png" alt="อาจารย์อนุชาติ รังสิยานนท์" />
            </div>
            <div className="card-content">
              <div className="card-name">อาจารย์อนุชาติ รังสิยานนท์</div>
              <div className="card-role">อาจารย์ผู้สอน</div>
            </div>
          </article>

          <article className="team-card">
            <div className="img-wrap">
              <img src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/Tharit3.png" alt="อาจารย์ธฤต ไชยมงคล" />
            </div>
            <div className="card-content">
              <div className="card-name">อาจารย์ธฤต ไชยมงคล</div>
              <div className="card-role">อาจารย์ผู้สอน</div>
            </div>
          </article>

          <article className="team-card">
            <div className="img-wrap">
              <img src="https://it.cmtc.ac.th/wp-content/uploads/2025/05/TIT04-724x1024.png" alt="อาจารย์อมรินทร์ เลขะวณิชย์" />
            </div>
            <div className="card-content">
              <div className="card-name">อาจารย์อมรินทร์ เลขะวณิชย์</div>
              <div className="card-role">อาจารย์ผู้สอน</div>
            </div>
          </article>
        </section>

        <div className="about-footer">
          © {new Date().getFullYear()} CMTC • Information Technology — Crafted with love and neon
        </div>
      </div>
    </div>
  )
}

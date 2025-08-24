'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FaChartLine, FaMoneyBillWave } from 'react-icons/fa'
import './service.css'

/* ===== Dynamic Chart Import ===== */
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Chart), { ssr: false })

/* ===== Chart.js Setup ===== */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

/* ===== Plans Data ===== */
interface Plan {
  name: string
  price: string
  features: string[]
  description: string
  topDescription: string
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: '$29/month',
    features: ['Access to charts', 'Community support', 'Basic indicators'],
    description: 'เหมาะสำหรับมือใหม่ เริ่มต้นเรียนรู้และเทรดแบบเบื้องต้น',
    topDescription: 'เริ่มต้นเรียนรู้และทดลองเทรดอย่างปลอดภัย',
  },
  {
    name: 'Pro',
    price: '$59/month',
    features: ['All Basic features', 'Advanced indicators', 'Trading signals'],
    description: 'สำหรับผู้เทรดที่มีประสบการณ์ ต้องการสัญญาณและวิเคราะห์เชิงลึก',
    topDescription: 'สำหรับผู้ที่ต้องการวิเคราะห์ตลาดและสัญญาณเทรดแบบมืออาชีพ',
  },
  {
    name: 'Ultimate',
    price: '$99/month',
    features: ['All Pro features', '1-on-1 mentoring', 'Exclusive webinars'],
    description: 'ครบเครื่องสำหรับมืออาชีพ รับคำปรึกษาและการอบรมเฉพาะตัว',
    topDescription: 'แพ็กเกจเต็มรูปแบบ สำหรับมืออาชีพที่ต้องการ mentorship และ exclusive content',
  },
]

/* ===== Candle Data ===== */
const candleDataMap: Record<string, any> = {
  Basic: {
    datasets: [
      {
        label: 'Basic Candlestick',
        data: [
          { x: 'Mon', o: 130, h: 145, l: 120, c: 140 },
          { x: 'Tue', o: 140, h: 150, l: 130, c: 135 },
          { x: 'Wed', o: 135, h: 155, l: 130, c: 150 },
          { x: 'Thu', o: 150, h: 160, l: 140, c: 155 },
          { x: 'Fri', o: 155, h: 165, l: 150, c: 160 },
        ],
        borderColor: '#22c55e',
        backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
          ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
      },
    ],
  },
  Pro: {
    datasets: [
      {
        label: 'Pro Candlestick',
        data: [
          { x: 'Mon', o: 140, h: 155, l: 130, c: 150 },
          { x: 'Tue', o: 150, h: 160, l: 140, c: 155 },
          { x: 'Wed', o: 155, h: 165, l: 150, c: 160 },
          { x: 'Thu', o: 160, h: 170, l: 155, c: 165 },
          { x: 'Fri', o: 165, h: 175, l: 160, c: 170 },
        ],
        borderColor: '#22c55e',
        backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
          ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
      },
    ],
  },
  Ultimate: {
    datasets: [
      {
        label: 'Ultimate Candlestick',
        data: [
          { x: 'Mon', o: 150, h: 165, l: 140, c: 160 },
          { x: 'Tue', o: 160, h: 170, l: 150, c: 165 },
          { x: 'Wed', o: 165, h: 175, l: 160, c: 170 },
          { x: 'Thu', o: 170, h: 180, l: 165, c: 175 },
          { x: 'Fri', o: 175, h: 185, l: 170, c: 180 },
        ],
        borderColor: '#22c55e',
        backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
          ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
      },
    ],
  },
}

const candleOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { type: 'category' as const, grid: { color: 'rgba(255,255,255,0.1)' } },
    y: { grid: { color: 'rgba(255,255,255,0.1)' } },
  },
}

/* ===== Ticker Data ===== */
const TICKER_LIST = [
  'BTC +2.31%', 'ETH +1.12%', 'XAUUSD −0.42%', 'US500 +0.95%',
  'EURUSD +0.18%', 'AAPL +1.02%', 'NVDA +2.84%', 'USDJPY −0.21%',
  'TSLA +3.15%', 'GOOGL +1.67%', 'AMZN +0.89%', 'NFLX +2.45%',
  'META +1.23%', 'BABA +0.76%', 'MSFT +1.98%', 'SPY +0.55%',
  'DOGE +0.75%', 'SOL −0.30%', 'ADA +1.20%', 'DOT +0.85%',
]

const formatTicker = (text: string) => ({ text, color: text.includes('−') ? '#f87171' : '#22c55e' })
const mutateTickerValue = (item: { text: string; color: string }) => {
  const newText = item.text.replace(/([-+]?\d+\.\d+)%/, () => `${(Math.random() * 3 - 1.5).toFixed(2)}%`)
  return formatTicker(newText)
}

/* ===== Components ===== */
function Ticker({ data }: { data: { text: string; color: string }[] }) {
  return (
    <div className="ticker-background">
      <div className="ticker-marquee">{data.map((cell, idx) => (<span key={idx} style={{ color: cell.color }}>{cell.text}</span>))}</div>
      <div className="ticker-marquee2">{data.map((cell, idx) => (<span key={idx} style={{ color: cell.color }}>{cell.text}</span>))}</div>
    </div>
  )
}

function PlanCard({ plan, selected, onSelect }: { plan: Plan, selected: string, onSelect: (name: string) => void }) {
  const [ripple, setRipple] = useState(false)
  const handleClick = () => {
    setRipple(true)
    onSelect(plan.name)
    setTimeout(() => setRipple(false), 600)
  }

  return (
    <div className={`plan-card ${selected === plan.name ? 'selected neon-border' : ''}`} onClick={handleClick}>
      {ripple && <span className="ripple show"></span>}

      <div className="plan-content">
        <div className="plan-description-top">{plan.topDescription}</div>
        <h3 className="plan-name flame-text">{plan.name}</h3>
        <p className="plan-price hot-price">{plan.price}</p>
        <ul className="plan-features">{plan.features.map((f, i) => <li key={i}>🔥 {f}</li>)}</ul>
        <div className="plan-description">{plan.description}</div>
        <button className="plan-btn btn-fire">สมัครแพ็กเกจ</button>
      </div>
    </div>
  )
}

/* ===== Comparison Table ===== */
function ComparisonTable() {
  const rows = [
    { feature: 'Access to charts', plans: ['Basic', 'Pro', 'Ultimate'] },
    { feature: 'Community support', plans: ['Basic', 'Pro', 'Ultimate'] },
    { feature: 'Basic indicators', plans: ['Basic', 'Pro', 'Ultimate'] },
    { feature: 'Advanced indicators', plans: ['Pro', 'Ultimate'] },
    { feature: 'Trading signals', plans: ['Pro', 'Ultimate'] },
    { feature: '1-on-1 mentoring', plans: ['Ultimate'] },
    { feature: 'Exclusive webinars', plans: ['Ultimate'] },
  ]

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Features</th>
          {plans.map(plan => (
            <th key={plan.name} className="plan-header-cell">
              <div className="plan-header-bg-hot"></div>
              <div className="plan-header-content">
                <span className="plan-name flame-text">{plan.name}</span>
             
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? 'even-row' : ''}>
            <td className="feature-cell">{row.feature}</td>
            {plans.map(plan => (
              <td key={plan.name} className="checkmark-cell">
                {row.plans.includes(plan.name) ? <span className="checkmark">✔️</span> : <span className="crossmark">❌</span>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ===== Main Service Component ===== */
export default function Service() {
  const [selected, setSelected] = useState('Pro')
  const [gridData, setGridData] = useState(TICKER_LIST.map(formatTicker))

  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prev => {
        const idx = Math.floor(Math.random() * prev.length)
        return prev.map((item, i) => (i === idx ? mutateTickerValue(item) : item))
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="service-section-hot">
      <Ticker data={gridData} />
      <div className="service-header flame-header">
        <FaChartLine size={42} className="service-icon-green" />
        <h2 className="service-title flame-text">GreenPip Services</h2>
        <FaMoneyBillWave size={38} className="service-icon-yellow" />
      </div>
      <p className="service-desc hot-desc">เลือกแพ็กเกจที่เหมาะสำหรับคุณ — ตลาดกำลังเดือดอย่ารอช้า!</p>
      <div className="plan-container">
        {plans.map(plan => <PlanCard key={plan.name} plan={plan} selected={selected} onSelect={setSelected} />)}
      </div>
      <div className="comparison-table-wrapper">
        <ComparisonTable />
      </div>
    </section>
  )
}

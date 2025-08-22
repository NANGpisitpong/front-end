'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { FaChartLine, FaArrowUp, FaBitcoin, FaEthereum, FaApple, FaGoogle, FaMoneyBillWave } from 'react-icons/fa'
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
import 'chartjs-adapter-date-fns'
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Chart), { ssr: false })
import './service.css'

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
// Removed duplicate Chart declaration
// Plan data
const plans = [
  { 
    name: 'Basic', price: '$29/month', features: ['Access to charts','Community support','Basic indicators'], 
    description:'เหมาะสำหรับมือใหม่ เริ่มต้นเรียนรู้และเทรดแบบเบื้องต้น', 
    topDescription:'เริ่มต้นเรียนรู้และทดลองเทรดอย่างปลอดภัย', 
    image:'/images/bg3.png' 
  },
  { 
    name: 'Pro', price: '$59/month', features: ['All Basic features','Advanced indicators','Trading signals'], 
    description:'สำหรับผู้เทรดที่มีประสบการณ์ ต้องการสัญญาณและวิเคราะห์เชิงลึก', 
    topDescription:'สำหรับผู้ที่ต้องการวิเคราะห์ตลาดและสัญญาณเทรดแบบมืออาชีพ', 
    image:'/images/bg3.png' 
  },
  { 
    name: 'Ultimate', price: '$99/month', features: ['All Pro features','1-on-1 mentoring','Exclusive webinars'], 
    description:'ครบเครื่องสำหรับมืออาชีพ รับคำปรึกษาและการอบรมเฉพาะตัว', 
    topDescription:'แพ็กเกจเต็มรูปแบบ สำหรับมืออาชีพที่ต้องการ mentorship และ exclusive content', 
    image:'/images/bg3.png' 
  },
]

// -------- Chart Data Memoized --------
const candleDataMap = {
  Basic: {
    datasets: [{
      label: 'Basic Candlestick',
      data: [
        { x: 'Mon', o: 130, h: 145, l: 120, c: 140 },
        { x: 'Tue', o: 140, h: 150, l: 130, c: 135 },
        { x: 'Wed', o: 135, h: 155, l: 130, c: 150 },
        { x: 'Thu', o: 150, h: 160, l: 140, c: 155 },
        { x: 'Fri', o: 155, h: 165, l: 150, c: 160 },
      ],
      borderColor: '#22c55e',
      backgroundColor: (ctx) => ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
    }]
  },
  Pro: {
    datasets: [{
      label: 'Pro Candlestick',
      data: [
        { x: 'Mon', o: 140, h: 155, l: 130, c: 150 },
        { x: 'Tue', o: 150, h: 160, l: 140, c: 155 },
        { x: 'Wed', o: 155, h: 165, l: 150, c: 160 },
        { x: 'Thu', o: 160, h: 170, l: 155, c: 165 },
        { x: 'Fri', o: 165, h: 175, l: 160, c: 170 },
      ],
      borderColor: '#22c55e',
      backgroundColor: (ctx) => ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
    }]
  },
  Ultimate: {
    datasets: [{
      label: 'Ultimate Candlestick',
      data: [
        { x: 'Mon', o: 150, h: 165, l: 140, c: 160 },
        { x: 'Tue', o: 160, h: 170, l: 150, c: 165 },
        { x: 'Wed', o: 165, h: 175, l: 160, c: 170 },
        { x: 'Thu', o: 170, h: 180, l: 165, c: 175 },
        { x: 'Fri', o: 175, h: 185, l: 170, c: 180 },
      ],
      borderColor: '#22c55e',
      backgroundColor: (ctx) => ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
    }]
  }
}

const candleOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `O:${ctx.raw.o} H:${ctx.raw.h} L:${ctx.raw.l} C:${ctx.raw.c}`
      }
    }
  },
  scales: { 
    x: { type: "category", grid: { color: 'rgba(255,255,255,0.1)' } },
    y: { grid: { color: 'rgba(255,255,255,0.1)' } }
  }
}
// -------- Ticker Logic --------
const TICKER_LIST = [
  'BTC +2.31%', 'ETH +1.12%', 'XAUUSD −0.42%', 'US500 +0.95%', 'EURUSD +0.18%',
  'AAPL +1.02%', 'NVDA +2.84%', 'USDJPY −0.21%', 'TSLA +3.15%', 'GOOGL +1.67%',
  'AMZN +0.89%', 'NFLX +2.45%', 'META +1.23%', 'BABA +0.76%', 'MSFT +1.98%',
  'SPY +0.55%', 'BYBT +1.10%', 'DOGE +0.75%', 'SOL −0.30%', 'ADA +1.20%',
  'DOT +0.85%', 'LTC +2.00%', 'XRP +1.50%', 'LINK +1.80%','BNB +1.10%', 'XLM +0.90%', 'UNI +1.30%', 'AVAX +2.20%', 'MATIC +1.50%',
  'SHIB +0.60%', 'TRX +1.40%', 'CRO +0.80%', 'XMR +1.10%', 'ALGO +0.70%',
  'FIL +1.50%', 'VET +0.90%', 'XTZ +1.20%', 'EOS +0.80%', 'ZEC +1.10%'
]

const formatTicker = (text) => ({
  text,
  color: text.includes('−') ? '#f87171' : '#22c55e'
})

const mutateTickerValue = (item) => {
  const newText = item.text.replace(
    /([-+]?\d+\.\d+)%/,
    () => `${(Math.random() * 3 - 1.5).toFixed(2)}%`
  )
  return formatTicker(newText)
}

export default function Service() {
  const [selected, setSelected] = useState('Pro')
  const [gridData, setGridData] = useState(TICKER_LIST.map(formatTicker))

  // update ticker dynamically without regenerating whole array
  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prev => {
        const idx = Math.floor(Math.random() * prev.length)
        return prev.map((item, i) => i === idx ? mutateTickerValue(item) : item)
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="service-section">
      {/* Ticker Background */}
      <div className="ticker-background">
        <div className="ticker-marquee">
          {gridData.map((cell, idx) => (
            <span key={idx} style={{color: cell.color}}>{cell.text}</span>
          ))}
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem',marginBottom:'0.5rem'}}>
        <FaChartLine size={38} color="#22c55e" style={{filter:'drop-shadow(0 0 8px #22c55e)'}}/>
        <h2 className="service-title" style={{margin:0}}>GreenPip Services</h2>
        <FaMoneyBillWave size={32} color="#f59e0b" style={{filter:'drop-shadow(0 0 8px #f59e0b)'}}/>
      </div>
      <p className="service-subtitle" style={{fontWeight:600,letterSpacing:1}}>เลือกแพ็กเกจที่เหมาะกับคุณและเริ่มเทรดอย่างมืออาชีพ</p>
      <div className="stat-bar" style={{display:'flex',justifyContent:'center',gap:'2rem',marginBottom:'2rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',color:'#22c55e'}}><FaBitcoin/> BTC: <span style={{fontWeight:700}}>+2.31%</span> <FaArrowUp/></div>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',color:'#f87171'}}><FaEthereum/> ETH: <span style={{fontWeight:700}}>+1.12%</span> <FaArrowUp/></div>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',color:'#22c55e'}}><FaApple/> AAPL: <span style={{fontWeight:700}}>+1.02%</span> <FaArrowUp/></div>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',color:'#f87171'}}><FaGoogle/> GOOGL: <span style={{fontWeight:700}}>+1.67%</span> <FaArrowUp/></div>
      </div>

      <div className="plan-container">
        {plans.map(plan => (
          <div 
            key={plan.name} 
            className={`plan-card ${plan.name.toLowerCase()} ${selected===plan.name?'selected':''}`} 
            onClick={()=>setSelected(plan.name)}
          >
            {plan.name === 'Pro' && <div className="plan-badge">Most Popular</div>}
            {plan.name === 'Ultimate' && <div className="plan-badge ultimate-badge">Premium</div>}

            <div className="plan-description-top">{plan.topDescription}</div>
            <img src={plan.image} alt={plan.name} className="plan-image"/>
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-price">{plan.price}</p>

         <div className="plan-chart" style={{background:'rgba(34,197,94,0.07)',borderRadius:'0.75rem',boxShadow:'0 0 16px #22c55e33'}}>
            <Chart data={candleDataMap[plan.name]} options={candleOptions} type='candlestick' />
            <div style={{marginTop:'-2.5rem',marginBottom:'0.5rem'}}>
              <Chart
                data={{
                  labels: ['Mon','Tue','Wed','Thu','Fri'],
                  datasets: [{
                    label: 'Trend',
                    data: candleDataMap[plan.name].datasets[0].data.map((d)=>d.c),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.15)',
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                  }]
                }}
                options={{
                  responsive:true,
                  plugins:{legend:{display:false}},
                  scales:{x:{display:false},y:{display:false}}
                }}
                type='line'
                height={40}
              />
            </div>
            {/* Monthly Bar Chart */}
            <div style={{marginTop:'0.5rem'}}>
              <Chart
                data={{
                  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
                  datasets: [{
                    label: 'Monthly Growth',
                    data: [12, 18, 22, 15, 30, 28, 35, 40],
                    backgroundColor: 'rgba(34,197,94,0.7)',
                    borderRadius: 8,
                  }]
                }}
                options={{
                  responsive:true,
                  plugins:{legend:{display:false}},
                  scales:{
                    x:{grid:{color:'rgba(255,255,255,0.08)'},ticks:{color:'#22c55e'}},
                    y:{grid:{color:'rgba(255,255,255,0.08)'},ticks:{color:'#22c55e'}}
                  }
                }}
                type='bar'
                height={60}
              />
            </div>
         </div>

            <ul className="plan-features">
              {plan.features.map((f,i)=><li key={i}>✔ {f}</li>)}
            </ul>
            <div className="plan-description">{plan.description}</div>
            <button type="button" className="plan-btn" style={{boxShadow:'0 0 12px #22c55e',fontSize:'1.1rem',letterSpacing:'1px',fontWeight:700}}>สมัครแพ็กเกจ</button>
          </div>
        ))}
      </div>

      <div className="comparison-table">
        <table>
          <thead>
            <tr><th>Feature</th><th>Basic</th><th>Pro</th><th>Ultimate</th></tr>
          </thead>
          <tbody>
            <tr><td>Charts Access</td><td>✔️</td><td>✔️</td><td>✔️</td></tr>
            <tr><td>Advanced Indicators</td><td>❌</td><td>✔️</td><td>✔️</td></tr>
            <tr><td>Trading Signals</td><td>❌</td><td>✔️</td><td>✔️</td></tr>
            <tr><td>1-on-1 Mentoring</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Exclusive Webinars</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Real-time Alerts</td><td>❌</td><td>✔️</td><td>✔️</td></tr>
            <tr><td>Portfolio Analysis</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Priority Support</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Community Access</td><td>✔️</td><td>✔️</td><td>✔️</td></tr>
            <tr><td>API Access</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Custom Alerts</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Exclusive Reports</td><td>❌</td><td>❌</td><td>✔️</td></tr>
            <tr><td>Trading Challenges & Rewards</td><td>❌</td><td>❌</td><td>✔️</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
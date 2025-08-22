'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FaChartLine, FaMoneyBillWave } from 'react-icons/fa'
import './service.css'

// ===== Dynamic import Chart (no SSR) =====
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Chart), { ssr: false })

// ===== Chart.js Registration =====
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
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  CandlestickController, CandlestickElement, Title, Tooltip, Legend, TimeScale
)

// ===== Plans Data =====
interface Plan {
  name: string
  price: string
  features: string[]
  description: string
  topDescription: string
  image: string
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: '$29/month',
    features: ['Access to charts','Community support','Basic indicators'],
    description:'เหมาะสำหรับมือใหม่ เริ่มต้นเรียนรู้และเทรดแบบเบื้องต้น',
    topDescription:'เริ่มต้นเรียนรู้และทดลองเทรดอย่างปลอดภัย',
    image:'/images/bg3.png'
  },
  {
    name: 'Pro',
    price: '$59/month',
    features: ['All Basic features','Advanced indicators','Trading signals'],
    description:'สำหรับผู้เทรดที่มีประสบการณ์ ต้องการสัญญาณและวิเคราะห์เชิงลึก',
    topDescription:'สำหรับผู้ที่ต้องการวิเคราะห์ตลาดและสัญญาณเทรดแบบมืออาชีพ',
    image:'/images/bg3.png'
  },
  {
    name: 'Ultimate',
    price: '$99/month',
    features: ['All Pro features','1-on-1 mentoring','Exclusive webinars'],
    description:'ครบเครื่องสำหรับมืออาชีพ รับคำปรึกษาและการอบรมเฉพาะตัว',
    topDescription:'แพ็กเกจเต็มรูปแบบ สำหรับมืออาชีพที่ต้องการ mentorship และ exclusive content',
    image:'/images/bg3.png'
  },
]

// ===== Candle Data =====
const candleDataMap: Record<string, any> = {
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
      backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
        ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
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
      backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
        ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
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
      backgroundColor: (ctx: { raw: { o: number; c: number } }) =>
        ctx.raw.o < ctx.raw.c ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)',
    }]
  }
}

const candleOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { type: "category" as const, grid: { color: 'rgba(255,255,255,0.1)' } },
    y: { grid: { color: 'rgba(255,255,255,0.1)' } }
  }
}

// ===== Ticker =====
const TICKER_LIST = [
  'BTC +2.31%', 'ETH +1.12%', 'XAUUSD −0.42%', 'US500 +0.95%',
  'EURUSD +0.18%', 'AAPL +1.02%', 'NVDA +2.84%', 'USDJPY −0.21%',
  'TSLA +3.15%', 'GOOGL +1.67%', 'AMZN +0.89%', 'NFLX +2.45%',
  'META +1.23%', 'BABA +0.76%', 'MSFT +1.98%', 'SPY +0.55%',
  'DOGE +0.75%', 'SOL −0.30%', 'ADA +1.20%', 'DOT +0.85%'
]
const formatTicker = (text: string) => ({ text, color: text.includes('−') ? '#f87171' : '#22c55e' })
const mutateTickerValue = (item: {text:string,color:string}) => {
  const newText = item.text.replace(
    /([-+]?\d+\.\d+)%/, () => `${(Math.random()*3-1.5).toFixed(2)}%`
  )
  return formatTicker(newText)
}

// ===== Components =====
function Ticker({ data }: { data: {text:string,color:string}[] }) {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="whitespace-nowrap animate-marquee text-lg font-semibold">
        {data.map((cell, idx) => (
          <span key={idx} className="mx-6" style={{color: cell.color}}>
            {cell.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function PlanCard({ plan, selected, onSelect }: { plan: Plan, selected: string, onSelect: (name:string)=>void }) {
  return (
    <div 
      className={`relative rounded-2xl p-6 bg-gray-900/60 backdrop-blur-xl shadow-lg border transition transform hover:scale-105 hover:shadow-green-500/40 ${selected===plan.name?'border-green-400':'border-gray-700'}`}
      onClick={()=>onSelect(plan.name)}
    >
      {plan.name==='Pro' && <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
      {plan.name==='Ultimate' && <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">Premium</div>}

      <div className="text-center mb-4">
        <div className="text-sm text-green-400">{plan.topDescription}</div>
        <img src={plan.image} alt={plan.name} className="w-24 h-24 mx-auto my-4 rounded-full border border-green-400 shadow-md" />
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="text-green-400 font-bold text-xl">{plan.price}</p>
      </div>

      <div className="bg-black/40 rounded-xl p-3 shadow-inner mb-4">
        <Chart data={candleDataMap[plan.name]} options={candleOptions} type='candlestick' height={180}/>
      </div>

      <ul className="space-y-1 text-sm mb-3">
        {plan.features.map((f,i)=><li key={i}>✔ {f}</li>)}
      </ul>

      <div className="text-gray-300 text-sm mb-4">{plan.description}</div>
      <button className="w-full py-2 bg-green-500 text-black font-bold rounded-lg shadow-lg hover:bg-green-400 transition">
        สมัครแพ็กเกจ
      </button>
    </div>
  )
}

function ComparisonTable() {
  const rows = [
    ['Charts Access','✔️','✔️','✔️'],
    ['Advanced Indicators','❌','✔️','✔️'],
    ['Trading Signals','❌','✔️','✔️'],
    ['1-on-1 Mentoring','❌','❌','✔️'],
    ['Exclusive Webinars','❌','❌','✔️'],
    ['Real-time Alerts','❌','✔️','✔️'],
    ['Portfolio Analysis','❌','❌','✔️'],
    ['Priority Support','❌','❌','✔️'],
    ['Community Access','✔️','✔️','✔️'],
    ['API Access','❌','❌','✔️'],
    ['Custom Alerts','❌','❌','✔️'],
    ['Exclusive Reports','❌','❌','✔️'],
    ['Trading Challenges & Rewards','❌','❌','✔️'],
  ]
  return (
    <div className="overflow-x-auto mt-12">
      <table className="w-full text-sm text-center border border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-green-500 text-black font-bold">
          <tr>
            <th className="p-2">Feature</th>
            <th className="p-2">Basic</th>
            <th className="p-2">Pro</th>
            <th className="p-2">Ultimate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} className={`${i%2===0?'bg-gray-800/50':'bg-gray-900/50'}`}>
              {row.map((col,j)=><td key={j} className="p-2 border border-gray-700">{col}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== Main Component =====
export default function Service() {
  const [selected, setSelected] = useState('Pro')
  const [gridData, setGridData] = useState(TICKER_LIST.map(formatTicker))

  useEffect(() => {
    const interval = setInterval(() => {
      setGridData(prev => {
        const idx = Math.floor(Math.random()*prev.length)
        return prev.map((item,i)=>i===idx?mutateTickerValue(item):item)
      })
    }, 2000)
    return ()=>clearInterval(interval)
  }, [])

  return (
    <section className="relative py-12 px-4 md:px-12 text-white bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      <Ticker data={gridData} />

      <div className="flex items-center justify-center gap-4 mb-6">
        <FaChartLine size={42} className="text-green-500 drop-shadow-[0_0_12px_#22c55e]" />
        <h2 className="text-3xl font-bold tracking-wide">GreenPip Services</h2>
        <FaMoneyBillWave size={38} className="text-yellow-500 drop-shadow-[0_0_12px_#f59e0b]" />
      </div>

      <p className="text-center text-lg font-semibold mb-10">
        เลือกแพ็กเกจที่เหมาะกับคุณและเริ่มเทรดอย่างมืออาชีพ
      </p>

      <div className="grid md:grid-cols-3 gap-8 z-10 relative">
        {plans.map(plan=>(
          <PlanCard key={plan.name} plan={plan} selected={selected} onSelect={setSelected} />
        ))}
      </div>

      <ComparisonTable />
    </section>
  )
}

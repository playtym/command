import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowUpRight, ArrowDownRight, PieChart, Activity, 
  TrendingUp, Shield, Globe, Zap, ChevronRight, Sparkles, ArrowRight, RotateCcw
} from 'lucide-react'
import { Page, ScrollRow, stagger } from '../components/UI'
import { Sparkline, Donut, SegmentBar, Bar, Ring } from '../components/Charts'

/* ─── Data ─── */
const holdings = [
  { name: 'Parag Parikh Flexi', type: 'Equity MF', invested: 1450000, current: 1822000, sip: 15000, trend: [172, 174, 176, 178, 177, 180, 182] },
  { name: 'Quant Small Cap', type: 'Equity MF', invested: 760000, current: 1244000, sip: 10000, trend: [108, 112, 116, 118, 120, 122, 124] },
  { name: 'HDFC MidCap Opps', type: 'Equity MF', invested: 580000, current: 810000, sip: 10000, trend: [74, 76, 77, 79, 78, 80, 81] },
  { name: 'SGB 2028', type: 'Gold Bond', invested: 480000, current: 550000, sip: 0, trend: [52, 53, 54, 55, 55, 56, 55] },
]

const netWorthGrowth = [38, 40, 42, 44, 47, 50, 54, 57, 61, 65, 70, 73, 75]

const actionItems = [
  {
    id: 'rebalance',
    icon: Shield,
    color: '#EF4444', // RED
    bg: '#FEF2F2',
    title: 'Medium Term: 73% Equity',
    subtitle: 'Move ₹1.2 L to Debt NOW',
    benefit: 'Protect Gains',
    context: "My medium term bucket has 73% equity allocation against a target of 30%. Help me rebalance by moving ₹1.2L from high-risk equity to debt."
  },
  {
    id: 'insurance-gap',
    icon: Shield,
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'No Term Insurance',
    subtitle: '₹1 Cr cover costs just ₹800/mo',
    benefit: 'Protection Gap',
    context: "I don't have any term insurance. I'm 32 with a ₹75L portfolio and dependents. What's the right term plan coverage and which provider should I pick?"
  }
]

const marketInsights = [
  {
    id: 'gold-correction',
    icon: Sparkles,
    color: '#D97706', // Gold-ish Amber
    bg: '#FFFBEB',
    title: 'Your Gold is Down',
    subtitle: 'Wait, or Buy More?',
    benefit: 'SGB @ ₹5788',
    context: "Gold prices corrected by 4%. I currently have 11% exposure (₹0.51L) in SGB. Should I use this dip to increase it to 15%?"
  },
  {
    id: 1,
    icon: Globe,
    color: '#3B82F6',
    bg: '#EFF6FF',
    title: 'Fed Rate Cut',
    subtitle: 'Watch your PPFAS Fund',
    benefit: 'US Stock Impact',
    context: "The US Fed cut rates by 50bps. How will this specifically impact the US equity portion of my Parag Parikh Flexi Cap fund?"
  },
  {
    id: 4,
    icon: Activity,
    color: '#6366F1',
    bg: '#EEF2FF',
    title: 'XIRR Breakdown',
    subtitle: 'You vs Nifty 50',
    benefit: 'Alpha: +8.2%',
    context: "My portfolio XIRR is 23.4% vs Nifty's 15.2%. Can you breakdown which funds are generating this alpha?"
  },
  {
    id: 2,
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Infra Boom',
    subtitle: 'Add SBI Bluechip?',
    benefit: 'High Growth',
    context: "Infrastructure sector is booming. I don't hold any infra-specific funds. Should I add SBI Bluechip or an Infra thematic fund to my portfolio?"
  },
]

/* ─── Flippable Card Wrapper ─── */
const cardStyle = {
  minWidth: 'calc(100% - 24px)',
  scrollSnapAlign: 'center',
  height: '62vh',
  perspective: 1200,
  borderRadius: 40,
}

const faceBase = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  borderRadius: 40,
  padding: '36px 32px 32px',
  border: 'none',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.10)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

function FlipCard({ front, back, bg = '#FFFFFF' }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={cardStyle} onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', cursor: 'pointer' }}
      >
        {/* Front */}
        <div style={{ ...faceBase, background: bg, color: '#0F172A' }}>
          {/* Tap hint */}
          <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 2, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
            <RotateCcw size={10} /> Tap to flip
          </div>
          {front}
        </div>
        {/* Back */}
        <div style={{ ...faceBase, background: bg, color: '#0F172A', transform: 'rotateY(180deg)' }}>
          <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 2, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
            <RotateCcw size={10} /> Tap to flip
          </div>
          {back}
        </div>
      </motion.div>
    </div>
  )
}

export default function Money() {
  const navigate = useNavigate()

  return (
    <Page paddingTop={100} bg="#F5F5F4">
      <motion.div variants={stagger.container} initial="hidden" animate="show">
      {/* ─── Header ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1.5, color: '#0F172A', lineHeight: 1.05 }}>
          Invest<span style={{ color: '#4F46E5' }}>.</span>
        </h1>
      </motion.div>

      {/* ─── Hero Swipeable Deck ─── */}
      <motion.div variants={stagger.item} style={{ marginBottom: 32 }}>
        <ScrollRow gap={16} style={{ paddingBottom: 10 }}>

            {/* ═══ Card 1: Net Worth — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #EEF2FF 0%, #E0E7FF 100%)"
              front={
                <>
                  {/* Compact top label */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                      Total Wealth
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>
                      75% to ₹1Cr
                    </div>
                  </div>

                  {/* Ring + Amount hero block */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                    <Ring percent={75} size={88} stroke={8} color="#4F46E5" track="rgba(79,70,229,0.12)">
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#4F46E5' }}>75%</span>
                    </Ring>
                    <div>
                      <h4 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', letterSpacing: -2.5, lineHeight: 1 }}>
                        ₹75L
                      </h4>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#10B981', marginTop: 4 }}>
                        +₹16.8L profit
                      </div>
                    </div>
                  </div>

                  {/* Growth chart — full width, prominent */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>12-Month Growth</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#4F46E5' }}>18% XIRR</span>
                    </div>
                    <Sparkline data={netWorthGrowth} width={280} height={120} color="#4F46E5" strokeW={2.5} />
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                        SIP ₹35k/mo • Invested ₹58.2L
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "Analyze my full portfolio of ₹75L across equity, debt, and gold. Show me complete breakdown and suggest optimizations." } }) }}
                      style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>View Breakdown</span>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={22} strokeWidth={3} />
                      </div>
                    </button>
                  </div>
                </>
              }
              back={
                <>
                  {/* Back: Donut Chart + Breakdown */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Wealth Map</span>
                      <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>₹75L across 5 asset classes</p>
                    </div>
                    <Donut size={80} stroke={10} segments={[
                      { value: 65, color: '#4F46E5' },
                      { value: 17, color: '#0EA5E9' },
                      { value: 7, color: '#F59E0B' },
                      { value: 8, color: '#10B981' },
                      { value: 3, color: '#8B5CF6' },
                    ]}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#0F172A' }}>75L</span>
                    </Donut>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Equity MFs', value: '₹48.8L', pct: 65, color: '#4F46E5', xirr: '22.1%' },
                      { label: 'Debt / FDs', value: '₹13.0L', pct: 17, color: '#0EA5E9', xirr: '7.4%' },
                      { label: 'Gold (SGB)', value: '₹5.5L', pct: 7, color: '#F59E0B', xirr: '14.8%' },
                      { label: 'Liquid', value: '₹6.0L', pct: 8, color: '#10B981', xirr: '5.2%' },
                      { label: 'NPS', value: '₹1.7L', pct: 3, color: '#8B5CF6', xirr: '11.6%' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color }} />
                            <span>{item.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>{item.xirr}</span>
                            <span>{item.value} <span style={{ color: '#94A3B8', fontWeight: 500 }}>({item.pct}%)</span></span>
                          </div>
                        </div>
                        <Bar value={item.pct} max={100} color={item.color} h={6} delay={i * 0.1} />
                      </div>
                    ))}
                  </div>
                  {/* Growth sparkline */}
                  <div style={{ paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>SIP/MO</div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>₹35k</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, letterSpacing: 0.5 }}>INVESTED</div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: '#4F46E5' }}>₹58.2L</div>
                      </div>
                    </div>
                    <Sparkline data={netWorthGrowth} width={80} height={32} color="#4F46E5" strokeW={2} />
                  </div>
                </>
              }
            />

            {/* ═══ Card 2: Portfolio Mix — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #ECFDF5 0%, #D1FAE5 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Portfolio Mix
                    </div>
                    <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ fontSize: 52, fontWeight: 900, color: '#0F172A', marginBottom: 24, letterSpacing: -2.8, lineHeight: 0.92 }}>
                      4 Buckets
                    </h4>
                    <p style={{ fontSize: 20, color: '#64748B', lineHeight: 1.5, fontWeight: 600, letterSpacing: -0.4, maxWidth: '95%' }}>
                      Your ₹75L split by time horizon — from instant access to 10yr+ wealth.
                    </p>
                    <div style={{ marginTop: 16 }}>
                      <SegmentBar height={8} segments={[
                        { value: 65, color: '#4F46E5' },
                        { value: 17, color: '#0EA5E9' },
                        { value: 7, color: '#F59E0B' },
                        { value: 8, color: '#10B981' },
                      ]} />
                      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        {[
                          { l: 'Eq', p: 65, c: '#4F46E5' },
                          { l: 'Debt', p: 17, c: '#0EA5E9' },
                          { l: 'Gold', p: 7, c: '#F59E0B' },
                          { l: 'Cash', p: 8, c: '#10B981' },
                        ].map((a, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: a.c }} />
                            {a.l} {a.p}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                        ⚠️ Equity 5% Over Target
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "Analyze my portfolio allocation across 4 buckets — Liquid ₹6L, Short ₹9L, Medium ₹15L, Long ₹45L. Am I balanced?" } }) }}
                      style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Rebalance</span>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={22} strokeWidth={3} />
                      </div>
                    </button>
                  </div>
                </>
              }
              back={
                <>
                  {/* Back: Time-Horizon Allocation */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Horizon Buckets</span>
                    <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>₹75L split by when you need the money</p>
                  </div>

                  {/* Stacked segment bar */}
                  <div style={{ marginBottom: 16 }}>
                    <SegmentBar height={14} segments={[
                      { value: 8, color: '#10B981' },
                      { value: 12, color: '#0EA5E9' },
                      { value: 20, color: '#F59E0B' },
                      { value: 60, color: '#4F46E5' },
                    ]} />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Liquid', horizon: '< 6 months', value: '₹6.0L', pct: 8, color: '#10B981', detail: 'Savings + Liquid Fund', xirr: '5.2%' },
                      { label: 'Short Term', horizon: '6mo – 2yr', value: '₹9.0L', pct: 12, color: '#0EA5E9', detail: 'FDs + Short Duration Debt', xirr: '7.8%' },
                      { label: 'Medium Term', horizon: '2 – 5yr', value: '₹15.0L', pct: 20, color: '#F59E0B', detail: 'Hybrid + Balanced MFs', xirr: '12.4%' },
                      { label: 'Long Term', horizon: '5yr+', value: '₹45.0L', pct: 60, color: '#4F46E5', detail: 'Equity MFs + NPS + SGB', xirr: '22.1%' },
                    ].map((bucket, i) => (
                      <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: bucket.color }} />
                            <span style={{ fontSize: 14, fontWeight: 800 }}>{bucket.label}</span>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{bucket.horizon}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: bucket.xirr.startsWith('-') ? '#DC2626' : '#16A34A' }}>{bucket.xirr} XIRR</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: bucket.color }}>{bucket.value}</span>
                          </div>
                        </div>
                        <Bar value={bucket.pct} max={100} color={bucket.color} h={5} delay={i * 0.1} />
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{bucket.detail}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 14, background: '#FEF2F2', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#B91C1C', lineHeight: 1.4 }}>
                    ⚠️ Medium bucket 73% in equity — rebalance ₹1.2L to debt
                  </div>
                </>
              }
            />

            {/* ═══ Card 3: Top Movers — FLIPPABLE ═══ */}
            <FlipCard
              bg="linear-gradient(165deg, #FFFBEB 0%, #FEF3C7 100%)"
              front={
                <>
                  {/* Header: Pill Label + Circle Dot */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, background: 'rgba(255,255,255,0.5)', padding: '10px 18px', borderRadius: 100 }}>
                      Top Gainers
                    </div>
                    <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ fontSize: 52, fontWeight: 900, color: '#0F172A', marginBottom: 24, letterSpacing: -2.8, lineHeight: 0.92 }}>
                      +64% Best
                    </h4>
                    <p style={{ fontSize: 20, color: '#64748B', lineHeight: 1.5, fontWeight: 600, letterSpacing: -0.4, maxWidth: '95%' }}>
                      Quant Small Cap leading your portfolio this year. But regime is shifting.
                    </p>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {[
                          { name: 'Quant', ret: '+64%', color: '#10B981' },
                          { name: 'HDFC', ret: '+41%', color: '#F59E0B' },
                          { name: 'PPFAS', ret: '+28%', color: '#4F46E5' },
                        ].map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.6)', padding: '5px 10px', borderRadius: 10 }}>
                            <div style={{ width: 6, height: 6, borderRadius: 3, background: f.color }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{f.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: f.color }}>{f.ret}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Callout + CTA pinned to bottom */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', marginBottom: 12 }}>
                      <div style={{ background: '#FEF08A', border: '2px solid #0F172A', borderRadius: 14, padding: '9px 14px', fontSize: 14, fontWeight: 800, color: '#0F172A', boxShadow: '3px 3px 0px #0F172A' }}>
                        +8.2% Alpha vs Nifty
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/advisor', { state: { initialQuery: "Show me all my fund returns: Quant Small Cap +64%, HDFC MidCap +41%, PPFAS +28%, SGB +14%. Should I book profits in small caps?" } }) }}
                      style={{ width: '100%', padding: '24px', borderRadius: 32, background: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer', boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.25)' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, textTransform: 'uppercase', opacity: 0.7, letterSpacing: 1, marginBottom: 2 }}>Action</span>
                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>View All Funds</span>
                      </div>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={22} strokeWidth={3} />
                      </div>
                    </button>
                  </div>
                </>
              }
              back={
                <>
                  {/* Back: Fund Performance with Sparklines */}
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8 }}>Fund Returns</span>
                    <p style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>1-year performance with trend</p>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { name: 'Quant Small Cap', ret: '+64%', val: '₹12.4L', trend: [60, 72, 68, 85, 90, 98, 108, 112, 118, 120, 124], color: '#10B981', risk: 'High' },
                      { name: 'HDFC MidCap', ret: '+41%', val: '₹8.1L', trend: [58, 62, 64, 68, 72, 74, 76, 78, 80, 81], color: '#F59E0B', risk: 'Med' },
                      { name: 'PPFAS Flexi', ret: '+28%', val: '₹18.2L', trend: [142, 148, 152, 158, 162, 168, 172, 176, 180, 182], color: '#4F46E5', risk: 'Low' },
                      { name: 'SGB 2028', ret: '+14%', val: '₹5.5L', trend: [48, 49, 50, 51, 52, 53, 54, 55, 55], color: '#D97706', risk: 'Low' },
                    ].map((fund, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.5)', borderRadius: 14 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>{fund.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 900, color: fund.color }}>{fund.ret}</span>
                            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>{fund.val}</span>
                          </div>
                        </div>
                        <Sparkline data={fund.trend} width={100} height={28} color={fund.color} strokeW={2} />
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 14, background: '#ECFDF5', borderRadius: 14, marginTop: 'auto', fontSize: 13, fontWeight: 700, color: '#065F46', lineHeight: 1.4 }}>
                    ✅ Portfolio Sharpe: 1.7 — Above Nifty benchmark (1.2)
                  </div>
                </>
              }
            />
        </ScrollRow>


      </motion.div>

      {/* ─── Action Items (Compact) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Attention Needed
          </h3>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          {actionItems.map((item, i) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/advisor', { state: { activeItem: item, context: 'money', allItems: actionItems }})}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 16px',
                borderBottom: i < actionItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{item.subtitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.color}15`, padding: '5px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{item.benefit}</span>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Market Intelligence (Compact) ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Market Intelligence
          </h3>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: 'none', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          {marketInsights.map((item, i) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/advisor', { state: { activeItem: item, context: 'market', allItems: marketInsights }})}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 16px',
                borderBottom: i < marketInsights.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{item.subtitle}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.color}15`, padding: '5px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>{item.benefit}</span>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Holdings List ─── */}
      <motion.div variants={stagger.item} style={{ marginTop: 32, marginBottom: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Top Holdings
          </h3>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 8, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', border: 'none' }}>
          {holdings.map((h, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '16px 12px',
              borderBottom: i < holdings.length - 1 ? '1px solid #F1F5F9' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>{h.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{h.type}{h.sip > 0 ? ` • SIP ₹${h.sip/1000}k` : ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>₹{(h.current/100000).toFixed(1)}L</div>
                <div style={{ 
                  fontSize: 12, fontWeight: 600, 
                  color: h.current > h.invested ? '#10B981' : '#EF4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2
                }}>
                  {h.current > h.invested ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.round(((h.current - h.invested)/h.invested)*100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      </motion.div>
    </Page>
  )
}
